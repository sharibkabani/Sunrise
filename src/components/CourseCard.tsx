import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type CourseStatus = "PENDING" | "ONGOING" | "COMPLETED";

interface CourseCardProps {
  title: string;
  imageUrl: string;
  videoCount: number;
  status: CourseStatus;
  difficulty: number;
  courseId?: number;
  onStartLearning?: (courseId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function CourseCard({
  title,
  imageUrl,
  videoCount,
  difficulty,
  status,
  courseId,
  onStartLearning,
  isLoading,
  slug,
}: CourseCardProps & { slug: string }) {
  const router = useRouter();

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      default:
        return "Unknown";
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-500 text-white";
      case 2:
        return "bg-yellow-500 text-white";
      case 3:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getButtonText = (status: CourseStatus) => {
    switch (status) {
      case "ONGOING":
        return "Continue";
      case "COMPLETED":
        return "Completed";
      default:
        return "Start Learning";
    }
  };

  return (
    <Card>
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <h3 className="font-semibold text-lg">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {videoCount} videos
          </span>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>
              {getDifficultyLabel(difficulty)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {courseId && onStartLearning && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (status === "PENDING") {
                  onStartLearning(courseId);
                } else if (status === "ONGOING") {
                  router.push(`/course/${slug}`);
                }
              }}
              disabled={isLoading}
              variant="default"
              size="sm"
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                getButtonText(status)
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
