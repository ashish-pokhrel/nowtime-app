"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHome, FaComment, FaUsers, FaPlane, FaShoppingCart, FaBriefcase } from "react-icons/fa"; // Import icons from react-icons
import { fetchData } from "../utils/axios"; // Import the fetchData function

type Box = {
  id: string;
  title: string;
  icon: string;  // Icon will be a string like 'fa-home', 'fa-taxi', etc.
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
  "fa-briefcase": <FaBriefcase/>
};

export default function Home() {
  const [boxes, setBoxes] = useState<Box[]>([]); // State to store the fetched data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading state
  const [error, setError] = useState<string>(""); // State to handle any error during fetch

  // Fetch groups from the API on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await fetchData("/group"); // Fetch the data from the API
        setBoxes(data.data); // Set the fetched data into state
        setLoading(false); // Update loading state
      } catch (err: any) {
        console.error(err); // Log error for debugging
        setError(err.message || "Failed to fetch groups"); // Update error state
        setLoading(false); // Update loading state
      }
    };

    fetchGroups(); // Call the function to fetch groups
  }, []); // Run once when the component mounts

  // Show skeleton loader while data is being fetched
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-300 dark:bg-gray-700 shadow-lg rounded-lg p-6 animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Show error message if there was an issue fetching the data
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900"> {/* Light/Dark Mode Background */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
       GO FOR IT
      </h1>

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
              borderTopColor: box.color, // Use the color from the API for the border top
            }}
          >
            <div className="flex flex-col items-center">
              {/* Render the icon dynamically based on the icon string */}
              <div className="text-4xl" style={{ color: box.color }}>
                {iconMap[box.icon] || <FaHome />} {/* Fallback to FaHome if icon not found */}
              </div>
              <h2 className="text-2xl font-semibold mt-4 text-gray-900 dark:text-white">
                {box.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-center">
                {box.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
