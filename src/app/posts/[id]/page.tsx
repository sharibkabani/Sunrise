"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaHeart } from "react-icons/fa";
import { format } from "date-fns";

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

export default function PostPage() {
	const { id } = useParams();
	const [post, setPost] = useState<Post | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPost = async () => {
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
				.eq("id", id)
				.single();

			if (error) {
				console.error("Error fetching post:", error);
			} else {
				const formattedPost = {
					...data,
					username: data.users.username,
					avatar_url: data.users.avatar,
				};
				setPost(formattedPost);
			}
			setIsLoading(false);
		};

		fetchPost();
	}, [id]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Skeleton className="h-10 w-32 mb-6" />
				<Skeleton className="h-10 w-full" />
			</div>
		);
	}

	if (!post) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<h1 className="text-3xl font-bold">Post not found</h1>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="flex flex-col items-center gap-2 ">
					<Avatar className="h-12 w-12">
						<AvatarImage src={post.avatar_url} />
						<AvatarFallback>{post.username[0]}</AvatarFallback>
					</Avatar>
					<div className="flex gap-2 text-sm">
						<span className="font-medium">{post.username}</span>
					</div>
				</div>
				<div className="bg-card rounded-lg p-8 max-w-3xl mx-auto">
					<h1 className="text-4xl font-bold mb-4 text-center">{post.title}</h1>
					<div
						className="prose mb-4 mx-auto"
						dangerouslySetInnerHTML={{ __html: post.body }}
					/>
					<div className="flex items-center justify-center gap-4 text-xs text-gray-500">
						<div className="flex items-center gap-1 text-red-500">
							<FaHeart />
							<span>{post.likes}</span>
						</div>
						<span>{post.read_time} min read</span>
						<span>{format(new Date(post.created_at), "MMMM dd, yyyy")}</span>
					</div>
				</div>
			</main>
		</div>
	);
}
