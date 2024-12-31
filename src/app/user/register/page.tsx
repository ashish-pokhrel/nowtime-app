"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postFileData } from "../../../utils/axios";
import Logo from "../../../app/component/logo";
import { EXPIRE_MINUTES, accessTokenLocalStorage, userGuidLocalStorage, profileImageLocalStorage, tokenExpiresInLocalStorage } from "../../../constant/constants";

type requestData = 
{
  firstName: string,
  middleName: string,
  lastName: string,
  profileImage: File | null,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
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
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    
    if (name === "profileImage") {
      const file = files ? files[0] : null;
      if(file != null)
      {
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
    const criteria =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!criteria.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
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

      const currentDateTime = new Date();
      currentDateTime.setMinutes(currentDateTime.getMinutes() + EXPIRE_MINUTES);
      sessionStorage.setItem(tokenExpiresInLocalStorage, currentDateTime.toISOString());
      const { jwtToken, refreshToken, profileImage } = response.user;
      sessionStorage.setItem(accessTokenLocalStorage, jwtToken);
      sessionStorage.setItem(userGuidLocalStorage, refreshToken);
      sessionStorage.setItem(profileImageLocalStorage, profileImage);

      router.push("/feed/All");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl font-semibold text-center text-indigo-400 mb-8">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields in a Row */}
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-300 font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData?.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700"
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
                value={formData?.middleName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700"
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
                value={formData?.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700"
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
              value={formData?.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Fields */}
          {[
            { label: "Password", name: "password" },
            { label: "Confirm Password", name: "confirmPassword" },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-gray-300 font-medium mb-2">
                {field.label} *
              </label>
              <input
                type="password"
                name={field.name}
                value={formData?[field.name] : ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700"
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                required
              />
              {errors[field.name as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-2">
                  {errors[field.name as keyof typeof errors]}
                </p>
              )}
            </div>
          ))}

          {/* Profile Image Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-300 bg-gray-700"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-indigo-600"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-2 px-8 rounded-lg transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
