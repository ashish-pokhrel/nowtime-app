"use client";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Layout from "../component/navbar";
import { fetchData } from "../../utils/axios";
import { accessTokenLocalStorage } from "../../constant/constants";

interface ChatUser {
  id: number;
  fullName: string;
  profileImage: string;
}

const ChatPage = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(accessTokenLocalStorage)) {
      setIsSignedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetchData("/message/getRecentChats");
        setChatUsers(response?.data.users);
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    if (isSignedIn) {
      fetchUserList();
    }
  }, [isSignedIn]);

  return (
    <Layout backHref={`/feed/All`}>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Chat Section */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
          {/* Chat Users List */}
          <div className="w-full bg-gray-800 p-4 space-y-4">
            <h2 className="text-xl font-bold mb-4">Recent Chats</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none mb-4"
            />

            <div className="space-y-2">
              {chatUsers?.map((user, index) => (
                <button
                  key={user.id + index}
                  className={`flex items-center p-3 rounded-lg w-full bg-gray-700 hover:bg-gray-600 transition ${
                    selectedUser?.id === user.id && "bg-gray-600"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <img src={user.profileImage}  alt="profileImg" className="h-5 w-5 mr-2 rounded-full object-cover"/>
                  <div className="text-left">
                    <p className="text-lg font-semibold">{user.fullName}</p>
                  </div>
                </button>
              ))}

              {chatUsers?.length === 0 && (
                <p className="text-gray-400">No users found.</p>
              )}
            </div>
          </div>

          {/* Chat Terminal */}
          <div className="w-full bg-gray-700 p-4 flex flex-col flex-grow">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between bg-gray-600 p-3 rounded-t-lg">
                  <div className="flex items-center">
                    <FaUserCircle className="text-3xl text-gray-400 mr-3" />
                    <h3 className="text-lg font-bold">{selectedUser.fullName}</h3>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow bg-gray-800 p-4 overflow-y-auto space-y-3">
                  <div className="flex items-start space-x-2">
                    <FaUserCircle className="text-2xl text-gray-400" />
                    <div className="bg-gray-600 p-3 rounded-lg max-w-xs">
                      <p>Hello! How can I help you?</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <div className="bg-blue-600 p-3 rounded-lg max-w-xs text-right">
                      <p>Hi! I'm looking for some details.</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex items-center bg-gray-600 p-3 rounded-b-lg">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow bg-gray-700 text-white p-3 rounded-lg focus:outline-none mr-3"
                  />
                  <button className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-500 transition">
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-grow">
                <p className="text-gray-400">Select a chat to start messaging.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ad Section */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4 bg-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4 text-center">Sponsored Ads</h2>
          <div className="space-y-4">
            <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              Ad Space 1
            </div>
            <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              Ad Space 2
            </div>
            <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              Ad Space 3
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
