"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "../../../utils/axios";
import Logo from "../../../app/component/logo";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await postData("/user/signin", formData);

      const currentDateTime = new Date();
      currentDateTime.setMinutes(currentDateTime.getMinutes() + 1);
      localStorage.setItem("tokenExpiresIn", currentDateTime.toISOString());
      const { jwtToken, refreshToken, email, fullName, profileImage} = response.user;
      localStorage.setItem("accessToken", jwtToken);
      localStorage.setItem("userGuid", refreshToken);
      localStorage.setItem("profileImage", profileImage);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          fullName,
        })
      );

      console.log("Login successful:", response);
      router.push("/");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Error during login:", error);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/user/register");
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In");
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook Sign-In");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Logo at Top Left */}
      <div className="absolute top-4 left-4">
        <Logo />
      </div>

      {/* Sign-In Form */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-2 px-6 rounded-full transition duration-300"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Google and Facebook Sign-In */}
        <div className="text-center mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mb-3 w-full"
          >
            Sign In with Google
          </button>
          <button
            onClick={handleFacebookSignIn}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 w-full"
          >
            Sign In with Facebook
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <span className="text-gray-700">Don't have an account?</span>
          <button
            onClick={handleRegisterRedirect}
            className="ml-2 text-blue-500 hover:text-blue-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
