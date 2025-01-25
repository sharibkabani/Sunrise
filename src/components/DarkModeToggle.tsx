"use client";
import React, { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={() => setIsDarkMode(!isDarkMode)}
        className="sr-only"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800">
        <div className="w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
      </div>
    </label>
  );
}
