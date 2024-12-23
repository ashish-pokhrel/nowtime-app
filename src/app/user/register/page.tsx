"use client";
import { useState } from "react";
import { postFileData } from "../../../utils/axios";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    profileImage: null,
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prev) => ({ ...prev, profileImage: files ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "password") {
        validatePassword(value);
      }
      if (name === "confirmPassword") {
        validateConfirmPassword(value, formData.password);
      }
    }
  };

  const validatePassword = (password: string) => {
    const criteria =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, one uppercase, one lowercase, one number, and one special character
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

    // Check if there are any validation errors
    if (errors.password || errors.confirmPassword) {
      alert("Please fix the errors in the form.");
      return;
    }
    
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("middleName", formData.middleName || "");
      data.append("lastName", formData.lastName);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber || "");
      data.append("password", formData.password);
      data.append("confirmPassword", formData.confirmPassword);

      // Call the postFileData function to submit the form data
      const response = await postFileData("/user/register", data);
      console.log("Registration successful:", response);
      // Handle success (e.g., redirect or display success message)
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">User Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your middle name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Re-enter your password"
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-2 px-6 rounded-full transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
