import { useState } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import Link from "next/link";
import { postData } from "../../utils/axios";

type User = {
  name: string;
  profileImage: string;
  timePosted: string;
};

type Post = {
  id: number;
  user: User;
  description: string;
  postImages: string[];
  likes: number;
  totalComments: number;
  shares: number;
};

type PostCardProps = {
  post: Post;
  groupId: string;
};

export default function PostCard({ post, groupId }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        // Unlike the post
        await postData(`post/unlike/${post.id}`, { groupId });
        setLikes(likes - 1);
      } else {
        // Like the post
        await postData(`post/like/${post.id}`, { groupId });
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked); // Toggle the like state
    } catch (error) {
      console.error("Error toggling like/unlike:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
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
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 ${
              isLiked ? "text-blue-500" : "hover:text-blue-500"
            }`}
          >
            <FaThumbsUp /> {isLiked ? "Unlike" : "Like"} {likes}
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <Link href={`/post/comment/${groupId}/${post.id}`}>
              <FaComment /> Comment {post.totalComments}
            </Link>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <FaShare /> Share {post.shares}
          </button>
        </div>
      </div>
    </div>
  );
}
