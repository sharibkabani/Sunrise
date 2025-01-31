"use client";

import { NewPostForm } from "@/components/newpost-form";
import { useState, useEffect } from "react";

export function NewPostPageContent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="relative top-[10%] left-[5%] pt-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create a New Post
        </h1>
      </div>
      <div className="flex justify-start items-center pt-6 pl-[5%] w-[95%] h-full">
        <NewPostForm />
      </div>
    </div>
  );
  
}
