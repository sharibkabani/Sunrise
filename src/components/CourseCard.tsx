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
  imageUrl: string | null;
  videoCount: number;
  status: CourseStatus;
}

export default function CourseCard({
  title,
  instructor,
  imageUrl,
  videoCount,
  status,
}: CourseCardProps) {
  const validImageUrl =
    imageUrl && isValidUrl(imageUrl) ? imageUrl : DEFAULT_IMAGE;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={validImageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <Badge variant={status === "Ongoing" ? "secondary" : "default"}>
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
