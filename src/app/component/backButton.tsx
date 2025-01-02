import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
  backHref?: string; // Optional: Allow a custom back href, fallback to history if not provided
}

const BackButton: React.FC<BackButtonProps> = ({ backHref }) => {
  const handleBackClick = () => {
    if (backHref) {
      // If a backHref is provided, navigate to it
      window.location.href = backHref;
    } else {
      // Otherwise, go back in browser history
      window.history.back();
    }
  };

  return (
    <div
      onClick={handleBackClick}
      className="text-xs md:text-sm text-white hover:text-gray-400 flex items-center space-x-2 cursor-pointer">
      <FaArrowLeft className="text-xs" />
      <span>Back</span>
    </div>
  );
};

export default BackButton;
