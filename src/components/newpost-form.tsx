import { useState } from "react";
import { Editor } from "@tiptap/react";
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
  const [contentText, setContentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Handle cancel logic here
  };

  return (
    <div className={cn("grid grid-cols-1 gap-10 w-full", className)}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 pt-6">
          <div className="grid gap-2 dark:text-white">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              className="dark:border-white"
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
              onChange={(e: Editor) => {
                setContent(e.getHTML());
                setContentText(e.getText());
              }}
              required
            />
            <div className="text-sm text-muted-foreground text-right">
              {contentText.replace(/[\r\n]/g, "").length} characters
            </div>
          </div>
        </div>
      </form>
      <div className="flex flex-row justify-end gap-2">
        <Button type="submit" className="bg-black text-white hover:bg-gray-700">
          Publish
        </Button>
        <Button
          onClick={handleCancel}
          className="bg-gray-400 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-500 dark:hover:bg-gray-600"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
