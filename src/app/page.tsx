"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHome, FaComment, FaUsers, FaPlane, FaShoppingCart, FaBriefcase } from "react-icons/fa";
import { fetchData } from "../utils/axios";
import Logo from "../app/component/logo";

type Box = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
};

// Map icon strings to React icon components
const iconMap: { [key: string]: React.ReactNode } = {
  "fa-home": <FaHome />,
  "fa-comments": <FaComment />,
  "fa-users": <FaUsers />,
  "fa-plane": <FaPlane />,
  "fa-shopping-cart": <FaShoppingCart />,
  "fa-briefcase": <FaBriefcase />,
};

export default function Home() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch groups from the API on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await fetchData("/group");
        setBoxes(data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch groups");
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Show skeleton loader while data is being fetched
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-300 dark:bg-gray-700 shadow-lg rounded-lg p-6 animate-pulse">
            {/* Skeleton Loader Content */}
            <div className="h-20 w-20 bg-gray-400 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-400 mb-2"></div>
            <div className="h-4 bg-gray-400"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show error message if there was an issue fetching the data
  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
     
      <div className="text-3xl font-semibold text-center text-indigo-400 mb-8 typing-effect">
      <Logo />
      </div>
      {/* Display the list of groups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <Link
            key={box.id}
            href={{
              pathname: `/feed/${box.id}`
            }}
            aria-label={`View details of ${box.title}`}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition cursor-pointer border-t-4"
            style={{
              borderTopColor: box.color,
            }}
          >
            <div className="flex flex-col items-center">
              {/* Render the icon dynamically based on the icon string */}
              <div className="text-4xl" style={{ color: box.color }}>
                {iconMap[box.icon] || <FaHome />} {/* Fallback to FaHome if icon not found */}
              </div>
              <h2 className="text-2xl font-semibold mt-4 text-gray-900 dark:text-white">{box.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-center">{box.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
        <div className="text-sm">
          <Link href="policy/terms" className="hover:underline underline">
            Terms of Use
          </Link>
          {" | "}
          <Link href="policy/privacypolicy" className="hover:underline underline">
            Privacy Policy
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()}  <Link href="/"  className="hover:underline"> mangopuff.com </Link></p>
      </footer>
    </div>
  );
}
