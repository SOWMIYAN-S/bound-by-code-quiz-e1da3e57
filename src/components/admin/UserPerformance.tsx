
import { useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { quizQuestions } from "@/data/questions";
import { X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: number;
  completed?: boolean;
}

interface UserPerformanceProps {
  user: User | null;
  onClose: () => void;
}

const UserPerformance = ({ user, onClose }: UserPerformanceProps) => {
  if (!user) return null;
  
  // For a real application, you would have categories or topic data for questions
  // Here we'll simulate some categories for visualization
  const performanceData = [
    { subject: "General Knowledge", score: 0.8 },
    { subject: "Problem Solving", score: 0.7 },
    { subject: "Technical Skills", score: 0.9 },
    { subject: "Communication", score: 0.6 },
    { subject: "Teamwork", score: 0.85 }
  ];
  
  const scorePercentage = user.score 
    ? Math.round((user.score / quizQuestions.length) * 100) 
    : 0;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Performance Analysis: {user.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">User Details</h3>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Phone:</span> {user.phone}</p>
            <p><span className="font-medium">Completion Status:</span> {user.completed ? "Completed" : "Pending"}</p>
            <p className="mt-4">
              <span className="font-medium">Overall Score:</span>{" "}
              {user.completed 
                ? <span className="text-xl">{user.score}/{quizQuestions.length} ({scorePercentage}%)</span>
                : "Not available"}
            </p>
            
            {!user.completed && (
              <p className="text-yellow-600 mt-2">
                This user hasn't completed the quiz yet.
              </p>
            )}
          </div>
          
          {user.completed && (
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  performance: { theme: { light: "rgba(99, 102, 241, 0.7)", dark: "rgba(124, 58, 237, 0.7)" } }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={performanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Radar
                      name="Performance"
                      dataKey="score"
                      stroke="var(--color-performance)"
                      fill="var(--color-performance)"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPerformance;
