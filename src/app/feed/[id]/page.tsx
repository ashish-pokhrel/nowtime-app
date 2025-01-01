"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchData } from "../../../utils/axios"; 
import PostCard from "../../component/postCard";
import Layout from "../../component/navbar";
import { displayLocationLocalStorage } from "../../../constant/constants";

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

type Box = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
};

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [postList, setPostList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [take] = useState(10);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [postLocat, setPostLocation] = useState<string>("");
  const [box, setBox] = useState<Box>();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Resolve params
  useEffect(() => {
    const fetchParams = async () => {
      const paramsData = await params;
      setResolvedParams(paramsData);
      const fetchGroups = async () => {
        try {
          const data = await fetchData(`/group/${paramsData.id}`);
          setBox(data?.data);
          setLoading(false);
        } catch{
          setLoading(false);
        }
      };
      fetchGroups();
    };
    fetchParams();
  }, [params]);

  // Fetch post details
  const fetchDetails = useCallback(async () => {
    if (!resolvedParams || !hasMore || loadingMore) return;

    const { id } = resolvedParams;
    setLoadingMore(true);

    try {
      const postLocation = localStorage.getItem(displayLocationLocalStorage);
      setPostLocation(postLocation ?? "");
      const postData = await fetchData(
        `/post?groupId=${id}&skip=${page}&top=${take}&searchTerm=${debouncedSearchTerm}&postLocation=${postLocation}`
      );
      if (!postData || !postData.data.posts.length) {
        setHasMore(false);
      } else {
        setPostList((prevPosts) => [...prevPosts, ...postData.data.posts]);
        setHasMore(postData.data.count > take);
      }
    } catch {
      setError("Failed to load data");
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, [resolvedParams, page, hasMore, loadingMore, debouncedSearchTerm]);

  useEffect(() => {
    if (resolvedParams) {
      fetchDetails();
    }
  }, [resolvedParams, page, debouncedSearchTerm]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight;

      if (scrollPosition >= bottomPosition - 100 && hasMore && !loadingMore) {
        setPage((prevPage) => prevPage + take);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadingMore]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2 || value.length === 0) {
      setHasMore(true);
      setPage(0); 
      setPostList([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Box Title & Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-white">
            {box?.title}
          </h1>
        </div>

        {/* Add New Post Button */}
        <div className="text-center my-8">
          <Link
            href={`/post/add/${resolvedParams?.id}`}
            className="group inline-block relative text-blue-600 text-lg font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 overflow-hidden"
          >
            <span className="absolute inset-0 bg-blue-600 transform group-hover:scale-x-100 group-hover:scale-y-100 transition-all duration-300 scale-x-0 scale-y-0 origin-top-left z-0"></span>
            <span className="relative z-10 group-hover:text-white group-hover:font-bold">
              What's on your mind? <span className="text-sm">Add Here</span>
            </span>
          </Link>
        </div>

        {/* Search and Location */}
        <section className="my-8 px-4 max-w-7xl mx-auto">
          {/* Flex Container for Centered Location and Search */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          
            {/* Search Input */}
            <div className="w-full md:w-96">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-gray-800 text-white p-3 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-300 transition duration-200"
                placeholder="Search posts..."
                aria-label="Search posts"
              />
            </div>
          </div>
        </section>

        {/* Post List */}
        <div className="space-y-8">
          {postList.map((post) => (
            <PostCard key={post.id  + Math.random()} post={post} groupId={resolvedParams?.id || ""} />
          ))}
        </div>

        {/* Scroll-to-load Indicator */}
        {loadingMore && (
          <div className="text-center text-white py-4">Loading more posts...</div>
        )}

        {/* Error handling for no posts */}
        {!hasMore && !loadingMore && (
        <div className="text-center py-4">
          <p className="text-gray-400">
            {resolvedParams && resolvedParams.id !== "All" && (
              <>
                <span className="font-bold text-gray-500">No more posts to load</span>{' '}
                for the location{' '}
                <span className="text-blue-500 font-semibold">{postLocat}</span>
              </>
            )}
            {(!resolvedParams || resolvedParams.id === "All") && (
              <span className="font-bold text-gray-500">No more posts to load</span>
            )}
          </p>
        </div>
      )}
      </div>
    </Layout>
  );
}
