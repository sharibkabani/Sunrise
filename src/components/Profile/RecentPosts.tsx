import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import parse from "html-react-parser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

type Post = {
  id: number;
  title: string;
  body: string;
  user_id: string;
  likes: number;
  read_time: number;
  created_at: string;
  username: string;
  avatar_url: string;
};

export default function RecentPosts() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const { data, error } = await supabase
            .from("posts")
            .select(
              `
              id,
              title,
              body,
              user_id,
              likes,
              read_time,
              created_at,
              users (
                username,
                avatar
              )
            `
            )
            .eq("user_id", user.id);

          if (error) {
            console.error("Error fetching posts:", error);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedPosts = data.map((post: any) => ({
              id: post.id,
              title: post.title,
              body: post.body,
              user_id: post.user_id,
              likes: post.likes,
              read_time: post.read_time,
              created_at: post.created_at,
              username: Array.isArray(post.users)
                ? post.users[0]?.username
                : post.users.username,
              avatar_url: post.users.avatar,
            }));
            setPosts(formattedPosts);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPosts();
    }
  }, [user]);

  // Function to extract the first 10 words while preserving HTML tags
  const getExcerpt = (html: string, wordCount: number) => {
    const div = document.createElement("div");
    div.innerHTML = html.trim();
    const text = div.textContent || div.innerText || "";
    const words = text.split(/\s+/).slice(0, wordCount).join(" ");
    return words + "...";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              src={post.avatar_url}
              alt={post.username}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm text-gray-700">{post.username}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-xl font-bold mb-2 hover:text-gray-600 cursor-pointer">
                <p>{post.title}</p>
              </h2>
              <div className="text-gray-600 mb-4 line-clamp-3">
                {parse(getExcerpt(post.body, 10))}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span>{post.likes} likes</span>
                <span>{post.read_time} min read</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
