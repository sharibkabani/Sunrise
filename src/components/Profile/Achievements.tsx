import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Code } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  total: number;
  current: number;
}

export default function Achievements() {
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Early Adopter",
      description: "Joined during the beta phase",
      progress: 100,
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      total: 1,
      current: 1,
    },
    {
      id: "2",
      title: "Team Builder",
      description: "Build your first team",
      progress: 60,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      total: 5,
      current: 3,
    },
    {
      id: "3",
      title: "Code Master",
      description: "Complete 10 projects",
      progress: 40,
      icon: <Code className="h-5 w-5 text-green-500" />,
      total: 10,
      current: 4,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Achievements</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              {achievement.icon}
              <CardTitle className="text-base">{achievement.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
              <div className="space-y-2">
                <Progress value={achievement.progress} />
                <p className="text-xs text-muted-foreground text-right">
                  {achievement.current} / {achievement.total}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
