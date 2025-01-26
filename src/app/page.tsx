"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DiscussionCard from "@/components/DiscussionCard";
import CourseCard, { CourseStatus } from "@/components/CourseCard";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

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
  status: CourseStatus;
  difficulty: number;
  slug: string;
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

type CourseVideo = {
  id: number;
  course_id: number;
  title: string;
  order: number;
};

function parseHTMLtoText(htmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState<{
    [key: number]: boolean;
  }>({});

  const { user } = useUser();

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
        .order("difficulty", { ascending: true })
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

  const handleStartLearning = async (courseId: number) => {
    setLoadingCourses((prev) => ({ ...prev, [courseId]: true }));

    try {
      // 1. Update course status to ONGOING
      const { error: courseError } = await supabase
        .from("courses")
        .update({ status: "ONGOING" })
        .eq("id", courseId);

      if (courseError) throw courseError;

      // 2. Fetch all videos for this course
      const { data: courseVideos, error: videosError } = await supabase
        .from("course_videos")
        .select("*")
        .eq("course_id", courseId)
        .order("position");

      if (videosError) throw videosError;

      // 3. Create watched_course_videos entries
      const watchedVideosData = courseVideos.map(
        (video: CourseVideo, index: number) => ({
          course_video_id: video.id,
          status: "PENDING",
          is_locked: index !== 0, // First video is unlocked
          user_id: user?.id,
          created_at: new Date().toISOString(),
        })
      );

      const { error: watchedError } = await supabase
        .from("watched_course_videos")
        .insert(watchedVideosData);

      if (watchedError) throw watchedError;

      // Find the course to get its slug
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        // Update local state
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, status: "ONGOING" as CourseStatus } : c
          )
        );
        // Redirect to course content
        router.push(`/course/${course.slug}`);
      }
    } catch (error) {
      console.error("Error starting course:", error);
    } finally {
      setLoadingCourses((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const renderTabContent = () => {
    return (
      <>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id.toString()}>
            <div className="grid grid-cols-2 gap-6 mt-6">
              {courses.map((course) => (
                <div key={course.slug}>
                  <CourseCard
                    title={course.name}
                    imageUrl={course.thumbnail || ""}
                    videoCount={course.videoCount}
                    difficulty={course.difficulty}
                    status={course.status}
                    courseId={course.id}
                    onStartLearning={handleStartLearning}
                    isLoading={loadingCourses[course.id]}
                    slug={course.slug}
                  />
                </div>
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
          <div className="flex items-center justify-center h-full">
            <p className="text-lg">Loading...</p>
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
            <div className="mt-8">
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Top Cryptocurrencies
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {cryptos.map((crypto) => (
                  <div
                    key={crypto.id}
                    className="bg-card rounded-lg p-4 flex items-center"
                  >
                    <Image
                      width={90}
                      height={90}
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
                    id={post.id}
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
