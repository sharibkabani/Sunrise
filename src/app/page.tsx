"use client";

import { useState } from "react";
import NewPost from "./newPost/page";
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

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
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

  const renderTabContent = () => {
    return (
      <>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id.toString()}>
            <div className="grid grid-cols-2 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <CourseCard
                    title={course.name}
                    instructor="John Doe"
                    imageUrl={course.thumbnail}
                    videoCount={course.videoCount}
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
              className="mb-8"
            >
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id.toString()}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {renderTabContent()}
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
