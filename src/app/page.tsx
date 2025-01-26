"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewPost from "./newPost/page";
import DiscussionCard from "@/components/DiscussionCard";
import CourseCard from "@/components/CourseCard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("ETFs");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-8/12">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-6">
              Courses
            </h2>
            <Tabs defaultValue="ETFs" className="mb-8">
              <TabsList>
                <TabsTrigger value="ETFs">ETFs</TabsTrigger>
                <TabsTrigger value="Crypto">Crypto</TabsTrigger>
                <TabsTrigger value="Mutual Funds">Mutual Funds</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="grid grid-cols-2 gap-6">
              <CourseCard
                title="Introduction to ETFs"
                instructor="John Doe"
                imageUrl="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
                videoCount={12}
                status="Ongoing"
              />
              <CourseCard
                title="Advanced ETF Trading"
                instructor="Jane Smith"
                imageUrl="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f"
                videoCount={15}
                status="Completed"
              />
              {/* Add more CourseCards as needed */}
            </div>
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
