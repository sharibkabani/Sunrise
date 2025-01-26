"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import { Button } from "./button";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading"; // Import the Heading extension
import { cn } from "@/lib/utils";

interface TextareaProps {
  id: string;
  className?: string;
  value: string;
  onChange: (value: Editor) => void;
  placeholder?: string;
  required: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  id,
  className,
  value,
  onChange,
  placeholder,
  required,
  ...props
}) => {
  const editor = useEditor({
    extensions: [
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6], // Enable heading levels you want to use
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          itemTypeName: "listItem",
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          keepMarks: true,
          itemTypeName: "listItem",
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
      }),
    ],
    content: value,
    editable: true,
    onUpdate: ({ editor }) => {
      onChange(editor);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none max-w-none dark:prose-invert [&_h1]:text-5xl [&_h1]:font-bold [&_h2]:text-4xl [&_h2]:font-bold [&_h3]:text-3xl [&_h3]:font-semibold [&_h4]:text-2xl [&_h4]:font-semibold [&_h5]:text-xl [&_h5]:font-semibold [&_h6]:text-lg [&_h6]:font-semibold",
      },
    },
    immediatelyRender: false,
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-1 p-1 border rounded-md bg-white dark:bg-gray-800">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("bold") ? "bg-slate-200 dark:bg-slate-700" : ""
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("italic") ? "bg-slate-200 dark:bg-slate-700" : ""
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("bulletList")
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("orderedList")
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("heading", { level: 1 })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("heading", { level: 2 })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("heading", { level: 3 })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("heading", { level: 4 })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("heading", { level: 5 })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <Heading5 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={cn(
            "p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
            editor?.isActive("heading", { level: 6 })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          )}
        >
          <Heading6 className="h-4 w-4" />
        </Button>
      </div>
      <div
        className={cn(
          "relative min-h-[60vh] w-full rounded-md border border-input p-3 bg-transparent",
          "focus-within:outline-none focus-within:ring-1 focus-within:ring-black",
          className
        )}
        onClick={() => {
          if (editor && !editor.isDestroyed) {
            editor.chain().focus().run();
          }
        }}
      >
        {!editor?.getText() && (
          <div className="absolute top-[10px] left-[12px] text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
        <EditorContent
          editor={editor}
          className="w-full h-full outline-none min-h-[inherit]"
        />
      </div>
    </div>
  );
};

export { Textarea };
