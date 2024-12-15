import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { fetchData } from "../../../utils/axios";

export default function PostDetailsPage() {
  const router = useRouter();
  const { postId } = router.query; // Get the postId from the route
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPostDetails = async () => {
      try {
        const response = await fetchData(`/post/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Failed to fetch post details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center text-white">Post not found</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <button
        onClick={() => router.back()} // Navigate back to the previous page
        className="text-white text-xl hover:text-gray-400 mb-8"
      >
        <FaArrowLeft />
      </button>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
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
        <p className="text-gray-300 mb-4">{post.description}</p>
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
    </div>
  );
}
