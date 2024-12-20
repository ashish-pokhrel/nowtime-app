"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaArrowLeft, FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { fetchData } from "../../../../utils/axios"; // Assuming fetchData is in utils/axios.ts
import PostCard from "../../../component/postCard";
import Layout from "../../../component/navbar";

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
  const [postList, setPostList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchParams = async () => {
      const paramsData = await params;
      setResolvedParams(paramsData);
    };
    fetchParams();
  }, [params]);

  const fetchDetails = useCallback(async () => {
    if (!resolvedParams || !hasMore || loadingMore) return;

    const { id } = resolvedParams;
    setLoadingMore(true);

    try {
      const postData = await fetchData(`/post?groupId=${id}&page=${page}&pageSize=5&searchTerm=${searchTerm}`);
      if (postData === undefined) {
        setHasMore(false);
      } else {
        setPostList((prevPosts) => [...prevPosts, ...postData.data.posts]);
        setHasMore(postData.data.posts.length > 0);
      }
    } catch (error) {
      setError("Failed to load data");
      console.error(error);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, [resolvedParams, page, hasMore, loadingMore, searchTerm]);

  useEffect(() => {
    if (resolvedParams) {
      fetchDetails();
    }
  }, [resolvedParams, page, searchTerm]); 

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight;

      if (scrollPosition >= bottomPosition - 100 && hasMore && !loadingMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadingMore]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Check if the search term contains at least 3 words (non-empty words)
    const wordCount = value.length;

    // Only trigger fetch if there are at least 3 words in the search term
    if (wordCount >= 0) {
      setPage(1); // Reset to first page when search term changes
      setPostList([]); // Clear previous posts
    }
  };

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
    <Layout>
      {/* Box Title & Description */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold">{resolvedParams?.id}</h1>
      </div>

      {/* Add New Post Button */}
      <div className="text-center my-8">
        <Link
          href={`/post/add/${resolvedParams?.id}`}
          className="bg-blue-500 hover:bg-blue-400 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg"
        >
          What's on your mind :)
        </Link>
      </div>

      {/* Search Input */}
      <div className="text-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-gray-800 text-white p-2 rounded-full w-1/2"
          placeholder="Search posts..."
        />
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
   </Layout>
  );
}
