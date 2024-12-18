// CommentCard.tsx
import React from "react";

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
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
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

      {/* Display replies recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
