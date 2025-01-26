import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  title: string;
  date: string;
  preview: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
}

const posts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    date: "2023-10-15",
    preview:
      "Learn the basics of Next.js and how to build modern web applications...",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    author: {
      name: "John Doe",
      avatar: "https://ui.shadcn.com/avatars/01.png",
    },
  },
  {
    id: "2",
    title: "Understanding TypeScript",
    date: "2023-10-10",
    preview: "Dive deep into TypeScript features and best practices...",
    imageUrl: "https://images.unsplash.com/photo-1517430816045-df4b7de01c9d",
    author: {
      name: "Jane Smith",
      avatar: "https://ui.shadcn.com/avatars/01.png",
    },
  },
];

export default function RecentPosts() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Recent Posts</h2>
      {posts.map((post) => (
        <article
          key={post.id}
          className="flex flex-col gap-4 border-b border-gray-200 pb-8"
        >
          <div className="flex items-center gap-3">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm text-gray-700">{post.author.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-xl font-bold mb-2 hover:text-gray-600 cursor-pointer">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.preview}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(post.date), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="w-full h-32 relative">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
