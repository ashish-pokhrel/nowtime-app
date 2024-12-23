"use client";
import { useState } from "react";
import { FaEdit, FaEnvelope, FaEye, FaEyeSlash, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Layout from "../../component/navbar";

const Profile = () => {
  // User data with initial visibility settings
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    location: "Dallas, TX",
    showEmail: true, // Initial visibility for email
    showPhoneNo: false, // Initial visibility for phone
  };

  // State to manage visibility of email and phone
  const [showEmail, setShowEmail] = useState(user.showEmail);
  const [showPhone, setShowPhone] = useState(user.showPhoneNo);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        {/* Profile Card */}
        <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-2xl p-8">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
              <img
                src="https://via.placeholder.com/150" // Replace with user's profile picture
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name and Job Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
            <p className="text-gray-400 text-lg">{user.location}</p>
            <button className="mt-4 px-6 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-md flex items-center justify-center gap-2">
              <FaEdit />
              Edit Profile
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email Section */}
            <div className="flex items-center gap-4 text-gray-300">
              <FaEnvelope className="text-xl" />
              {showEmail ? (
                <span className="text-lg">{user.email}</span>
              ) : (
                <span className="text-gray-500 italic text-lg">Hidden</span>
              )}
              <button
                onClick={() => setShowEmail(!showEmail)}
                className="ml-auto text-gray-400 hover:text-white"
                title={showEmail ? "Hide Email" : "Show Email"}
              >
                {showEmail ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Phone Section */}
            <div className="flex items-center gap-4 text-gray-300">
              <FaPhone className="text-xl" />
              {showPhone ? (
                <span className="text-lg">{user.phone}</span>
              ) : (
                <span className="text-gray-500 italic text-lg">Hidden</span>
              )}
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="ml-auto text-gray-400 hover:text-white"
                title={showPhone ? "Hide Phone" : "Show Phone"}
              >
                {showPhone ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 text-gray-300">
              <FaMapMarkerAlt className="text-xl" />
              <span className="text-lg">{user.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
