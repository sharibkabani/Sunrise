import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export function NewPostForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentText, setContentText] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate read time
    const readTime = Math.ceil(contentText.replace(/[\r\n]/g, "").length / 500);

    // Insert the new post into the posts table
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          user_id: user?.id,
          title: title,
          body: content,
          read_time: readTime,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting post:", error);
      return;
    }

    // Redirect to the new post's page
    redirect(`/posts/${data.id}`);
  };

  const handleCancel = () => {
    // Handle cancel logic here
    redirect("/");
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
              placeholder=""
              value={content}
              onChange={(e: Editor) => {
                setContent(e.getHTML());
                setContentText(e.getText());
              }}
              required
            />
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {contentText.replace(/[\r\n]/g, "").length} characters
          </div>
        </div>
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
      </form>
    </div>
  );
}