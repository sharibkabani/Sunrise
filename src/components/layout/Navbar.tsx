"use client";
import Image from "next/image";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Image
              src="https://gravatar.com/avatar/e53a75077d355074ce92ce1d36688bba?s=400&d=robohash&r=x"
              alt="Sunrise Logo"
              width={128}
              height={40}
              priority
            />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              <Link href="/" className="hover:text-gray-600">
                Home
              </Link>
              <a href="/about" className="hover:text-gray-600">
                About
              </a>
              <a href="/contact" className="hover:text-gray-600">
                Contact
              </a>
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
              <Link href="/profile" className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="https://gravatar.com/avatar/e53a75077d355074ce92ce1d36688bba?s=400&d=robohash&r=x"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600 mt-1">
                  user@example.com
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
