import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaUserCircle,
  FaCommentDots,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "../../app/component/logo";
import { useRouter } from "next/navigation";
import {
  accessTokenLocalStorage,
  userGuidLocalStorage,
  profileImageLocalStorage,
} from "../../constant/constants";
import { fetchData, postData } from "../../utils/axios";
import CountrySelector from "../component/countrySelector";

interface LayoutProps {
  children: React.ReactNode;
  backHref?: string;
}

type Country = {
  name: string;
  code: string; // Alpha-2 code
};

const Layout = ({ children, backHref = "/" }: LayoutProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(accessTokenLocalStorage)) {
      setIsSignedIn(true);
    }
    const storedCountry = localStorage.getItem("selectedCountry");
    if (storedCountry) {
      setSelectedCountry(JSON.parse(storedCountry));
    }

  }, []);

  const getDeviceInfo = () => {
    return `${navigator.userAgent}, ${navigator.platform}`;
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    localStorage.setItem("selectedCountry", JSON.stringify(country));
  };

  const handleLogout = () => {
    const formData =
    {
      userId: "00000000-0000-0000-0000-000000000000",
      deviceInfo: getDeviceInfo()
    }
    const logout = async () => {
      const response = await postData("/User/signOut", formData);
      if (response?.status == 200) {
        sessionStorage.removeItem(accessTokenLocalStorage);
        sessionStorage.removeItem(userGuidLocalStorage);
        sessionStorage.removeItem(profileImageLocalStorage);
        router.push("/user/signIn");
      }
    }
    logout();
  };

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      try {
        const response = await fetchData("/message/getunreadchats");
        setUnreadMessagesCount(response?.data.count);
      } catch {
      }
    };

    if (isSignedIn) {
      fetchUnreadMessagesCount();
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-gray-c-800 dark:bg-gray-c-800 shadow-lg border-b border-white">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="flex items-center space-x-6">
        <CountrySelector
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
          />
          {isSignedIn ? (
            <>
              {/* Profile Icon with Unread Messages Count */}
              <div className="relative flex items-center space-x-2" ref={dropdownRef}>
                <div className="relative">
                  <button
                    className="flex items-center justify-center w-10 h-10 bg-gray-c-800 hover:bg-gray-600 rounded-full text-white shadow-md focus:outline-none cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FaUserCircle className="text-2xl" />
                  </button>
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-0 right-0 rounded-full bg-pink-500 text-xs text-white px-1 py-0.5 leading-tight">
                      {unreadMessagesCount}
                    </span>
                  )}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-c-800 rounded-lg shadow-lg overflow-hidden z-10">
                      <Link
                        href={`/user/profile/00000000-0000-0000-0000-000000000000`}
                        className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <FaUserCircle />
                          <span>View Profile</span>
                        </div>
                      </Link>
                      {/* Chat Icon inside Profile Dropdown */}
                      <Link href="/chat/' '" className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <FaCommentDots />
                          <span>Chats</span>
                          {unreadMessagesCount > 0 && (
                            <span className="top-0 right-0 rounded-full bg-pink-500 text-xs text-white px-1 py-0.5 leading-tight">
                              {unreadMessagesCount}
                            </span>
                          )}
                        </div>
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                        onClick={handleLogout}>
                        <div className="flex items-center space-x-2">
                          <FaSignOutAlt />
                          <span className="">Log Out</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Link href="/user/signIn" className="block px-4 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className="p-4 md:px-8 md:py-6">{children}</main>
    </div>
  );
};

export default Layout;
