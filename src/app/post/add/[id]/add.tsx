"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchData, postFileData } from "../../../../utils/axios";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "../../../component/navbar";
import { userLocationLocalStorage, displayLocationLocalStorage } from "../../../../constant/constants";

type Box = {
  id: number;
  title: string;
  icon: string;
  description: string;
  color: string;
};

type Location = {
  id: number;
  city: string;
  region: string;
  country: string;
  postalCode: string;
};

const FileUpload = ({
  images,
  onFileChange,
}: {
  images: File[];
  onFileChange: (files: File[]) => void;
}) => (
  <div>
    <label htmlFor="images" className="block text-gray-300 mb-2">Upload Images</label>
    <input
      id="images"
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => onFileChange(Array.from(e.target.files || []))}
      className="text-white w-full"
    />
    {images.length > 0 && (
      <div className="flex space-x-4 mt-4 mb-4 overflow-x-auto">
        {images.map((image, index) => (
          <img
            key={index + Math.random()}
            src={URL.createObjectURL(image)}
            alt={`Preview ${index}`}
            className="w-20 h-20 object-cover rounded-lg border border-gray-600"
          />
        ))}
      </div>
    )}
  </div>
);

type Params = Promise<{ id: string }>

export default function AddPostPage({ params }: { params: Params}) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedBox, setSelectedBox] = useState<string | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [page] = useState(0);
  const take = 10;
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const parsedParams = (await params)
      setSelectedBox(parsedParams.id);
      setResolvedParams((parsedParams));
    }
    getParams();
    const fetchGroups = async () => {
      try {
        const response = await fetchData("/group/GetAllDropDown");
        setBoxes(response?.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch groups");
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const storedLocation = localStorage.getItem(displayLocationLocalStorage);
    if (storedLocation) {
      setDebouncedSearchTerm(storedLocation);
    }
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const skip = page * take;
        const storedLocation = debouncedSearchTerm === "" ? localStorage.getItem(displayLocationLocalStorage) : debouncedSearchTerm;
        const postData = await fetchData(
          `/location?searchTerm=${storedLocation}&skip=${skip}&top=${take}`
        );
        setFilteredLocations(postData?.data.locations);
      } catch {
      }
    };

    fetchLocation();
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(debouncedSearchTerm);
    }, 500);

    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (selectedBox === "" || !description) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      const selectedGroupId =
        selectedBox.toString().toLowerCase() === "other" ? "All" : selectedBox.toString();
      const userLocation = localStorage.getItem(userLocationLocalStorage);
      formData.append("description", description);
      formData.append("groupId", selectedGroupId);
      formData.append("locationString", userLocation ?? "");
      formData.append("postLocation", debouncedSearchTerm);
      images.forEach((file) => formData.append("images", file));

      var response = await postFileData("/post", formData);
      if(response.status == 401 || response.Status == 401)
      {
        sessionStorage.clear();
        router.push("/user/signIn");
      }
      else if(response.status == 200 || response.Status == 200)
      {
        router.push(`/feed/${selectedGroupId}`);
      }
    } catch (err) {
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearchTerm(event.target.value);
  };

  const handleLocationSelect = (location: Location) => {
    setDebouncedSearchTerm(`${location.city}, ${location.region}`);
  };

  return (
    <Layout backHref={`/feed/${resolvedParams?.id}`}>
      <Link
        href={`/post/feed/${resolvedParams?.id}`}
        className="absolute top-8 left-8 text-xl text-white hover:text-gray-400"
      >
        <FaArrowLeft />
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold">Create Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 text-white"
            placeholder="Write your post description here..."
            required
          />
        </div>

        {/* Box Selection */}
        <div>
          <label htmlFor="box" className="block text-gray-300 mb-2">
            Select Box
          </label>
          <select
            id="box"
            value={selectedBox}
            onChange={(e) => setSelectedBox(e.target.value || "")}
            className="w-full p-4 rounded-lg bg-gray-800 text-white"
            required
          >
            <option value="">Select a box</option>
            {boxes.map((box) => (
              <option key={box.id + Math.random()} value={box.id}>
                {box.title}
              </option>
            ))}
          </select>
        </div>

        {/* Post Area (Autocomplete) */}
        <div>
          <label htmlFor="postArea" className="block text-gray-300 mb-2">
            Location
          </label>
          <input
            id="postArea"
            type="text"
            className="w-full p-4 rounded-lg bg-gray-800 text-white"
            placeholder="Search location..."
            onChange={handleSearchChange}
            value={debouncedSearchTerm} // This binds the value to the input field
          />

          {debouncedSearchTerm && filteredLocations.length > 0 && (
            <ul className="mt-2 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredLocations.map((location) => (
                <li
                  key={location.id + Math.random()}
                  className="p-4 cursor-pointer hover:bg-gray-600"
                  onClick={() => handleLocationSelect(location)}
                >
                  {location.city}, {location.region}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image Upload */}
        <FileUpload images={images} onFileChange={setImages} />

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          {loading ? (
            <p className="text-blue-500">Submitting...</p>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add Post"}
            </button>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </form>
    </Layout>
  );
}
