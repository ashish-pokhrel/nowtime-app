import { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import Link from "next/link";
import { postData } from "../../utils/axios";
import Slider from "react-slick";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await postData(`post/unlike/${post.id}`, { groupId });
        setLikes(likes - 1);
      } else {
        await postData(`post/like/${post.id}`, { groupId });
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like/unlike:", error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedImageIndex,
    centerMode: true, // For better view
    focusOnSelect: true, // Auto-select slide on click
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const imagesToShow = post.postImages.slice(0, 2);
  const remainingImages = post.postImages.length - 2;

  const handleMoreImagesClick = () => {
    setSelectedImageIndex(2);
    setIsModalOpen(true);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const modal = document.getElementById("modal");
    if (modal && !modal.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyPress);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isModalOpen]);

  return (
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

      <div className="relative mb-4">
        {post.postImages.length > 2 && (
          <div
            className="absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-lg cursor-pointer"
            onClick={handleMoreImagesClick}
          >
            <span>{`+${remainingImages} more`}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {imagesToShow.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
          <div
            id="modal"
            className="relative bg-white p-4 rounded-lg w-11/12 max-w-3xl h-[80vh] overflow-auto"
          >
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={handleCloseModal}
            >
              &times; {/* Close button */}
            </button>
            <Slider {...sliderSettings}>
              {post.postImages.map((image, index) => (
                <div key={index} className="px-4 py-2">
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg border-2 border-gray-600"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
}
