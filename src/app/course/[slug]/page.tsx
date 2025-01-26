"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Lock, Check } from "lucide-react"; // Add Check import
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

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
  isCompleted: boolean; // Add this field
};

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
};

type CourseQuiz = {
  id: number;
  course_id: number;
  questions: QuizQuestion[];
};

type Course = {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  videos: CourseVideo[];
  quiz: CourseQuiz | null;
};

type QuizResult = {
  score: number;
  total_questions: number;
  created_at: string;
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseResponse = await supabase
        .from("courses")
        .select(
          `
        *,
        videos: course_videos(
          *,
          watched_videos: watched_course_videos(
            is_locked,
            status
          )
        ),
        quiz: course_quizes(*)
      `
        )
        .eq("slug", slug)
        .single();

      let quizResultResponse = null;
      if (user?.id && courseResponse.data?.id) {
        quizResultResponse = await supabase
          .from("quiz_results")
          .select("*")
          .eq("course_id", courseResponse.data.id)
          .eq("user_id", user.id)
          .single();
      }

      if (courseResponse.error) {
        setError(courseResponse.error);
      } else if (courseResponse.data) {
        // Sort videos by position and map the data
        const sortedVideos = courseResponse.data.videos
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
            isCompleted:
              video.watched_videos.length > 0 &&
              video.watched_videos[0].status === "COMPLETED",
          }));

        // Check if all videos are completed
        const allCompleted = sortedVideos.every(
          (video: { isCompleted: boolean }) => video.isCompleted
        );
        setShowQuiz(allCompleted);

        setCourse({
          ...courseResponse.data,
          videos: sortedVideos || [],
          quiz: courseResponse.data.quiz[0] || null,
        });

        // Set quiz result if exists
        if (quizResultResponse?.data) {
          setQuizResult(quizResultResponse.data);
        }
      }
      setLoading(false);
    };

    fetchCourse();
  }, [slug, user?.id]);

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

        // Update user points using direct increment
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("points")
          .eq("id", user.id)
          .single();

        if (userError) {
          throw userError;
        }

        const newPoints = (userData?.points || 0) + 50;

        console.log({ newPoints });

        await supabase
          .from("users")
          .update({ points: newPoints })
          .eq("id", user.id);

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

  const handleQuizSubmit = async () => {
    if (!course?.quiz || !user?.id) return;

    // Calculate score
    const score = course.quiz.questions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correct_answer ? 1 : 0);
    }, 0);

    try {
      // Save quiz result
      const { data, error } = await supabase
        .from("quiz_results")
        .insert({
          user_id: user.id,
          course_id: course.id,
          score,
          total_questions: course.quiz.questions.length,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setQuizResult(data);

      // Show success message
      alert(
        `Congratulations! You scored ${score}/${course.quiz.questions.length}`
      );
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
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
          {/* Left Column - Video List - Always visible */}
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
                      {video.isCompleted ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
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

          {/* Right Column - Video Player or Quiz */}
          <div className="w-6/12 flex flex-col gap-4">
            {showQuiz && course?.quiz ? (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Course Quiz</h2>
                {quizResult ? (
                  <div className="text-center py-8 flex items-center flex-col gap-4">
                    <Image
                      alt="Trophy"
                      priority
                      src={"/trophy.png"}
                      width={190}
                      height={190}
                    />
                    <h3 className="text-xl font-medium">Quiz Completed!</h3>
                    <p className="text-lg">
                      You scored: {quizResult.score}/
                      {quizResult.total_questions}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Completed on:{" "}
                      {new Date(quizResult.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="h-[600px] pr-4">
                      {course.quiz.questions.map((q) => (
                        <div key={q.id} className="mb-8">
                          <h3 className="text-lg font-medium mb-4">
                            {q.id}. {q.question}
                          </h3>
                          <RadioGroup
                            value={selectedAnswers[q.id]}
                            onValueChange={(value) =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [q.id]: value,
                              }))
                            }
                          >
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <RadioGroupItem
                                  value={opt}
                                  id={`q${q.id}-opt${optIdx}`}
                                />
                                <label
                                  htmlFor={`q${q.id}-opt${optIdx}`}
                                  className="text-sm"
                                >
                                  {opt}
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </ScrollArea>
                    <Button
                      className="w-full mt-4"
                      onClick={handleQuizSubmit}
                      disabled={
                        Object.keys(selectedAnswers).length !==
                        course.quiz.questions.length
                      }
                    >
                      Submit Quiz
                    </Button>
                  </>
                )}
              </div>
            ) : (
              activeVideo && (
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
                    <h3 className="font-semibold text-lg">
                      {activeVideo.name}
                    </h3>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
