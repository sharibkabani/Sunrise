import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CourseStatus = "Ongoing" | "Completed";

interface CourseCardProps {
  title: string;
  instructor: string;
  imageUrl: string;
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
          <Badge variant={status === "Ongoing" ? "secondary" : "default"}>
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
