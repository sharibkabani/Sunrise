"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default function CoursePage() {
	const params = useParams();
	const { id } = params;
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCourse = async () => {
			const { data, error } = await supabase
				.from("courses")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				setError(error);
			} else {
				setCourse(data);
			}
			setLoading(false);
		};

		fetchCourse();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold">Loading...</h1>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold">Error fetching course</h1>
				<p>{error.message}</p>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold">Course not found</h1>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold">{course.name}</h1>
				<p className="text-lg text-gray-600 mt-2">By John Doe</p>
				<img
					src={course.thumbnail}
					alt={course.name}
					className="w-full h-96 object-cover mt-6"
				/>
				<p className="text-lg mt-6">{course.description}</p>
			</main>
		</div>
	);
}
