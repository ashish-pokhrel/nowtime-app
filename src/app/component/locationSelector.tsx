import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { fetchData } from "../../utils/axios";
import { displayLocationLocalStorage } from "../../constant/constants";

type Location = {
  id: number;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  cityRegion: string;
};

interface LocationSelectorProps {
  selectedAddress: string | null;
  onAddressSelect: (address: string) => void;
}

const LocationSelector = ({
  selectedAddress,
  onAddressSelect,
}: LocationSelectorProps) => {
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [addressSearchTerm, setAddressSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [availableAddresses, setAvailableAddresses] = useState<Location[]>([]);
  const [take] = useState(10);
  const [page] = useState(0);

  const addressDropdownRef = useRef<HTMLDivElement>(null);

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
        if (!availableAddresses || debouncedSearchTerm) {
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

  const toggleAddressDropdown = () => {
    setIsAddressDropdownOpen(!isAddressDropdownOpen);
    if (!isAddressDropdownOpen) setAddressSearchTerm("");
  };

  const handleAddressSelect = (address: Location) => {
    const displayLocation = `${address.cityRegion}`;
    onAddressSelect(displayLocation);
    setIsAddressDropdownOpen(false);
    localStorage.setItem(displayLocationLocalStorage, displayLocation);
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAddressDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset location function
  const resetLocation = () => {
    const displayLocation = `All`;
    onAddressSelect(displayLocation);
    setIsAddressDropdownOpen(false);
    localStorage.setItem(displayLocationLocalStorage, displayLocation);
    window.location.reload();
  };

  return (
    <div className="relative" ref={addressDropdownRef}>
      <button
        className="flex items-center justify-center text-xs md:text-sm hover:text-white focus:outline-none cursor-pointer"
        onClick={toggleAddressDropdown}
      >
        <FaMapMarkerAlt className="mr-1" /> {selectedAddress || "Select Location"}
      </button>

      {/* Reset Location Link */}
      {selectedAddress && selectedAddress !== 'All' && (
       <a
       onClick={resetLocation}
       className="ml-5 text-[8px] mt-1 font-medium text-blue-500 cursor-pointer block hover:text-blue-700 transition-all"
     >
       Reset Location
     </a>
     
      )}

      {isAddressDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
          <input
            type="text"
            placeholder="Search address..."
            className="w-full px-3 py-2 bg-gray-800 text-xs md:text-sm text-white rounded-t-lg focus:outline-none"
            value={addressSearchTerm}
            onChange={(e) => setAddressSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <div className="max-h-48 overflow-y-auto">
            {availableAddresses.length > 0 ? (
              availableAddresses.map((address) => (
                <button
                  key={address.id}
                  className="block w-full text-left px-4 py-2 text-xs md:text-sm text-white hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleAddressSelect(address)}
                >
                  {address.cityRegion}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-xs md:text-sm">
                No addresses found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
