import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names

export function NewPostForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleSaveDraft = () => {
    // Handle save draft logic here
  };

  const handleCancel = () => {
    // Handle cancel logic here
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-10 w-full",
        className
      )}
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-2 dark:text-white">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 dark:text-white">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Post Content"
              value={content}
              onChange={(e) => setContent(e)}
              required
            />
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Create Post
        </Button>
        <Button
          onClick={handleSaveDraft}
          className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Save Draft
        </Button>
        <Button
          onClick={handleCancel}
          className="bg-red-500/80 text-white hover:bg-red-600/80"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
