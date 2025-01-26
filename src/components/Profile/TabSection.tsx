import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabSection({
  activeTab,
  onTabChange,
}: TabSectionProps) {
  const tabs = [
    { id: "team", label: "Team" },
    { id: "posts", label: "Recent Posts" },
    { id: "achievements", label: "Achievements" },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
      <TabsList className="w-full justify-start">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
