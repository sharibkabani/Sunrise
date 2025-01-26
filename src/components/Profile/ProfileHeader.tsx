import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function ProfileHeader() {
  return (
    <Card className="p-6 border-none shadow-none">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/default-avatar.png" alt="User avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-muted-foreground">
            Full-stack developer passionate about creating meaningful
            applications
          </p>
        </div>
      </div>
    </Card>
  );
}
