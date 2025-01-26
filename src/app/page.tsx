"use client";

import { useState } from "react";
import NewPost from "./newPost/page";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DiscussionCard from "@/components/DiscussionCard";
import CourseCard from "@/components/CourseCard";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default function Home() {
	const [activeTab, setActiveTab] = useState("ETFs");
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			const { data, error } = await supabase
				.from("courses")
				.select("*")
				.eq("category", activeTab);

			if (error) {
				console.error("Error fetching courses", error);
			} else {
				setCourses(data);
			}
		};

		fetchCourses();
	}, [activeTab]);

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
								<TabsTrigger value="ETFs">ETFs</TabsTrigger>
								<TabsTrigger value="Crypto">Crypto</TabsTrigger>
								<TabsTrigger value="Mutual Funds">Mutual Funds</TabsTrigger>
							</TabsList>
							<TabsContent value="ETFs">
								<div className="grid grid-cols-2 gap-6">
									{courses.map((course) => (
										<Link key={course.id} href={`/course/${course.id}`}>
											<>
												<CourseCard
													title={course.name}
													instructor="John Doe"
													imageUrl={course.thumbnail}
													// videoCount={course.chapters.split(",").length}
													status="In Progress"
												/>
											</>
										</Link>
									))}
								</div>
							</TabsContent>
							<TabsContent value="Crypto">
								<div className="grid grid-cols-2 gap-6">
									{courses.map((course) => (
										<Link key={course.id} href={`/course/${course.id}`}>
											<>
												<CourseCard
													title={course.name}
													instructor="John Doe"
													imageUrl={course.thumbnail}
													// videoCount={course.chapters.split(",").length}
													status="In Progress"
												/>
											</>
										</Link>
									))}
								</div>
							</TabsContent>
							<TabsContent value="Mutual Funds">
								<div className="grid grid-cols-2 gap-6">
									{courses.map((course) => (
										<Link key={course.id} href={`/course/${course.id}`}>
											<>
												<CourseCard
													title={course.name}
													instructor="John Doe"
													imageUrl={course.thumbnail}
													// videoCount={course.chapters.split(",").length}
													status="In Progress"
												/>
											</>
										</Link>
									))}
								</div>
							</TabsContent>
						</Tabs>
					</div>

					{/* Discussions Section (4/12) */}
					<div className="w-4/12">
						<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-6">
							Discussions
						</h2>
						<div className="bg-card rounded-lg p-4">
							<DiscussionCard
								title="Understanding ETF Fundamentals"
								author="Sarah Johnson"
								date="Mar 12"
								excerpt="A deep dive into how ETFs work and why they're becoming increasingly popular among retail investors..."
								avatarUrl="https://gravatar.com/avatar/e53a75077d355074ce92ce1d36688bba?s=400&d=robohash&r=x"
								readTime="5"
							/>
							<DiscussionCard
								title="Crypto Market Analysis Q1 2024"
								author="Mike Chen"
								date="Mar 10"
								excerpt="Breaking down the latest trends in cryptocurrency markets and what to expect in the coming months..."
								avatarUrl="https://gravatar.com/avatar/e53a75077d355074ce92ce1d36688bba?s=400&d=robohash&r=x"
								readTime="8"
							/>
							<DiscussionCard
								title="Mutual Funds vs ETFs"
								author="Alex Turner"
								date="Mar 8"
								excerpt="Comparing the pros and cons of mutual funds and ETFs for long-term investment strategies..."
								avatarUrl="https://gravatar.com/avatar/e53a75077d355074ce92ce1d36688bba?s=400&d=robohash&r=x"
								readTime="6"
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
