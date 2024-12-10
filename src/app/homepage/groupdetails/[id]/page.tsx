"use client";
import Link from "next/link"; // Import Link from next/link
import { FaArrowLeft, FaThumbsUp, FaComment, FaShare } from "react-icons/fa"; // Import the icons
import { useState, useEffect } from "react";
import { fetchDetail } from "@/utils/axios"; // Import your fetchData utility
import { useParams } from "next/navigation"; // Use useParams hook to get params

export default function DetailsPage() {
  const params = useParams(); // Get params using useParams hook
  const { id } = params; // Unwrap params object to get the id

  const [postList, setPostList] = useState<any[]>([]); // State for storing the list of posts
  const [box, setBox] = useState<{ title: string; description: string }>({
    title: `Box ${id}`,
    description: `Detailed description for box ${id}`,
  });
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        if (!id) {
          setError("Box ID is missing");
          setLoading(false);
          return;
        }
        // Fetch posts related to the box
        const postsData = await fetchDetail(`post`, id);
        setPostList(postsData);

        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchDataFromAPI(); // Fetch data when the component mounts
  }, [id]); // Re-fetch data if `id` changes

  const handleLike = async (postId: string) => {
    // Optimistic UI update - increment like count before sending request
    setPostList(prevPostList =>
      prevPostList.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );

    try {
      // Send a POST request to the API to update the like count
      const response = await fetch(`/api/post/like/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to like the post');
      }

      // Optionally: handle server response (e.g., show a success message)
      console.log(data.message);
    } catch (error) {
      // Revert the like count in case of an error
      setPostList(prevPostList =>
        prevPostList.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes - 1 }
            : post
        )
      );
      setError("Failed to update like count.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message until data is fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there is an issue
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white relative">
      {/* Arrow Icon to Go Back to Landing Page */}
      <Link href="/" className="absolute top-8 left-8 text-xl text-white hover:text-gray-400">
        <FaArrowLeft />
      </Link>

      {/* Box Title */}
      <h1 className="text-4xl font-bold text-center mb-8">{box.title}</h1>
      <p className="text-center text-gray-400 mb-8">{box.description}</p>

      {/* List of Posts */}
      <div className="space-y-8">
        {postList.map((post, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            {/* User Info */}
            <div className="flex items-center mb-4">
              <img
                src={post.user.profileImage}
                alt={`${post.user.name}'s profile`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="font-semibold text-white">{post.user.name}</h2>
                <p className="text-gray-500 text-sm">{post.user.timePosted}</p>
              </div>
            </div>

            {/* Post Description */}
            <p className="text-gray-300 mb-4">{post.description}</p>

            {/* Post Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {post.postImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Like, Comment, Share */}
            <div className="flex items-center justify-between text-gray-400">
              <div className="flex gap-6">
                <button 
                  className="flex items-center gap-2 hover:text-blue-500" 
                  onClick={() => handleLike(post.id)}
                >
                  <FaThumbsUp /> Like {post.likes}
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <FaComment /> Comment {post.comments}
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <FaShare /> Share {post.shares}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
