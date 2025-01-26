import React from "react";
import { UserResource } from "@clerk/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function ProfileHeader({
  user,
}: {
  user: UserResource | null | undefined;
}) {
  return (
    <Card className="p-6 border-none shadow-none">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={user?.imageUrl || "/default-avatar.png"}
            alt="User avatar"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">@{user?.username}</h1>
          <p className="text-muted-foreground">
            Full-stack developer passionate about creating meaningful
            applications
          </p>
        </div>
      </div>
    </Card>
  );
}
