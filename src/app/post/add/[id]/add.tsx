"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchData, postFileData } from "../../../../utils/axios";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "../../../component/navbar";

type Box = {
  id: number;
  title: string;
  icon: string;
  description: string;
  color: string;
};

const FileUpload = ({ images, onFileChange }: { images: File[]; onFileChange: (files: File[]) => void }) => (
  <div>
    <label htmlFor="images" className="block text-gray-300 mb-2">Upload Images</label>
    <input
      id="images"
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => onFileChange(Array.from(e.target.files || []))}
      className="text-white"
    />
    {images.length > 0 && (
      <div className="flex space-x-4 mb-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={URL.createObjectURL(image)}
            alt={`Preview ${index}`}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ))}
      </div>
    )}
  </div>
);

const PostForm = ({
  boxes,
  selectedBox,
  setSelectedBox,
  description,
  setDescription,
  images,
  setImages,
  handleSubmit,
  loading,
  error,
}: {
  boxes: Box[];
  selectedBox: number | "";
  setSelectedBox: (value: number | "") => void;
  description: string;
  setDescription: (value: string) => void;
  images: File[];
  setImages: (value: File[]) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
}) => (
  <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
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

    <div>
      <label htmlFor="box" className="block text-gray-300 mb-2">
        Select Box
      </label>
      <select
        id="box"
        value={selectedBox}
        onChange={(e) => setSelectedBox(Number(e.target.value) || "")}
        className="w-full p-4 rounded-lg bg-gray-800 text-white"
        required
      >
        <option value="">Select a box</option>
        {boxes.map((box) => (
          <option key={box.id} value={box.id}>
            {box.title}
          </option>
        ))}
      </select>
    </div>

    <FileUpload images={images} onFileChange={setImages} />

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
      {error && <p className="text-red-500">{error}</p>}
    </div>
  </form>
);

export default function AddPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (params.value) {
      const parsedParams = JSON.parse(params.value);
      setSelectedBox(parsedParams.id);
      setResolvedParams(parsedParams);
    }

    const fetchGroups = async () => {
      try {
        const data = await fetchData("/group");
        setBoxes(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch groups");
      }
    };

    fetchGroups();
  }, []);

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
      formData.append("description", description);
      formData.append("groupId", selectedBox.toString());
      images.forEach((file) => formData.append("images", file));

      await postFileData("https://localhost:7288/api/post", formData);
      router.push(`/post/feed/${selectedBox}`);
    } catch (err) {
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Link href={`/post/feed/${resolvedParams?.id}`} className="absolute top-8 left-8 text-xl text-white hover:text-gray-400">
        <FaArrowLeft />
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold">Create Post</h1>
      </div>

      <PostForm
        boxes={boxes}
        selectedBox={selectedBox}
        setSelectedBox={setSelectedBox}
        description={description}
        setDescription={setDescription}
        images={images}
        setImages={setImages}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </Layout>
  );
}
