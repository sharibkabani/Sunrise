import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface DiscussionCardProps {
  title: string;
  author: string;
  date: string;
  excerpt: string;
  avatarUrl: string;
  readTime: string;
}

export default function DiscussionCard({
  title,
  author,
  date,
  excerpt,
  avatarUrl,
  readTime,
}: DiscussionCardProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex gap-2 text-sm">
          <span className="font-medium">{author}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{date}</span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {excerpt}
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{readTime} min read</span>
      </div>
      <Separator />
    </div>
  );
}
