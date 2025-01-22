"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaComment,
  FaUsers,
  FaPlane,
  FaShoppingCart,
  FaBriefcase,
  FaHospital,
  FaUserFriends,
  FaCar,
} from "react-icons/fa";
import { fetchData } from "../utils/axios";
import Logo from "../app/component/logo";
import { accessTokenLocalStorage, CACHE_KEY } from "../constant/constants";

type Box = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
};

const iconMap: { [key: string]: React.ReactNode } = {
  "fa-home": <FaHome />,
  "fa-comments": <FaComment />,
  "fa-users": <FaUsers />,
  "fa-plane": <FaPlane />,
  "fa-shopping-cart": <FaShoppingCart />,
  "fa-briefcase": <FaBriefcase />,
  "fa-health": <FaHospital />,
  "fa-immigration": <FaUserFriends />,
  "fa-ride": <FaCar />,
};

export default function Home() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const cachedBoxes = localStorage.getItem(CACHE_KEY);
        if (cachedBoxes) {
          setBoxes(JSON.parse(cachedBoxes));
          setLoading(false); 
        }
        else
        {
          const data = await fetchData("/group");
          setBoxes(data?.data || []);
          localStorage.setItem(CACHE_KEY, JSON.stringify(data?.data || []));
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(accessTokenLocalStorage)) {
      setIsSignedIn(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-700 shadow-lg rounded-lg p-6 animate-pulse"
          >
            <div className="h-20 w-20 bg-gray-500 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-500 mb-2"></div>
            <div className="h-4 bg-gray-500"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="mb-4">
        <Logo />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <Link
            key={box.id}
            href={{
              pathname: `/feed/${box.id}`,
            }}
            aria-label={`View details of ${box.title}`}
            className="bg-gray-c-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition cursor-pointer border-t-4"
            style={{
              borderTopColor: box.color,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl">{iconMap[box.icon] || <FaHome />}</div>
              <h2 className="text-2xl font-semibold mt-4">{box.title}</h2>
              <p className="text-gray-300 mt-2 text-center">{box.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <footer className="mt-12 text-center text-gray-400">
        <div className="text-sm">
          <Link href="policy/terms" className="hover:underline underline">
            Terms of Use
          </Link>
          {" | "}
          <Link href="policy/privacypolicy" className="hover:underline underline">
            Privacy Policy
          </Link>
          {!isSignedIn && (
            <span>
              {" | "}
              <Link href="user/signIn" className="hover:underline underline">
                Sign In
              </Link>
            </span>
          )}
        </div>
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="hover:underline">
            mangopuff.com
          </Link>
        </p>
      </footer>
    </div>
  );
}
