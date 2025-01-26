"use client";

import { useState } from "react";
import Image from "next/image";

type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
};

export default function TeamSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Mock search results - replace with actual API call
    if (query.length > 0) {
      setShowDropdown(true);
      // Simulate API call
      setSearchResults([
        {
          id: "1",
          username: "johndoe",
          email: "john@example.com",
          avatar: "/avatars/default.png",
        },
        {
          id: "2",
          username: "janedoe",
          email: "jane@example.com",
          avatar: "/avatars/default.png",
        },
      ]);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {showDropdown && (
            <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <span className="text-gray-500">{user.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Invite Users
        </button>
      </div>
    </div>
  );
}
