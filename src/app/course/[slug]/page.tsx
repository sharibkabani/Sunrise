"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

type CourseVideo = {
  id: number;
  position: number;
  name: string;
  video_url: string;
  duration: number;
  isCompleted?: boolean;
};

type Course = {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  videos: CourseVideo[];
};

export default function CoursePage() {
  const params = useParams();
  const { slug } = params;
  const { user } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [activeVideo, setActiveVideo] = useState<CourseVideo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastWatchedPosition, setLastWatchedPosition] = useState<number>(-1);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          videos: course_videos(
            *,
            position
          )
        `
        )
        .eq("slug", slug)
        .single();

      if (error) {
        setError(error);
      } else {
        // Sort videos by position before setting state
        const sortedVideos = data.videos.sort(
          (a: CourseVideo, b: CourseVideo) => a.position - b.position
        );
        setCourse({
          ...data,
          videos: sortedVideos || [],
        });
      }
      setLoading(false);
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (course?.videos && course.videos.length > 0) {
      // Set first video as active by default
      setActiveVideo(course.videos[0]);
    }
  }, [course]);

  useEffect(() => {
    const fetchLastWatchedPosition = async () => {
      if (!user?.id || !course?.id) return;

      // First get all course video IDs for this course
      const courseVideoIds = course.videos.map((v) => v.id);

      const { data, error } = await supabase
        .from("watched_course_videos")
        .select(
          `
          course_videos!inner (
            position
          )
        `
        )
        .eq("user_id", user.id)
        .in("course_video_id", courseVideoIds)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLastWatchedPosition(data.course_videos.position);
      } else {
        // If no records found, set to -1 to only enable first video
        setLastWatchedPosition(-1);
      }
    };

    fetchLastWatchedPosition();
  }, [user?.id, course?.id, course?.videos]);

  const markVideoAsWatched = useCallback(
    async (videoId: number) => {
      if (!user?.id) return;

      const { error } = await supabase.from("watched_course_videos").upsert({
        user_id: user.id,
        course_video_id: videoId,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error recording video progress:", error);
      }
    },
    [user?.id]
  );

  const moveToNextVideo = useCallback(() => {
    if (!course?.videos || !activeVideo) return false;

    const currentIndex = course.videos.findIndex(
      (v) => v.id === activeVideo.id
    );
    const nextVideo = course.videos[currentIndex + 1];

    if (nextVideo) {
      setActiveVideo(nextVideo);
      return true;
    }
    return false;
  }, [course?.videos, activeVideo]);

  // Update video progress handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      if (progress >= 90 && activeVideo?.id) {
        markVideoAsWatched(activeVideo.id);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };

    const handleEnded = async () => {
      if (activeVideo?.id) {
        await markVideoAsWatched(activeVideo.id);
        moveToNextVideo();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeVideo?.id, markVideoAsWatched, moveToNextVideo]);

  const handleVideoClick = (video: CourseVideo) => {
    setActiveVideo(video);
  };

  const canWatchVideo = (videoIndex: number) => {
    // First video is always watchable
    if (videoIndex === 0) return true;

    // User can watch next video after current position
    return videoIndex <= lastWatchedPosition;
  };

  const renderVideoPlayer = (video: CourseVideo) => {
    return (
      <video
        ref={videoRef}
        key={video.id}
        className="w-full aspect-video rounded-lg"
        controls
        src={video.video_url}
      />
    );
  };

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
        <h1 className="text-3xl font-bold mb-6">{course.name}</h1>

        <div className="flex gap-6">
          {/* Left Column - Video List */}
          <div className="w-6/12">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.videos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() =>
                    canWatchVideo(index) && handleVideoClick(video)
                  }
                  className={cn(
                    "flex items-center justify-between p-4 bg-card rounded-lg",
                    canWatchVideo(index)
                      ? "hover:bg-accent cursor-pointer"
                      : "bg-muted cursor-not-allowed",
                    activeVideo?.id === video.id &&
                      "bg-accent/50 ring-1 ring-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-base">{video.name}</h3>
                    </div>
                  </div>
                  {!canWatchVideo(index) && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Video Player */}
          <div className="w-6/12 flex flex-col gap-4">
            {activeVideo && (
              <>
                {renderVideoPlayer(activeVideo)}
                <div className="mt-4 bg-card rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{activeVideo.name}</h3>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
