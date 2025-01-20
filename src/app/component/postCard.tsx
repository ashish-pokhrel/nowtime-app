import { useState, useEffect, useRef } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import Link from "next/link";
import { postData } from "../../utils/axios";
import Slider from "react-slick";

type Post = {
  id: string;
  groupId: string;
  userId: string;
  userFullName: string;
  profileImage: string;
  description: string;
  images: {
    id: number;
    postId: string;
    imageUrl: string;
  }[];
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  timePosted: string;
  timeElapsed: string,
  isLikedByCurrentUser: boolean;
  postLocation: string
};

type PostCardProps = {
  post: Post;
  groupId: string;
};

export default function PostCard({ post, groupId }: PostCardProps) {
  const [likes, setLikes] = useState(post.totalLikes);
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const sliderRef = useRef<any>(null);

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
    } catch {
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedImageIndex,
    centerMode: true,
    focusOnSelect: true,
    arrows: false,
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

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const imagesToShow = post.images.slice(0, 2);
  const remainingImages = post.images.length - 2;

  const handleMoreImagesClick = () => {
    setSelectedImageIndex(2);
    setIsModalOpen(true);
  };

  const handlePrevClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  // Share functionality
  const handleShareClick = async () => {
    const postDetails = {
      url: `${window.location.origin}/post/comment/${groupId}/${post.id}`, 
    };

    try {
      if (navigator.share) {
        await navigator.share({
          url: postDetails.url,
        });
      } else {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postDetails.url)}`;
        window.open(shareUrl, "_blank");
      }
    } catch {
    }
  };

  // Render description with see more functionality
  const truncatedDescription = post.description?.slice(0, 200);
  const shouldTruncate = post.description?.length > 200;
  const descriptionToShow = isDescriptionExpanded
    ? post.description
    : truncatedDescription;

  return (
    <div className="bg-gray-c-800 p-6 rounded-lg shadow-md max-w-full sm:max-w-4xl mx-auto w-full">
      <div className="flex items-center mb-4">
        <Link href={`/user/profile/${post?.userId}`}>
          <img
            src={post?.profileImage}
            alt={`${post?.userFullName}'s profile`}
            className="w-12 h-12 rounded-full mr-4"
          />
        </Link>
        <div>
          <Link href={`/user/profile/${post?.userId}`}>
            <h2 className="font-semibold text-white">{post?.userFullName}</h2>
          </Link>
          <p className="text-gray-500 text-sm">{post.timeElapsed}</p>
          <p className="text-gray-500 text-sm">{post.postLocation}</p>
        </div>
      </div>

      <p className="text-gray-300 mb-4">
        {descriptionToShow}
        {shouldTruncate && !isDescriptionExpanded && (
          <button
            onClick={() => setIsDescriptionExpanded(true)}
            className="text-blue-500 ml-1"
          >
            See more...
          </button>
        )}
        {isDescriptionExpanded && shouldTruncate && (
          <button
            onClick={() => setIsDescriptionExpanded(false)}
            className="text-blue-500 ml-1"
          >
            See less...
          </button>
        )}
      </p>

      <div className="relative mb-4">
        {post.images.length > 2 && (
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
              key={index + Math.random()}
              src={image.imageUrl}
              alt={`Post image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-400">
        <div className="flex gap-6">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 ${
              isLiked ? "text-blue-500" : "hover:text-blue-500"
            }`}
            aria-label={isLiked ? "UnPuff" : "Puff"}
          >
            <FaThumbsUp className="text-lg" />
            <span>{isLiked ? "UnPuff" : "Puff"}</span>
            <span>{likes}</span>
          </button>

          {/* Comment Button */}
          <button className="flex items-center gap-2 hover:text-blue-500">
            <Link
              href={`/post/comment/${groupId}/${post.id}`}
              className="flex items-center gap-2"
              aria-label={`View comments (${post.totalComments})`}
            >
              <FaComment className="text-lg" />
              <span>Comment</span>
              <span>{post.totalComments}</span>
            </Link>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="flex items-center gap-2 hover:text-blue-500"
            aria-label="Share"
          >
            <FaShare className="text-lg" />
            <span>Share</span>
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
              &times;
            </button>
            <Slider
              ref={sliderRef}
              {...sliderSettings}
              className="custom-slider"
            >
              {post.images.map((image, index) => (
                <div key={index + Math.random()} className="px-4 py-2">
                  <img
                    src={image.imageUrl}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg border-2 border-gray-600"
                  />
                </div>
              ))}
            </Slider>
            <button
              onClick={handlePrevClick}
              className="absolute top-1/2 left-4 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2"
            >
              &lt;
            </button>
            <button
              onClick={handleNextClick}
              className="absolute top-1/2 right-4 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
