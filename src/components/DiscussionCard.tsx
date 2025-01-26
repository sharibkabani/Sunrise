import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaHeart } from "react-icons/fa";
import parse from "html-react-parser";
import { formatDistanceToNow } from "date-fns";

interface DiscussionCardProps {
  id: number;
  title: string;
  username: string;
  avatarUrl: string;
  body: string;
  likes: number;
  readTime: number;
  createdAt: string;
}

export default function DiscussionCard({
  id,
  title,
  username,
  avatarUrl,
  body,
  likes,
  readTime,
  createdAt,
}: DiscussionCardProps) {
  // Function to extract the first 10 words while preserving HTML tags
  const getExcerpt = (html: string, wordCount: number) => {
    const div = document.createElement("div");
    div.innerHTML = html.trim();
    const text = div.textContent || div.innerText || "";
    const words = text.split(/\s+/).slice(0, wordCount).join(" ");
    return words + "...";
  };

  const excerpt = getExcerpt(body, 10);

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex gap-2 text-sm">
          <span className="font-medium">{username}</span>
        </div>
      </div>
      <div>
        <h3
          className="font-semibold leading-snug cursor-pointer"
          onClick={() => (window.location.href = `/posts/${id}`)}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {parse(excerpt)}
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1 text-red-500">
          <FaHeart />
          <span>{likes}</span>
        </div>
        <span>|</span>
        <span>{readTime} min read</span>
        <span>|</span>
        <span>
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <Separator />
    </div>
  );
}
