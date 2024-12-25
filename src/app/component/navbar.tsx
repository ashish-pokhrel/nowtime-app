import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import Logo from "../../app/component/logo";
import { useRouter } from "next/navigation"; // Import useRouter for redirect

interface LayoutProps {
  children: React.ReactNode;
  backHref?: string;
}

const Layout = ({ children, backHref = "/" }: LayoutProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Use useRouter hook

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userGuid");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiresIn");

    // Redirect user to the login page
    router.push("/user/signIn"); // You can modify this path as needed
    console.log("User logged out");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-gray-800 shadow-lg">
        {/* Logo and Back Button */}
        <div className="flex items-center space-x-4">
          <Logo />
          <Link
            href={backHref}
            className="text-xl text-white hover:text-gray-400 flex items-center space-x-2"
          >
            <FaArrowLeft className="text-xl" />
            <span>Back</span>
          </Link>
        </div>

        {/* Profile and Location (Side by Side) */}
        <div className="flex items-center space-x-6">
          {/* Location Information */}
          <span className="text-sm text-gray-400 md:block">Dallas, Texas</span>
          
          {/* Profile Icon with Hover Effects */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full text-white shadow-md focus:outline-none"
              onClick={toggleDropdown}
            >
              <FaUserCircle className="text-2xl" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/user/profile"
                  className="block px-4 py-2 text-white hover:bg-gray-600"
                >
                  View Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                  onClick={handleLogout} 
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:px-8 md:py-6">{children}</main>
    </div>
  );
};

export default Layout;
