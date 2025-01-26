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
  is_locked: boolean;
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
  const [showingNextIn, setShowingNextIn] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [videoMarkedAsComplete, setVideoMarkedAsComplete] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(
          `
          *,
          videos: course_videos(
            *,
            watched_videos: watched_course_videos(
              is_locked
            )
          )
        `
        )
        .eq("slug", slug)
        .single();

      if (courseError) {
        setError(courseError);
      } else if (courseData) {
        // Sort videos by position and map the data
        const sortedVideos = courseData.videos
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => a.position - b.position)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((video: any) => ({
            ...video,
            // If no watched entry exists, first video is unlocked, others are locked
            is_locked:
              video.watched_videos.length > 0
                ? video.watched_videos[0].is_locked
                : video.position !== 1,
          }));

        setCourse({
          ...courseData,
          videos: sortedVideos || [],
        });
      }
      setLoading(false);
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (!course?.videos || !course.videos.length) return;

    // Find the last unlocked video
    const lastUnlockedVideo = [...course.videos]
      .reverse()
      .find((video) => !video.is_locked);

    // Set either the last unlocked video or the first video as active
    setActiveVideo(lastUnlockedVideo || course.videos[0]);
  }, [course]);

  // Modify markVideoAsWatched to only handle API call without state updates
  const markVideoAsWatched = useCallback(
    async (videoId: number) => {
      if (!user?.id || !course?.videos) return;

      try {
        // Mark current video as completed
        await supabase.from("watched_course_videos").upsert({
          user_id: user.id,
          course_video_id: videoId,
          status: "COMPLETED",
          created_at: new Date().toISOString(),
        });

        setVideoMarkedAsComplete(true);
      } catch (error) {
        console.error("Error updating video progress:", error);
      }
    },
    [user?.id, course?.videos]
  );

  // Separate function to handle unlocking next video
  const unlockNextVideo = useCallback(
    async (currentVideoId: number) => {
      if (!user?.id || !course?.videos) return;

      const currentIndex = course.videos.findIndex(
        (v) => v.id === currentVideoId
      );
      const nextVideo = course.videos[currentIndex + 1];

      if (nextVideo) {
        try {
          await supabase.from("watched_course_videos").upsert({
            user_id: user.id,
            course_video_id: nextVideo.id,
            is_locked: false,
            created_at: new Date().toISOString(),
          });

          // Update local state only after video ends
          setCourse((prevCourse) => {
            if (!prevCourse) return null;

            const updatedVideos = prevCourse.videos.map((video) => {
              if (video.id === currentVideoId) {
                return { ...video, isCompleted: true };
              }
              if (video.id === nextVideo.id) {
                return { ...video, is_locked: false };
              }
              return video;
            });

            return {
              ...prevCourse,
              videos: updatedVideos,
            };
          });
        } catch (error) {
          console.error("Error unlocking next video:", error);
        }
      }
    },
    [user?.id, course?.videos]
  );

  const moveToNextVideo = useCallback(() => {
    if (!course?.videos || !activeVideo) return false;

    const currentIndex = course.videos.findIndex(
      (v) => v.id === activeVideo.id
    );
    const nextVideo = course.videos[currentIndex + 1];

    if (nextVideo) {
      // Reset states before changing video
      setVideoMarkedAsComplete(false);
      setShowingNextIn(false);
      setCountdown(5);
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
      if (progress >= 90 && activeVideo?.id && !videoMarkedAsComplete) {
        markVideoAsWatched(activeVideo.id);
      }
    };

    const handleEnded = async () => {
      if (activeVideo?.id) {
        if (!videoMarkedAsComplete) {
          await markVideoAsWatched(activeVideo.id);
        }
        await unlockNextVideo(activeVideo.id);
        // Just start countdown, don't move to next video here
        setShowingNextIn(true);
        setCountdown(5);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [
    activeVideo?.id,
    markVideoAsWatched,
    unlockNextVideo,
    videoMarkedAsComplete,
  ]);

  // Handle countdown and video transition
  useEffect(() => {
    if (!showingNextIn) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowingNextIn(false);
          setVideoMarkedAsComplete(false);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showingNextIn, moveToNextVideo]);

  const handleVideoClick = (video: CourseVideo) => {
    setActiveVideo(video);
  };

  const canWatchVideo = (video: CourseVideo) => {
    return !video.is_locked;
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

        <div className="flex gap-6 mt-16">
          {/* Left Column - Video List */}
          <div className="w-6/12">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.videos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() =>
                    canWatchVideo(video) && handleVideoClick(video)
                  }
                  className={cn(
                    "flex items-center justify-between p-4 bg-card rounded-lg",
                    canWatchVideo(video)
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
                  {video.is_locked && (
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
                <div className="relative">
                  {renderVideoPlayer(activeVideo)}
                  {showingNextIn && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <p className="text-white text-2xl font-bold">
                        Next video in {countdown}s
                      </p>
                    </div>
                  )}
                </div>
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
