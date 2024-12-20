"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link"; // Import Link from next/link
import { FaArrowLeft, FaThumbsUp, FaComment, FaShare } from "react-icons/fa"; // Import the icons
import { fetchData } from "../../../../utils/axios"; // Assuming fetchData is in utils/axios.ts
import PostCard from "../../../component/postCard";

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

type Box = {
  title: string;
  description: string;
};

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [box, setBox] = useState<Box>({ title: "", description: "" });
  const [postList, setPostList] = useState<Post[]>([]); // Define the type of postList as an array of Post
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); // Flag to check if more posts are available
  const [page, setPage] = useState(1); // Current page
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false); // Flag to prevent multiple API requests

  useEffect(() => {
    const fetchParams = async () => {
      const paramsData = await params;
      setResolvedParams(paramsData); // Set the resolved params data
    };
    fetchParams();
  }, [params]);

  const fetchDetails = useCallback(async () => {
    if (!resolvedParams || !hasMore || loadingMore) return; // Prevent request if loading or no more posts

    const { id } = resolvedParams;
    setLoadingMore(true); // Set loading flag to true before starting the API request

    try {
      // Fetch box details and posts
      const postData = await fetchData(`/post?groupId=${id}&page=${page}&pageSize=5`);
      if(postData == undefined)
      {
        setHasMore(false);
      }
      else
      {
        setPostList((prevPosts) => [...prevPosts, ...postData.data.posts]); // Append new posts to the existing list
        setHasMore(postData.data.posts.length > 0); // Check if there are more posts to load
      }
    } catch (error) {
      setError("Failed to load data");
      console.error(error);
    } finally {
      setLoadingMore(false); // Reset the loading flag after the request is complete
      setLoading(false);
    }
  }, [resolvedParams, page, hasMore, loadingMore]);

  useEffect(() => {
    fetchDetails();
  }, [resolvedParams, page]);

  // Scroll event to check if user reached the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight;

      if (scrollPosition >= bottomPosition - 100 && hasMore && !loadingMore) { // 100px before bottom
        setPage((prevPage) => prevPage + 1); // Load next page when reaching near the bottom
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadingMore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative">
      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 text-xl text-white hover:text-gray-400">
        <FaArrowLeft /> Back
      </Link>

      {/* Box Title & Description */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold">{resolvedParams.id}</h1>
      </div>

      {/* Add New Post Button */}
      <div className="text-center my-8">
        <Link
          href={`/post/add/${resolvedParams?.id}`}
          className="bg-blue-500 hover:bg-blue-400 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg">
          What's on your mind :)
        </Link>
      </div>

      {/* Post List */}
      <div className="space-y-8">
        {postList.map((post, index) => (
          <PostCard key={index} post={post} groupId={resolvedParams?.id || ""} />
        ))}
      </div>

      {/* Scroll-to-load Indicator */}
      {loadingMore && (
        <div className="text-center text-white py-4">Loading more posts...</div>
      )}

      {/* Error handling for no posts */}
      {!hasMore && !loadingMore && (
        <div className="text-center text-gray-400 py-4">No more posts to load.</div>
      )}
    </div>
  );
}
