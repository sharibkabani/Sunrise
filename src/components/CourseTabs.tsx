"use client";

interface CourseTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CourseTabs({
  activeTab,
  onTabChange,
}: CourseTabsProps) {
  const tabs = ["ETFs", "Crypto", "Mutual Funds"];

  return (
    <div className="flex gap-4 border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 -mb-px ${
            activeTab === tab
              ? "border-b-2 border-blue-500 font-medium text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
