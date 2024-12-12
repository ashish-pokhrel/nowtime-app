"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link from next/link
import { FaArrowLeft, FaThumbsUp, FaComment, FaShare } from "react-icons/fa"; // Import the icons
import { fetchData } from "../../../../utils/axios"; // Assuming fetchData is in utils/axios.ts

// Define types for the post and user data
type User = {
  name: string;
  profileImage: string;
  timePosted: string;
};

type Post = {
  user: User;
  description: string;
  postImages: string[];
  likes: number;
  comments: number;
  shares: number;
};

type Box = {
  title: string;
  description: string;
};

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [box, setBox] = useState<Box>({ title: "", description: "" });
  const [postList, setPostList] = useState<Post[]>([]); // Define the type of postList as an array of Post
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const paramsData = await params;
      setResolvedParams(paramsData); // Set the resolved params data
    };
    fetchParams();
  }, [params]);

  // Ensure resolvedParams is available before fetching data
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchDetails = async () => {
      const { id } = resolvedParams;
      try {
        // Fetch box details
        const postList = await fetchData(`/post?groupId=${id}&page=1&pageSize=5`);
        setPostList(postList.data.posts);
      } catch (error) {
        setError("Failed to load data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [resolvedParams]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-white">{error}</div>;
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
              {post.postImages.map((image, index) => (
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
                <button className="flex items-center gap-2 hover:text-blue-500">
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
