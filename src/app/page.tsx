"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DiscussionCard from "@/components/DiscussionCard";
import CourseCard from "@/components/CourseCard";
import { createClient } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

type Category = {
	id: number;
	name: string;
};

type Course = {
	id: number;
	name: string;
	thumbnail: string | null;
	videoCount: number;
};

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

type Crypto = {
	id: string;
	name: string;
	current_price: number;
	image: string;
};

function parseHTMLtoText(htmlString) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");
	return doc.body.textContent || "";
}

export default function Home() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [activeTab, setActiveTab] = useState<string>("");
	const [courses, setCourses] = useState<Course[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [cryptos, setCryptos] = useState<Crypto[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchCategories = async () => {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.order("id");

			if (error) {
				console.error("Error fetching categories:", error);
			} else if (data.length > 0) {
				setCategories(data);
				setActiveTab(data[0].id.toString());
			}
			setIsLoading(false);
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		if (!activeTab) return;

		const fetchCourses = async () => {
			const { data, error } = await supabase
				.from("courses")
				.select(
					`
          *,
          course_videos: course_videos(count)
        `
				)
				.eq("category_id", activeTab);

			if (error) {
				console.error("Error fetching courses", error);
			} else {
				setCourses(
					data.map((course) => ({
						...course,
						videoCount: course.course_videos[0].count,
					}))
				);
			}
		};

		fetchCourses();
	}, [activeTab]);

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
				.order("created_at", { ascending: false })
				.limit(3);

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
	}, []);

	useEffect(() => {
		const fetchCryptoData = async () => {
			const response = await fetch(
				"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
			);
			const data = await response.json();
			setCryptos(Array.isArray(data) ? data.slice(0, 4) : []);
		};

		fetchCryptoData();

		const interval = setInterval(() => {
			fetchCryptoData();
		}, 60000); // Update every 60 seconds

		return () => clearInterval(interval);
	}, []);

	const renderTabContent = () => {
		return (
			<>
				{categories.map((category) => (
					<TabsContent key={category.id} value={category.id.toString()}>
						<div className="grid grid-cols-2 gap-6 mt-6">
							{courses.map((course) => (
								<Link key={course.id} href={`/course/${course.id}`}>
									<CourseCard
										title={course.name}
										instructor="John Doe"
										imageUrl={course.thumbnail}
										videoCount={course.videoCount}
										difficulty={course.difficulty}
										status="Ongoing"
									/>
								</Link>
							))}
						</div>
					</TabsContent>
				))}
			</>
		);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col">
				<main className="flex-1 container mx-auto px-4 py-8">
					<div className="flex gap-8">
						<div className="w-8/12">
							<Skeleton className="h-10 w-32 mb-6" />
							<div className="space-y-4">
								<Skeleton className="h-10 w-full" />
								{renderTabContent()}
							</div>
						</div>
						<div className="w-4/12">
							<Skeleton className="h-10 w-32 mb-6" />
							<div className="space-y-4">
								{[...Array(3)].map((_, i) => (
									<Skeleton key={i} className="h-32 w-full" />
								))}
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="flex gap-8">
					<div className="w-8/12">
						<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-6">
							Courses
						</h2>
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="mb-8">
							<TabsList>
								{categories.map((category) => (
									<TabsTrigger key={category.id} value={category.id.toString()}>
										{category.name}
									</TabsTrigger>
								))}
							</TabsList>
							{renderTabContent()}
						</Tabs>
						<div className="mt-8">
							<h2 className="text-3xl font-semibold tracking-tight mb-6">
								Top Cryptocurrencies
							</h2>
							<div className="grid grid-cols-2 gap-6">
								{cryptos.map((crypto) => (
									<div
										key={crypto.id}
										className="bg-card rounded-lg p-4 flex items-center">
										<img
											src={crypto.image}
											alt={crypto.name}
											className="h-8 w-8 mr-4"
										/>
										<div>
											<h3 className="font-semibold">{crypto.name}</h3>
											<p>${crypto.current_price.toLocaleString()}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Discussions Section (4/12) */}
					<div className="w-4/12">
						<Link href="/posts">
							<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-6">
								Posts
							</h2>
						</Link>
						<div className="bg-card rounded-lg p-4">
							{posts.map((post) => (
								<Link key={post.id} href={`/posts/${post.id}`}>
									<DiscussionCard
										title={post.title}
										username={post.username}
										avatarUrl={post.avatar_url}
										body={parseHTMLtoText(post.body)}
										likes={post.likes}
										readTime={post.read_time}
										createdAt={post.created_at}
									/>
								</Link>
							))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
