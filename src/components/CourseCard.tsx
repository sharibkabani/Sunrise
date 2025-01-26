import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const DEFAULT_IMAGE = "/course-placeholder.jpg"; // Add a default image to your public folder

type CourseStatus = "Ongoing" | "Completed";

interface CourseCardProps {
  title: string;
  instructor: string;
  imageUrl: string;
  videoCount: number;
  status: CourseStatus;
  difficulty: number; // 1 for Beginner, 2 for Intermediate, 3 for Advanced
}

export default function CourseCard({
  title,
  instructor,
  imageUrl,
  videoCount,
  status,
  difficulty,
}: CourseCardProps) {
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
        <p className="text-sm text-muted-foreground">{instructor}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {videoCount} videos
          </span>
          <div className="flex items-center gap-2">
            <Badge variant={status === "Ongoing" ? "secondary" : "default"}>
              {status}
            </Badge>
            <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>
              {getDifficultyLabel(difficulty)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
