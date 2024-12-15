"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import { fetchData, postFileData } from "../../../../utils/axios"; // Utility function for API calls
import Link from "next/link"; // Import Link from next/link
import { FaArrowLeft } from "react-icons/fa"; 

type Box = {
  id: number;
  title: string;
  icon: string; // Icon will be a string like 'fa-home', 'fa-taxi', etc.
  description: string;
  color: string;
};

export default function AddPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | "">(""); // Dropdown state
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (params.value) {
      const parsedParams = JSON.parse(params.value); // Parse the JSON string to an object
      setSelectedBox(Number(parsedParams.id)); // Set the selectedBox using the parsed 'id'
    }
    const fetchGroups = async () => {
      try {
        const data = await fetchData("/group"); // Fetch the data from the API
        setBoxes(data.data); // Set the fetched data into state
      } catch (err: any) {
        console.error(err); // Log error for debugging
        setError(err.message || "Failed to fetch groups"); // Update error state
      }
    };

    fetchGroups(); // Call the function to fetch groups
  }, []); // Run once when the component mounts

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Validation for required fields
    if (selectedBox === "" || !description) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("groupId", selectedBox.toString()); // Ensure it's sent as a string
      images.forEach((file) => formData.append("images", file));

      const response = await postFileData("https://localhost:7288/api/post", formData);
      
      // Redirect upon success
      router.push(`/post/feed/${selectedBox}`);
    } catch (err) {
      console.error(err);
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Link href="/" className="absolute top-8 left-8 text-xl text-white hover:text-gray-400">
        <FaArrowLeft />
      </Link>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 text-white"
            placeholder="Write your post description here..."
            required
          />
        </div>

        {/* Dropdown for Boxes */}
        <div>
          <label htmlFor="box" className="block text-gray-300 mb-2">
            Select Box
          </label>
          <select
            id="box"
            value={selectedBox}
            onChange={(e) => setSelectedBox(Number(e.target.value) || "")}
            className="w-full p-4 rounded-lg bg-gray-800 text-white"
            required
          >
            <option value="">Select a box</option>
            {boxes.map((box) => (
              <option key={box.id} value={box.id}>
                {box.title}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-gray-300 mb-2">
            Upload Images
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="text-white"
          />
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="flex space-x-4 mb-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          {loading ? (
            <p className="text-blue-500">Submitting...</p>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add Post"}
            </button>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
}
