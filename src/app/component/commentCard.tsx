import React, { useState } from "react";

type Comment = {
  id: string;
  user: {
    name: string;
    profileImage: string;
  };
  content: string;
  timePosted: string;
  replies?: Comment[];
};

interface CommentCardProps {
  comment: Comment;
  onReply: (commentId: string, replyContent: string) => void;
  isReply?: boolean; // Add a flag to differentiate between main comments and replies
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply, isReply = false }) => {
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [showReplies, setShowReplies] = useState<boolean>(false); // State to manage showing replies

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent.trim());
    setReplyContent("");
    setShowReplyBox(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex items-center mb-2">
        <img
          src={comment.user.profileImage}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full mr-3"
        />
        <div>
          <p className="font-bold">{comment.user.name}</p>
          <p className="text-gray-500 text-sm">{comment.timePosted}</p>
        </div>
      </div>
      <p className="text-gray-300">{comment.content}</p>

      {!isReply && (
        <div className="flex items-center mt-2 space-x-4">
          {/* Reply button only for top-level comments */}
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="text-blue-400 hover:underline text-sm"
          >
            Reply
          </button>
        </div>
      )}

      {/* Reply input box */}
      {showReplyBox && (
        <div className="mt-4 ml-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            rows={2}
          />
          <button
            onClick={handleReplySubmit}
            className="mt-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
          >
            Reply
          </button>
        </div>
      )}

      {/* Show/hide replies button */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-blue-400 hover:underline text-sm"
          >
            {showReplies ? "Hide Replies" : "Show Replies"}
          </button>
        </div>
      )}

      {/* Display replies only when showReplies is true */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={`${comment.id}-${reply.id}`} // Ensure unique key
              comment={reply}
              onReply={onReply}
              isReply={true} // Mark this as a reply
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
