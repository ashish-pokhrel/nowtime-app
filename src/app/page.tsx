"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHome, FaTaxi, FaUsers, FaPlane } from "react-icons/fa"; // Import icons from react-icons
import { fetchData } from "../utils/axios"; // Import the fetchData function

type Box = {
  id: number;
  title: string;
  icon: string;  // Icon will be a string like 'fa-home', 'fa-taxi', etc.
  description: string;
};

// Map icon strings to React icon components
const iconMap: { [key: string]: React.ReactNode } = {
  "fa-home": <FaHome />,
  "fa-taxi": <FaTaxi />,
  "fa-users": <FaUsers />,
  "fa-plane": <FaPlane />,
  // Add more mappings as needed
};

export default function Home() {
  const [boxes, setBoxes] = useState<Box[]>([]); // State to store the fetched data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading state
  const [error, setError] = useState<string>(""); // State to handle any error during fetch

  useEffect(() => {
    // Fetch data from Group API when component mounts
    const fetchGroups = async () => {
      try {
        const data = await fetchData("/group"); // The endpoint to fetch groups
        setBoxes(data); // Set the fetched data into state
        setLoading(false); // Update loading state
      } catch (err) {
        setError("Failed to fetch groups");
        setLoading(false); // Update loading state
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Interactive Landing Page
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <Link
          key={box.id}
          href={`/homepage/groupdetails/${box.id}`} // Updated path
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition cursor-pointer"
        >
          <div className="flex flex-col items-center">
            {/* Render the icon dynamically based on the icon string */}
            <div className="text-4xl">
              {iconMap[box.icon] || <FaHome />} {/* Default to FaHome if icon not found */}
            </div>
            <h2 className="text-2xl font-semibold mt-4 text-gray-900 dark:text-white">
              {box.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-center">
              {box.description}
            </p>
          </div>
        </Link>
        ))}
      </div>
    </div>
  );
}
