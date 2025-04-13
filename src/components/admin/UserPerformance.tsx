
import { useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { quizQuestions } from "@/data/questions";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Create time spent data (simulated)
  const timeSpentData = [
    { question: "Q1", minutes: 1.2 },
    { question: "Q2", minutes: 2.5 },
    { question: "Q3", minutes: 1.8 },
    { question: "Q4", minutes: 3.0 },
    { question: "Q5", minutes: 2.2 }
  ];
  
  const scorePercentage = user.score 
    ? Math.round((user.score / quizQuestions.length) * 100) 
    : 0;
    
  const performanceLevel = () => {
    if (scorePercentage >= 90) return "Exceptional";
    if (scorePercentage >= 75) return "Advanced";
    if (scorePercentage >= 60) return "Proficient";
    if (scorePercentage >= 40) return "Developing";
    return "Needs Improvement";
  };

  return (
    <Card className="mt-6 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Performance Analysis: {user.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">User Details</h3>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phone}</p>
                <p><span className="font-medium">Completion Status:</span> {user.completed ? "Completed" : "Pending"}</p>
                
                {user.completed && (
                  <>
                    <p className="mt-4">
                      <span className="font-medium">Overall Score:</span>{" "}
                      <span className="text-xl">{user.score}/{quizQuestions.length} ({scorePercentage}%)</span>
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Performance Level:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        scorePercentage >= 75 ? 'bg-green-100 text-green-800' : 
                        scorePercentage >= 60 ? 'bg-blue-100 text-blue-800' : 
                        scorePercentage >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {performanceLevel()}
                      </span>
                    </p>
                  </>
                )}
                
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
          </TabsContent>
          
          <TabsContent value="detailed">
            {user.completed ? (
              <div className="h-[300px]">
                <h3 className="font-medium mb-2">Time Spent Per Question (Minutes)</h3>
                <ChartContainer
                  config={{
                    time: { theme: { light: "#8b5cf6", dark: "#a78bfa" } }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeSpentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="question" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent labelFormatter={(value) => `Question: ${value}`} />} />
                      <Legend />
                      <Bar dataKey="minutes" name="Time (minutes)" fill="var(--color-time)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Detailed statistics will be available once this user completes the quiz.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPerformance;
