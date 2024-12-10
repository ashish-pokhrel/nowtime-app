import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link from next/link
import { FaArrowLeft, FaThumbsUp, FaComment, FaShare } from "react-icons/fa"; // Import the icons

// Sample data for demonstration
const postList = [
  {
    user: {
      name: "John Doe",
      profileImage: "/sample1.jpg", // Example user profile image
      timePosted: "2 hours ago",
    },
    description: "This is a post about the event! Looking forward to it.",
    postImages: ["/sample1.jpg", "/free-sample.png"], // Example post images
    likes: 20,
    comments: 5,
    shares: 2,
  },
  {
    user: {
      name: "Jane Smith",
      profileImage: "/free-sample.png",
      timePosted: "4 hours ago",
    },
    description: "Had a great day at the park! #fun #nature",
    postImages: ["/sample1.jpg", "/free-sample.png"], // Example post image
    likes: 35,
    comments: 12,
    shares: 4,
  },
];

export default function DetailsPage({ params }: { params: { id: string } }) {
  const { id } = params; // You can use the id for fetching dynamic data based on this
  // Replace with actual data fetching logic or handle invalid cases
  const box = { title: `Box ${id}`, description: `Detailed description for box ${id}` }; 

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white relative">
      {/* Arrow Icon to Go Back to Landing Page */}
      <Link href="/" className="absolute top-8 left-8 text-xl text-white hover:text-gray-400">
        <FaArrowLeft />
      </Link>

      {/* Box Title */}
      <h1 className="text-4xl font-bold text-center mb-8">{box.title}</h1>
      <p className="text-center text-gray-400 mb-8">{box.description}</p>

      {/* List of Posts */}
      <div className="space-y-8">
        {postList.map((post, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            {/* User Info */}
            <div className="flex items-center mb-4">
              <img
                src={post.user.profileImage}
                alt={`${post.user.name}'s profile`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="font-semibold text-white">{post.user.name}</h2>
                <p className="text-gray-500 text-sm">{post.user.timePosted}</p>
              </div>
            </div>

            {/* Post Description */}
            <p className="text-gray-300 mb-4">{post.description}</p>

            {/* Post Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {post.postImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Like, Comment, Share */}
            <div className="flex items-center justify-between text-gray-400">
              <div className="flex gap-6">
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <FaThumbsUp /> Like {post.likes}
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <FaComment /> Comment {post.comments}
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <FaShare /> Share {post.shares}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
