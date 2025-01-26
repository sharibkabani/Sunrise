"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import DiscussionCard from "@/components/DiscussionCard";

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

export default function DiscussionsPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [sortOption, setSortOption] = useState<string>("most_recent");

	useEffect(() => {
		const fetchPosts = async () => {
			const { data, error } = await supabase
				.from("posts")
				.select(
					`
          *,
          users (
            username,
            avatar
          )
        `
				)
				.order(sortOption === "most_recent" ? "created_at" : "likes", {
					ascending: false,
				});

			if (error) {
				console.error("Error fetching posts:", error);
			} else {
				const formattedPosts = data.map((post) => ({
					...post,
					username: post.users.username,
					avatar_url: post.users.avatar,
				}));
				setPosts(formattedPosts);
			}
		};

		fetchPosts();
	}, [sortOption]);

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-semibold tracking-tight ml-4">Posts</h2>
					<select
						value={sortOption}
						onChange={(e) => setSortOption(e.target.value)}
						className="border rounded p-2">
						<option value="most_recent">Most Recent</option>
						<option value="most_liked">Most Liked</option>
					</select>
				</div>
				<div className="bg-card rounded-lg p-4">
					{posts.map((post) => (
						<DiscussionCard
							key={post.id}
							id={post.id}
							title={post.title}
							username={post.username}
							avatarUrl={post.avatar_url}
							body={post.body}
							likes={post.likes}
							readTime={post.read_time}
							createdAt={post.created_at}
						/>
					))}
				</div>
			</main>
		</div>
	);
}
