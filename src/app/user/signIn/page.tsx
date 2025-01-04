"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "../../../utils/axios";
import Logo from "../../../app/component/logo";
import { EXPIRE_MINUTES, accessTokenLocalStorage, userGuidLocalStorage, profileImageLocalStorage, tokenExpiresInLocalStorage, GOOGLE_CLIENT_ID } from "../../../constant/constants";
import Link from "next/link";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    deviceInfo: "",
  });

  const [errors, setErrors] = useState({
    validation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getDeviceInfo = () => {
    return `${navigator.userAgent}, ${navigator.platform}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formData.deviceInfo === "" || formData.deviceInfo === null) {
      setFormData((prev) => ({
        ...prev,
        deviceInfo: getDeviceInfo(),
      }));
    }
    setErrors((prev) => ({ ...prev, validation: "" }));
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
      if (response?.status === 200) {
        const currentDateTime = new Date();
        currentDateTime.setMinutes(currentDateTime.getMinutes() + EXPIRE_MINUTES);
        sessionStorage.setItem(tokenExpiresInLocalStorage, currentDateTime.toISOString());
        const { jwtToken, refreshToken, profileImage } = response.data.user;
        sessionStorage.setItem(accessTokenLocalStorage, jwtToken);
        sessionStorage.setItem(userGuidLocalStorage, refreshToken);
        sessionStorage.setItem(profileImageLocalStorage, profileImage);
        router.push("/");
      } else {
        setErrors((prev) => ({ ...prev, validation: response?.data.detail || response?.data.Detail }));
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/user/register");
  };

  const handleGoogleLogin = async (response: any) => {
    setLoading(true);
    try {
      const res = await postData("/user/signin-google", { token: response.credential, deviceInfo: getDeviceInfo()});
      if (res?.status === 200) {
        const currentDateTime = new Date();
        currentDateTime.setMinutes(currentDateTime.getMinutes() + EXPIRE_MINUTES);
        sessionStorage.setItem(tokenExpiresInLocalStorage, currentDateTime.toISOString());
        const { jwtToken, refreshToken, profileImage } = res.data.user;
        sessionStorage.setItem(accessTokenLocalStorage, jwtToken);
        sessionStorage.setItem(userGuidLocalStorage, refreshToken);
        sessionStorage.setItem(profileImageLocalStorage, profileImage);
        router.push("/");
      } else {
        setError(res?.data?.detail || "Google Sign-In failed.");
      }
    } catch (err) {
      setError("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r bg-black to-black relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-gray-c-800 text-white rounded-lg shadow-lg p-8 z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
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
          {errors.validation && (
            <p className="text-red-500 text-sm mt-2">{errors.validation}</p>
          )}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-2 px-6 rounded-full transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin mx-auto"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
          {/* Google Sign-In */}
          <div className="mt-6 flex justify-center">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="max-w-md py-3  text-gray-700 font-semibold shadow-md hover:shadow-lg transition duration-200 focus:ring-2 focus:ring-blue-500">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed")}
                useOneTap
                theme="outline"
                shape="circle"
                width="auto"
                text="continue_with" // Sets the text to "Continue with Google"
              />
            </div>
          </GoogleOAuthProvider>
        </div>

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
      <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} <Link href="/" className="hover:underline">mangopuff.com</Link></p>
      </footer>
    </div>
  );
}
