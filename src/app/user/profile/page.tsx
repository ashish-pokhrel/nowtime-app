"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaEnvelope, FaEye, FaEyeSlash, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Layout from "../../component/navbar";
import { fetchData } from "../../../utils/axios";
import Link from "next/link";

type User = {
  fullName: string;
  profileImage: string;
  email: string;
  phoneNumber: string;
};

const Profile = (params: { userId?: string }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedUser, setIsLoggedUser] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userId = params.userId ?? "";
        const data = await fetchData(`/user/${userId}`);
        setUserData(data.data.user);
        setIsLoggedUser(data?.data.isLoggedUser);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [params.userId]);

  return (
    <Layout backHref="/feed/All">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <span>Loading...</span>
        </div>
      ) : (
        userData && (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-2xl p-8 space-y-8">
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
                  <img
                    src={userData.profileImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name and Job Title */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100">{userData.fullName}</h2>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Email Section */}
                <div className="flex items-center gap-4 text-gray-300 cursor-pointer">
                  <FaEnvelope className="text-xl" />
                  <span className="text-lg">{userData.email}</span>
                </div>

                {/* Phone Section */}
                <div className="flex items-center gap-4 text-gray-300 cursor-pointer">
                  <FaPhone className="text-xl" />
                  <span className="text-lg">{userData.phoneNumber ? userData.phoneNumber : "N/A"}</span>
                </div>

                {/* Chat Link */}
                {!isLoggedUser &&(<div className="text-center">
                  <Link href={`/chat/${userData.fullName}`}>
                    <button className="mt-4 px-6 py-2 text-lg bg-blue-600 hover:bg-blue-500 rounded-full transition-all cursor-pointer">
                      Chat with {userData.fullName}
                    </button>
                  </Link>
                </div>)}
              </div>
            </div>
          </div>
        )
      )}
      {!userData && !loading && (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <span>Error loading profile, please try again later.</span>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
