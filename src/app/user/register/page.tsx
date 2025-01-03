"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postFileData } from "../../../utils/axios";
import Logo from "../../../app/component/logo";
import { EXPIRE_MINUTES, accessTokenLocalStorage, userGuidLocalStorage, profileImageLocalStorage, tokenExpiresInLocalStorage } from "../../../constant/constants";

type requestData = {
  firstName: string;
  middleName: string;
  lastName: string;
  profileImage: File | null;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export default function UserRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState<requestData>({
    firstName: '',
    middleName: '',
    lastName: '',
    profileImage: null,
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    validation: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setErrors((prev) => ({ ...prev, validation: "" }));
    if (name === "profileImage") {
      const file = files ? files[0] : null;
      if (file != null) {
        setFormData((prev) => ({ ...prev, profileImage: file }));
      }
      // Generate image preview
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null); // Clear preview if no file is selected
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "password") {
        validatePassword(value);
      }
      if (name === "confirmPassword") {
        validateConfirmPassword(value, formData?.password || "");
      }
    }
  };

  const validatePassword = (password: string) => {
    const criteria = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!criteria.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.password || errors.confirmPassword) {
      alert("Please fix the errors in the form.");
      return;
    }

    try {
      const data = new FormData();
      data.append("firstName", formData?.firstName || "");
      data.append("middleName", formData?.middleName || "");
      data.append("lastName", formData?.lastName || "");
      if (formData?.profileImage) {
        data.append("profileImage", formData?.profileImage || "");
      }
      data.append("email", formData?.email || "");
      data.append("phoneNumber", formData?.phoneNumber || "");
      data.append("password", formData?.password || "");
      data.append("confirmPassword", formData?.confirmPassword || "");

      const response = await postFileData("/user/register", data);
      if(response.status == 200)
      {
        const currentDateTime = new Date();
        currentDateTime.setMinutes(currentDateTime.getMinutes() + EXPIRE_MINUTES);
        sessionStorage.setItem(tokenExpiresInLocalStorage, currentDateTime.toISOString());
        const { jwtToken, refreshToken, profileImage } = response.data.user;
        sessionStorage.setItem(accessTokenLocalStorage, jwtToken);
        sessionStorage.setItem(userGuidLocalStorage, refreshToken);
        sessionStorage.setItem(profileImageLocalStorage, profileImage);
        router.push("/feed/All");
      }
      else
      {
        setErrors((prev) => ({ ...prev, validation: response.detail || response.Detail }));
      }
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      <div className="w-full max-w-4xl bg-gray-c-800 rounded-lg shadow-2xl p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-indigo-400 mb-6 sm:mb-8">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Name Fields in a Row */}
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-300 font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700 text-sm"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-300 font-medium mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700 text-sm"
                placeholder="Enter your middle name"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-300 font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700 text-sm"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Email (User Name) *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700 text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Fields */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700 text-sm"
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700 text-sm"
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700 text-sm"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="mt-4 max-w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Validation Errors */}
          {errors.validation && (
            <p className="text-red-500 text-sm mt-2">
              {errors.validation}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}