"use client";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import logo from "./logo.png";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 dark:bg-gray-900">
      <div className="flex flex-col gap-4 p-6 md:p-10 dark:text-white">
        <div className="flex justify-between items-center">
          <p href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground dark:bg-primary-dark dark:text-primary-foreground-dark">
              <GalleryVerticalEnd className="size-4" />
            </div>
            SunRise
          </p>
          <div className="ml-auto">
            <DarkModeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:flex lg:items-center lg:justify-center dark:bg-muted-dark">
        <div className="w-auto h-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <img
            src={logo.src}
            alt="SunRise Icon"
            className="h-[15%] w-auto dark:brightness-[0.2] dark:grayscale"
          />
          <div className="text-center font-serif lg:ml-4 dark:text-white">
            <div className="text-5xl font-serif">SunRise</div>
            <div className="pt-4 text-2xl font-serif">Elevate Your Future</div>
          </div>
        </div>
      </div>
    </div>
  );
}
