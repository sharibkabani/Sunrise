"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: "invited" | "accepted";
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      status: "accepted",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "invited",
    },
    {
      id: "3",
      name: "Sam Wilson",
      email: "sam.wilson@example.com",
      status: "accepted",
    },
    {
      id: "4",
      name: "Lucy Adams",
      email: "lucy.adams@example.com",
      status: "invited",
    },
  ]);

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");

  const handleInvite = () => {
    if (!validateEmail(newMemberEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      status: "invited",
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setNewMemberEmail("");
    setError("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="space-y-6 ">
      {/* Invite Members Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Enter email to invite..."
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleInvite}
            variant="default"
            className="flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Invite</span>
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* List of Users */}
      <div className="">
        {teamMembers.map((member) => (
          <div key={member.id}>
            <Card className="border-none rounded-none bg-none shadow-none">
              <CardContent className="flex items-center justify-between p-4">
                {/* Avatar and Email */}
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${member.name}`}
                      alt={member.name}
                    />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-medium">{member.email}</p>
                  </div>
                </div>
                {/* Status Badge */}
                <Badge
                  variant={
                    member.status === "accepted" ? "default" : "secondary"
                  }
                  className={`capitalize ${
                    member.status === "invited"
                      ? "bg-secondary text-secondary-foreground"
                      : ""
                  }`}
                >
                  {member.status}
                </Badge>
              </CardContent>
            </Card>
            <Separator className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
