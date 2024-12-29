"use client";

import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Layout from "../component/navbar";
import { fetchData } from "../../utils/axios";
import { accessTokenLocalStorage } from "../../constant/constants";

interface ChatUser {
  id: number;
  fullName: string;
  profileImage: string;
}

interface ChatMessage {
  id: number;
  content: string;
  fromUserId: number;
  timestamp: string;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const ChatPage = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [fromUser, setFromUser] = useState<ChatUser | null>(null);
  const [toUser, setToUser] = useState<ChatUser | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(8);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(accessTokenLocalStorage)) {
      setIsSignedIn(true);
    }
  }, []);

  const fetchUserList = async (reset: boolean = false, skip: integer = 0) => {
    try {
      setIsLoading(true);
      const pageSize = skip == 0 ? page : skip;
      const response = await fetchData(
        `/message/getRecentChatUsers?skip=${pageSize}&top=${take}&userName=${debouncedSearchTerm}`
      );
      const newUsers = response?.data.users || [];
      setChatUsers(reset ? newUsers : [...chatUsers, ...newUsers]);
      const pgNumber = page === 0 ? 1 : page;
      setLoadMore((take * pgNumber) <= response?.data?.count);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMessages = async (userId: number) => {
    try {
      setIsMessagesLoading(true);
      const response = await fetchData(
        `/message/getChatHistory?userId=${userId}&skip=0&top=50`
      );
      setChatMessages(response?.data.messageModels || []);
      setFromUser(response?.data.fromUser);
      setToUser(response?.data.toUser);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchUserList(true);
    }
  }, [isSignedIn, debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page
  };

  const handleLoadMore = () => {
    setPage(page + take);
    fetchUserList(false, page + take);
  };

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
    fetchChatMessages(user.id);
  };

  return (
    <Layout backHref={`/feed/All`}>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Chat Users List */}
        <div className="w-full md:w-1/4 lg:w-1/4 bg-gray-800 p-4">
          <h2 className="text-xl font-bold mb-4">Recent Chats</h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none mb-4"
          />

          <div className="space-y-2">
            {chatUsers?.map((user) => (
              <button
                key={user.id}
                className={`flex items-center p-3 rounded-lg w-full bg-gray-700 hover:bg-gray-600 transition ${
                  selectedUser?.id === user.id && "bg-gray-600"
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <img
                  src={user.profileImage}
                  alt="profileImg"
                  className="h-5 w-5 mr-2 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-lg font-semibold">{user.fullName}</p>
                </div>
              </button>
            ))}

            {isLoading && <p className="text-gray-400">Loading...</p>}
            {!isLoading && loadMore && (
              <button
                onClick={handleLoadMore}
                className="w-full p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
              >
                Load More
              </button>
            )}

            {chatUsers.length === 0 && !isLoading && (
              <p className="text-gray-400">No users found.</p>
            )}
          </div>
        </div>

        {/* Chat Terminal */}
        <div className="w-full md:w-2/4 lg:w-2/4 bg-gray-700 p-4 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between bg-gray-600 p-3 rounded-t-lg">
                <div className="flex items-center">
                <img
                        src={selectedUser.profileImage}
                        alt="profileImg"
                        className="h-5 w-5 mr-2 rounded-full object-cover"
                        />
                  <h3 className="text-lg font-bold">{selectedUser.fullName}</h3>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow bg-gray-800 p-4 overflow-y-auto space-y-3">
                {isMessagesLoading ? (
                  <p className="text-gray-400">Loading messages...</p>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.fromUserId === selectedUser.id
                          ? "items-start"
                          : "justify-end"
                      } space-x-2`}
                    >
                      {message.fromUserId === selectedUser.id && (
                        <img
                        src={selectedUser.profileImage}
                        alt="profileImg"
                        className="h-5 w-5 mr-2 rounded-full object-cover"
                        />
                      )}
                       
                       {message.fromUserId != selectedUser.id && (
                        <img
                        src={selectedUser.profileImage}
                        alt="profileImg"
                        className="h-5 w-5 mr-2 rounded-full object-cover"
                        />
                      )}

                      <div
                        className={`p-3 rounded-lg max-w-xs ${
                          message.fromUserId === selectedUser.id
                            ? "bg-gray-600"
                            : "bg-blue-600 text-right"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
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

        {/* Ad Section */}
        <div className="hidden md:block md:w-1/4 lg:w-1/4 bg-gray-800 p-4">
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
