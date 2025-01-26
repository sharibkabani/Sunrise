"use client";

import { useState } from "react";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import TabSection from "@/components/Profile/TabSection";
import TeamSection from "@/components/Profile/TeamSection";
import RecentPosts from "@/components/Profile/RecentPosts";
import Achievements from "@/components/Profile/Achievements";
import { useUser } from "@clerk/clerk-react";

export default function Profile() {
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState("team");

  const renderTabContent = () => {
    switch (activeTab) {
      case "team":
        return <TeamSection />;
      case "posts":
        return <RecentPosts />;
      case "achievements":
        return <Achievements />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-6">
      <div className="px-6">
        <ProfileHeader user={user} />
        <TabSection activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="px-6 mt-6">{renderTabContent()}</div>
    </div>
  );
}
