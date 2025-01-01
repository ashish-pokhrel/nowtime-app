import React, { useState } from "react";

type Comment = {
  id: string;
  user: {
    fullName: string;
    profileImage: string;
    displayDateTime: string;
  };
  content: string;
  timePosted: string;
  replies?: Comment[];
};

interface CommentCardProps {
  comment: Comment;
  onReply: (commentId: string, replyContent: string) => void;
  isReply?: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply, isReply = false }) => {
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [showReplies, setShowReplies] = useState<boolean>(false);

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent.trim());
    setReplyContent("");
    setShowReplyBox(false);
  };

  return (
    <div
      className={`${
        isReply ? "ml-6 sm:ml-10" : ""
      } bg-gray-800 p-4 rounded-lg mb-4 shadow-md`}
    >
      {/* User Info */}
      <div className="flex items-center mb-3">
        <img
          src={comment.user.profileImage}
          alt={comment.user.fullName}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <p className="font-bold text-white">{comment.user.fullName}</p>
          <p className="text-sm text-gray-500">{comment.timePosted}</p>
        </div>
      </div>

      {/* Comment Content */}
      <p className="text-gray-300 mb-3">{comment.content}</p>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {!isReply && (
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
          >
            Reply
          </button>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
          >
            {showReplies ? "Hide Replies" : `Show Replies (${comment.replies.length})`}
          </button>
        )}
      </div>

      {/* Reply Box */}
      {showReplyBox && (
        <div className="mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={2}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setShowReplyBox(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleReplySubmit}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Replies Section */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={`${comment.id}-${Math.random()}`}
              comment={reply}
              onReply={onReply}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
