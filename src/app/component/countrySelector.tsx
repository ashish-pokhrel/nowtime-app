import React, { useState, useEffect, useRef } from "react";
import "flag-icon-css/css/flag-icons.min.css";
import { userCountryLocalStorage } from "../../constant/constants";

// Country type definition
type Country = {
    name: string;
    code: string; // ISO Alpha-2 code
};

// List of countries with names and ISO Alpha-2 codes
const countries: Country[] = [
    { name: "Afghanistan", code: "af" },
    { name: "Albania", code: "al" },
    { name: "Algeria", code: "dz" },
    { name: "Andorra", code: "ad" },
    { name: "Angola", code: "ao" },
    { name: "Antigua and Barbuda", code: "ag" },
    { name: "Argentina", code: "ar" },
    { name: "Armenia", code: "am" },
    { name: "Australia", code: "au" },
    { name: "Austria", code: "at" },
    { name: "Azerbaijan", code: "az" },
    { name: "Bahamas", code: "bs" },
    { name: "Bahrain", code: "bh" },
    { name: "Bangladesh", code: "bd" },
    { name: "Barbados", code: "bb" },
    { name: "Belarus", code: "by" },
    { name: "Belgium", code: "be" },
    { name: "Belize", code: "bz" },
    { name: "Benin", code: "bj" },
    { name: "Bhutan", code: "bt" },
    { name: "Bolivia", code: "bo" },
    { name: "Bosnia and Herzegovina", code: "ba" },
    { name: "Botswana", code: "bw" },
    { name: "Brazil", code: "br" },
    { name: "Brunei", code: "bn" },
    { name: "Bulgaria", code: "bg" },
    { name: "Burkina Faso", code: "bf" },
    { name: "Burundi", code: "bi" },
    { name: "Cabo Verde", code: "cv" },
    { name: "Cambodia", code: "kh" },
    { name: "Cameroon", code: "cm" },
    { name: "Canada", code: "ca" },
    { name: "Central African Republic", code: "cf" },
    { name: "Chad", code: "td" },
    { name: "Chile", code: "cl" },
    { name: "China", code: "cn" },
    { name: "Colombia", code: "co" },
    { name: "Comoros", code: "km" },
    { name: "Congo (Congo-Brazzaville)", code: "cg" },
    { name: "Congo (Congo-Kinshasa)", code: "cd" },
    { name: "Costa Rica", code: "cr" },
    { name: "Croatia", code: "hr" },
    { name: "Cuba", code: "cu" },
    { name: "Cyprus", code: "cy" },
    { name: "Czech Republic", code: "cz" },
    { name: "Denmark", code: "dk" },
    { name: "Djibouti", code: "dj" },
    { name: "Dominica", code: "dm" },
    { name: "Dominican Republic", code: "do" },
    { name: "Ecuador", code: "ec" },
    { name: "Egypt", code: "eg" },
    { name: "El Salvador", code: "sv" },
    { name: "Equatorial Guinea", code: "gq" },
    { name: "Eritrea", code: "er" },
    { name: "Estonia", code: "ee" },
    { name: "Eswatini (Swaziland)", code: "sz" },
    { name: "Ethiopia", code: "et" },
    { name: "Fiji", code: "fj" },
    { name: "Finland", code: "fi" },
    { name: "France", code: "fr" },
    { name: "Gabon", code: "ga" },
    { name: "Gambia", code: "gm" },
    { name: "Georgia", code: "ge" },
    { name: "Germany", code: "de" },
    { name: "Ghana", code: "gh" },
    { name: "Greece", code: "gr" },
    { name: "Grenada", code: "gd" },
    { name: "Guatemala", code: "gt" },
    { name: "Guinea", code: "gn" },
    { name: "Guinea-Bissau", code: "gw" },
    { name: "Guyana", code: "gy" },
    { name: "Haiti", code: "ht" },
    { name: "Honduras", code: "hn" },
    { name: "Hungary", code: "hu" },
    { name: "Iceland", code: "is" },
    { name: "India", code: "in" },
    { name: "Indonesia", code: "id" },
    { name: "Iran", code: "ir" },
    { name: "Iraq", code: "iq" },
    { name: "Ireland", code: "ie" },
    { name: "Israel", code: "il" },
    { name: "Italy", code: "it" },
    { name: "Jamaica", code: "jm" },
    { name: "Japan", code: "jp" },
    { name: "Jordan", code: "jo" },
    { name: "Kazakhstan", code: "kz" },
    { name: "Kenya", code: "ke" },
    { name: "Kiribati", code: "ki" },
    { name: "Kuwait", code: "kw" },
    { name: "Kyrgyzstan", code: "kg" },
    { name: "Laos", code: "la" },
    { name: "Latvia", code: "lv" },
    { name: "Lebanon", code: "lb" },
    { name: "Lesotho", code: "ls" },
    { name: "Liberia", code: "lr" },
    { name: "Libya", code: "ly" },
    { name: "Liechtenstein", code: "li" },
    { name: "Lithuania", code: "lt" },
    { name: "Luxembourg", code: "lu" },
    { name: "Madagascar", code: "mg" },
    { name: "Malawi", code: "mw" },
    { name: "Malaysia", code: "my" },
    { name: "Maldives", code: "mv" },
    { name: "Mali", code: "ml" },
    { name: "Malta", code: "mt" },
    { name: "Marshall Islands", code: "mh" },
    { name: "Mauritania", code: "mr" },
    { name: "Mauritius", code: "mu" },
    { name: "Mexico", code: "mx" },
    { name: "Micronesia", code: "fm" },
    { name: "Moldova", code: "md" },
    { name: "Monaco", code: "mc" },
    { name: "Mongolia", code: "mn" },
    { name: "Montenegro", code: "me" },
    { name: "Morocco", code: "ma" },
    { name: "Mozambique", code: "mz" },
    { name: "Myanmar (Burma)", code: "mm" },
    { name: "Namibia", code: "na" },
    { name: "Nauru", code: "nr" },
    { name: "Nepal", code: "np" },
    { name: "Netherlands", code: "nl" },
    { name: "New Zealand", code: "nz" },
    { name: "Nicaragua", code: "ni" },
    { name: "Niger", code: "ne" },
    { name: "Nigeria", code: "ng" },
    { name: "North Korea", code: "kp" },
    { name: "North Macedonia", code: "mk" },
    { name: "Norway", code: "no" },
    { name: "Oman", code: "om" },
    { name: "Pakistan", code: "pk" },
    { name: "Palau", code: "pw" },
    { name: "Panama", code: "pa" },
    { name: "Papua New Guinea", code: "pg" },
    { name: "Paraguay", code: "py" },
    { name: "Peru", code: "pe" },
    { name: "Philippines", code: "ph" },
    { name: "Poland", code: "pl" },
    { name: "Portugal", code: "pt" },
    { name: "Qatar", code: "qa" },
    { name: "Romania", code: "ro" },
    { name: "Russia", code: "ru" },
    { name: "Rwanda", code: "rw" },
    { name: "Saint Kitts and Nevis", code: "kn" },
    { name: "Saint Lucia", code: "lc" },
    { name: "Saint Vincent and the Grenadines", code: "vc" },
    { name: "Samoa", code: "ws" },
    { name: "San Marino", code: "sm" },
    { name: "Saudi Arabia", code: "sa" },
    { name: "Senegal", code: "sn" },
    { name: "Serbia", code: "rs" },
    { name: "Seychelles", code: "sc" },
    { name: "Sierra Leone", code: "sl" },
    { name: "Singapore", code: "sg" },
    { name: "Slovakia", code: "sk" },
    { name: "Slovenia", code: "si" },
    { name: "Solomon Islands", code: "sb" },
    { name: "Somalia", code: "so" },
    { name: "South Africa", code: "za" },
    { name: "South Korea", code: "kr" },
    { name: "Spain", code: "es" },
    { name: "Sri Lanka", code: "lk" },
    { name: "Sudan", code: "sd" },
    { name: "Suriname", code: "sr" },
    { name: "Sweden", code: "se" },
    { name: "Switzerland", code: "ch" },
    { name: "Syria", code: "sy" },
    { name: "Taiwan", code: "tw" },
    { name: "Tajikistan", code: "tj" },
    { name: "Tanzania", code: "tz" },
    { name: "Thailand", code: "th" },
    { name: "Timor-Leste", code: "tl" },
    { name: "Togo", code: "tg" },
    { name: "Tonga", code: "to" },
    { name: "Trinidad and Tobago", code: "tt" },
    { name: "Tunisia", code: "tn" },
    { name: "Turkey", code: "tr" },
    { name: "Turkmenistan", code: "tm" },
    { name: "Tuvalu", code: "tv" },
    { name: "Uganda", code: "ug" },
    { name: "Ukraine", code: "ua" },
    { name: "United Arab Emirates", code: "ae" },
    { name: "United Kingdom", code: "gb" },
    { name: "United States", code: "us" },
    { name: "Uruguay", code: "uy" },
    { name: "Uzbekistan", code: "uz" },
    { name: "Vanuatu", code: "vu" },
    { name: "Vatican City", code: "va" },
    { name: "Venezuela", code: "ve" },
    { name: "Vietnam", code: "vn" },
    { name: "Yemen", code: "ye" },
    { name: "Zambia", code: "zm" },
    { name: "Zimbabwe", code: "zw" },
];

interface CountrySelectorProps {
    selectedCountry: Country | null;
    onCountrySelect: (country: Country) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
    selectedCountry,
    onCountrySelect,
}) => {
    const [query, setQuery] = useState(""); // State to store search input
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown visibility
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const pageSize = 5; // Number of countries per page

    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown container

    // Load country from localStorage or fallback to US
    useEffect(() => {
        const savedCountryCode = localStorage.getItem(userCountryLocalStorage);
        const savedCountry =
            countries.find((country) => country.code === savedCountryCode) ||
            countries.find((country) => country.code === "us"); // Default to US

        if (savedCountry) {
            onCountrySelect(savedCountry); // Notify parent
        }
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Filter countries based on search query
    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
    );

    // Calculate pagination details
    const totalPages = Math.ceil(filteredCountries.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCountries = filteredCountries.slice(
        startIndex,
        startIndex + pageSize
    );

    // Handle country selection
    const handleSelect = (country: Country) => {
        onCountrySelect(country);
        setIsDropdownOpen(false);
        localStorage.setItem(userCountryLocalStorage, country.code);
        window.location.reload();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Display Selected Country */}
            <button
                className="flex items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                {selectedCountry ? (
                    <>
                        <span
                            className={`flag-icon flag-icon-${selectedCountry.code.toLowerCase()}`}
                        ></span>
                        <span className="ml-2">{selectedCountry.code.toUpperCase()}</span>
                    </>
                ) : (
                    <span>Select Country</span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    className="absolute z-10 mt-2 w-64 bg-gray-900 text-white rounded-md shadow-lg border border-gray-700"
                    style={{ right: "0", left: "auto", maxWidth: "calc(100vw - 20px)" }}
                >
                    {/* Search Input */}
                    <input
                        type="text"
                        className="w-full px-4 py-2 border-b border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search country..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page when query changes
                        }}
                    />
                    {/* Filtered and Paginated Country List */}
                    <ul className="max-h-40 overflow-auto">
                        {paginatedCountries.map((country) => (
                            <li
                                key={country.code}
                                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleSelect(country)}
                            >
                                <span
                                    className={`flag-icon flag-icon-${country.code.toLowerCase()} w-6 h-4`}
                                ></span>
                                <span>{country.name}</span>
                            </li>
                        ))}
                    </ul>
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center px-4 py-2 border-t border-gray-700 bg-gray-800">
                        <button
                            className="text-sm text-gray-400 hover:text-white"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="text-sm text-gray-400 hover:text-white"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountrySelector;
