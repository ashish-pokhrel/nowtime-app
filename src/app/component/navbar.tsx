import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaCommentDots,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "../../app/component/logo";
import { useRouter } from "next/navigation";
import {
  accessTokenLocalStorage,
  userGuidLocalStorage,
  profileImageLocalStorage,
  tokenExpiresInLocalStorage,
  displayLocationLocalStorage,
} from "../../constant/constants";
import { fetchData, postData } from "../../utils/axios";

interface LayoutProps {
  children: React.ReactNode;
  backHref?: string;
}

type Location = {
  id: number;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  cityRegion: string;
};

const Layout = ({ children, backHref = "/" }: LayoutProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [addressSearchTerm, setAddressSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [availableAddresses, setAvailableAddresses] = useState<Location[]>([]);
  const [take] = useState(10);
  const [page] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedLocation = localStorage.getItem(displayLocationLocalStorage);
    if (storedLocation) {
      setSelectedAddress(storedLocation);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (addressSearchTerm.length > 2) {
        setDebouncedSearchTerm(addressSearchTerm);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [addressSearchTerm]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if(!availableAddresses || (debouncedSearchTerm || debouncedSearchTerm != ""))
        {
          const skip = page * take;
          const postData = await fetchData(
            `/location?searchTerm=${debouncedSearchTerm}&skip=${skip}&top=${take}`
          );
          setAvailableAddresses(postData?.data.locations || []);
        }
      } catch {
        // Handle error (if necessary)
      }
    };

    fetchLocation();
  }, [debouncedSearchTerm, page, take]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAddressDropdownOpen(false);
      }
    };

    if (sessionStorage.getItem(accessTokenLocalStorage)) {
      setIsSignedIn(true);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDeviceInfo = () => {
    return `${navigator.userAgent}, ${navigator.platform}`;
  };

  const toggleAddressDropdown = () => {
    setIsAddressDropdownOpen(!isAddressDropdownOpen);
    if (!isAddressDropdownOpen) setAddressSearchTerm("");
  };

  const handleAddressSelect = (address: Location) => {
    const displayLocation = `${address.cityRegion}`;
    setSelectedAddress(displayLocation);
    setIsAddressDropdownOpen(false);
    localStorage.setItem(displayLocationLocalStorage, displayLocation);
    window.location.reload();
  };

  const handleLogout = () => {
   const formData = 
    {
      userId:  "00000000-0000-0000-0000-000000000000", 
      deviceInfo: getDeviceInfo()
    }
    const logout = async () => {
      const response = await postData("/User/signOut", formData);
        if(response?.status == 200)
        {
          sessionStorage.removeItem(accessTokenLocalStorage);
          sessionStorage.removeItem(userGuidLocalStorage);
          sessionStorage.removeItem(profileImageLocalStorage);
          sessionStorage.removeItem(tokenExpiresInLocalStorage);
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
        // Handle error (if necessary)
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
          <div className="relative" ref={addressDropdownRef}>
            <button
              className="flex items-center justify-center text-xs md:text-xs hover:text-white focus:outline-none cursor-pointer"
              onClick={toggleAddressDropdown}
            >
              <FaMapMarkerAlt className="mr-1" /> {selectedAddress || "Select Location"}
            </button>
            {isAddressDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-c-800 rounded-lg shadow-lg overflow-hidden z-10">
                <input
                  type="text"
                  placeholder="Search address..."
                  className="w-full px-3 py-2 bg-gray-c-800 text-xs md:text-sm text-white rounded-t-lg focus:outline-none"
                  value={addressSearchTerm}
                  onChange={(e) => setAddressSearchTerm(e.target.value)}
                  autoComplete="off"/>
                <div className="max-h-48 overflow-y-auto">
                  {availableAddresses.length > 0 ? (
                    availableAddresses.map((address) => (
                      <button
                        key={address.id + Math.random()}
                        className="block w-full text-left px-4 py-2 text-xxs md:text-xs md:text-sm text-white hover:bg-gray-600 cursor-pointer"
                        onClick={() => handleAddressSelect(address)}>
                        {address.cityRegion}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-c-800 text-xs md:text-sm">
                      No addresses found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
