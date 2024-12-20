"use client";

import { useState, useEffect } from "react";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import Link from "next/link";
import { fetchData, postData } from "../../../../../utils/axios";
import PostCard from "../../../../component/postCard";
import CommentCard from "../../../../component/commentCard";
import Layout from "../../../../component/navbar";

type User = {
  name: string;
  profileImage: string;
  displayDateTime: string;
};

type Post = {
  id: number;
  user: User;
  description: string;
  postImages: string[];
  likes: number;
  comments: number;
  shares: number;
};

type Comment = {
  id: string;
  user: {
    name: string;
    profileImage: string;
  };
  content: string;
  displayDateTime: string;
  replies?: Comment[];
};

export default function CommentsPage({ params }: { params: { groupId: string; postId: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [addingComment, setAddingComment] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [parsedParams, setParsedParams] =  useState<{ groupId: string; postId: string } | null>(null);

  const COMMENTS_PER_PAGE = 5;

  // Fetch post data (only once on startup)
  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      const parsedParams = JSON.parse(params.value);
      setParsedParams(parsedParams);
      const postResponse = await fetchData(`/post/GetPostById?postId=${parsedParams.postId}`);
      setPost(postResponse.data);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post.");
    } finally {
      setLoadingPost(false);
    }
  };

  // Fetch comments (paginated)
  const fetchComments = async (pageNumber: number = 1) => {
    try {
      setLoadingComments(true);
      const parsedParams = JSON.parse(params.value);
      const commentResponse = await fetchData(
        `/comment?postId=${parsedParams.postId}&page=${pageNumber}&pageSize=${COMMENTS_PER_PAGE}`
      );
      const newComments = commentResponse?.data?.comments || [];
      setComments((prev) => (pageNumber === 1 ? newComments : [...prev, ...newComments]));
      setHasMore(pageNumber*COMMENTS_PER_PAGE < commentResponse?.data?.count);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments.");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReply = async (commentId: string, replyContent: string) => {
    try {
      await postData(`/comment/reply`, {
        commentId,
        content: replyContent,
      });
  
      // Refresh comments after adding reply
      setPage(1);
      fetchComments(1);
    } catch (err) {
      console.error("Error adding reply:", err);
      setError("Failed to add reply.");
    }
  };


  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setAddingComment(true);
      await postData(`/comment`, {
        postId: parsedParams.postId,
        content: newComment,
      });

      setNewComment("");
      setPage(1); // Reset to page 1 to fetch the updated comment list
      fetchComments(1);
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment.");
    } finally {
      setAddingComment(false);
    }
  };

  useEffect(() => {
    // Fetch post and initial comments on mount
    fetchPost();
    fetchComments(page);
  }, []);

  useEffect(() => {
    // Fetch more comments when the page number changes
    if (page > 1) fetchComments(page);
  }, [page]);

  if (loadingPost) return <div className="text-center text-white">Loading post...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <Layout backHref={"/post/feed/"+ parsedParams.groupId}>
      {post && <PostCard post={post} />}

      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Comments</h2>
      {loadingComments && page === 1 ? (
        <div className="text-center">Loading comments...</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} onReply={handleReply} />
          ))}
        </div>
      )}

      {hasMore && !loadingComments && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="mt-6 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
        >
          Load More
        </button>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
        <div className="flex items-center gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            rows={3}
          />
          <button
            onClick={handleAddComment}
            disabled={addingComment}
            className={`${
              addingComment ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-400"
            } text-white px-4 py-2 rounded-lg flex items-center`}
          >
            {addingComment ? (
              "Sending..."
            ) : (
              <>
                <FaPaperPlane className="mr-2" /> Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </Layout>
  );
}
