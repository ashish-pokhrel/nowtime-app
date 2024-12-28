"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { fetchData } from "../../utils/axios"; // Adjust to your fetch logic
import Layout from "../component/navbar";

interface User {
  id: number;
  name: string;
  profileImage: string;
}

interface Message {
  user: string;
  text: string;
  timestamp: string;
}

const ChatPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch the list of recent chat users (Replace with actual API call)
    const fetchUsers = async () => {
      const data = await fetchData("/chat/recent-users");
      setUsers(data); // Assuming `data` is an array of users
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      // Fetch messages for the selected user (Replace with actual API call)
      const fetchMessages = async () => {
        const data = await fetchData(`/chat/messages/${selectedUser.id}`);
        setMessages(data); // Assuming `data` is an array of messages
      };

      fetchMessages();
    }
  }, [selectedUser]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (newMessage && selectedUser) {
      const newMessageData = {
        user: selectedUser.name,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessageData]);
      setNewMessage("");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Left Panel: Recent Chats and Search */}
      <div className="w-1/3 bg-gray-800 p-4 overflow-y-auto">
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FaSearch className="text-gray-400 ml-2" />
        </div>

        <div>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded-lg"
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span>{user.name}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No users found.</div>
          )}
        </div>
      </div>

      {/* Right Panel: Chat with Selected User */}
      <div className="flex-1 bg-gray-800 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex items-center mb-4">
              <img
                src={selectedUser.profileImage}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <span className="text-xl font-semibold">{selectedUser.name}</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start ${message.user === selectedUser.name ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs p-2 rounded-lg ${message.user === selectedUser.name ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="p-2 bg-blue-600 text-white rounded-full"
                onClick={handleSendMessage}
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400">Select a user to start chatting.</div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ChatPage;
