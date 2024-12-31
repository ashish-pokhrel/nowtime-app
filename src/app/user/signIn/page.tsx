"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "../../../utils/axios";
import Logo from "../../../app/component/logo";
import {EXPIRE_MINUTES, accessTokenLocalStorage, userGuidLocalStorage, profileImageLocalStorage, tokenExpiresInLocalStorage} from "../../../constant/constants";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceInfo: "", 
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state

  // Get device information
  const getDeviceInfo = () => {
    return `${navigator.userAgent}, ${navigator.platform}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    const updatedFormData = {
      ...formData,
      deviceInfo: getDeviceInfo(),
    };

    try {
      const response = await postData("/user/signin", updatedFormData);

      const currentDateTime = new Date();
      currentDateTime.setMinutes(currentDateTime.getMinutes() + EXPIRE_MINUTES);
      sessionStorage.setItem(tokenExpiresInLocalStorage, currentDateTime.toISOString());
      const { jwtToken, refreshToken, profileImage } = response.user;
      sessionStorage.setItem(accessTokenLocalStorage, jwtToken);
      sessionStorage.setItem(userGuidLocalStorage, refreshToken);
      sessionStorage.setItem(profileImageLocalStorage, profileImage);

      router.push("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false); 
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/user/register");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-black relative">
      {/* Centered Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Logo at Top Left */}
      <div className="absolute top-4 left-4">
        <Logo />
      </div>

      {/* Sign-In Form */}
      <div className="w-full max-w-md bg-gray-900 text-white rounded-lg shadow-lg p-8 z-10">
        {/* <h1 className="text-3xl font-bold text-center text-gray-200 mb-8">Sign In</h1> */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300"
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
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin mx-auto"></div> // Tailwind CSS spinner
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <span className="text-gray-300">Don't have an account?</span>
          <button
            onClick={handleRegisterRedirect}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            Register
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} <Link href="/"  className="hover:underline"> mangopuff.com </Link></p>
      </footer>
    </div>
  );
}
