"use client";
import Image from "next/image";
import Link from "next/link";
import { Sun, Moon, Trophy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("users")
        .select("points")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        // Each watched video is worth 10 points
        setPoints(data.points);
      }
    };

    fetchPoints();
  }, [user?.id]);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Image
                src="https://sunrise-hackathon.s3.us-east-2.amazonaws.com/sunrise_logo.webp"
                alt="Sunrise Logo"
                width={128}
                height={40}
                priority={false}
              />
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              <Link href="/" className="hover:text-gray-600 pt-1">
                Home
              </Link>
              <Link href="/posts" className="hover:text-gray-600 pt-1">
                Posts
              </Link>
              <Link href="/profile" className="hover:text-gray-600 pt-1">
                Profile
              </Link>
              <Link href="/about" className="hover:text-gray-600 pt-1">
                About
              </Link>
              <Link href="/newPost">
                <button className="bg-black text-white rounded-full px-6 py-2 text-sm hover:bg-gray-700">
                  New Post
                </button>
              </Link>
            </div>
            <div className="flex items-center space-x-2 w-[100px] justify-between">
              <div className="w-[20px]">
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all scale-100 dark:scale-0" />
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() =>
                  setTheme(theme === "light" ? "dark" : "light")
                }
              />
              <div className="w-[20px]">
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all scale-0 dark:scale-100" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              {isSignedIn && user ? (
                <Link
                  href="/profile"
                  className="flex flex-col items-center gap-1"
                >
                  <UserButton />
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    {points} points
                  </span>
                </Link>
              ) : (
                <SignInButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
