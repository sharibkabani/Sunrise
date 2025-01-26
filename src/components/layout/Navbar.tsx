"use client";
import Image from "next/image";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function NavBar() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const { isSignedIn, user } = useUser();
	const [userAvatar, setUserAvatar] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
		if (user) {
			setUserAvatar(user.imageUrl);
			setUsername(user.username);
		}
	}, [user]);

	if (!mounted) {
		return null; // or a loading skeleton
	}

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
								priority
							/>
						</Link>
					</div>
					<div className="flex items-center gap-8">
						<div className="flex gap-6">
							<Link href="/" className="hover:text-gray-600">
								Home
							</Link>
							<Link href="/posts" className="hover:text-gray-600">
								Posts
							</Link>
							<Link href="/profile" className="hover:text-gray-600">
								Profile
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
								<Link href="/profile" className="flex flex-col items-center">
									<div className="">
										<UserButton />
									</div>
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
