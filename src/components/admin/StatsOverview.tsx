
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line,
  CartesianGrid, Tooltip, AreaChart, Area
} from "recharts";
import { quizQuestions } from "@/data/questions";
import { exportChartAsImage } from "@/utils/chartExport";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: number;
  completed?: boolean;
}

interface StatsOverviewProps {
  users: User[];
}

const StatsOverview = ({ users }: StatsOverviewProps) => {
  // Calculate score distribution
  const scoreDistribution = calculateScoreDistribution(users);
  
  // Calculate completion stats
  const completionData = [
    { name: "Completed", value: users.filter(user => user.completed).length },
    { name: "Pending", value: users.filter(user => !user.completed).length }
  ];
  
  // Calculate average score per question (simulated)
  const questionPerformance = generateQuestionPerformanceData(quizQuestions.length);
  
  // Calculate registrations over time (simulated)
  const registrationTrend = [
    { date: 'Apr 1', count: 12 },
    { date: 'Apr 5', count: 19 },
    { date: 'Apr 10', count: 31 },
    { date: 'Apr 15', count: 38 },
    { date: 'Apr 20', count: 52 },
    { date: 'Apr 25', count: 61 },
    { date: 'Apr 30', count: 68 }
  ];
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  const COMPLETION_COLORS = ['#4ade80', '#fbbf24'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            id="score-distribution"
            config={{
              score: { theme: { light: "#8884d8", dark: "#8884d8" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="range" 
                  label={{ value: "Score Range", position: "bottom", offset: 0, fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: "Number of Users", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Score: ${value}`}
                    />
                  }
                />
                <Bar dataKey="count" name="Users" fill="var(--color-score)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportChartAsImage("score-distribution", "score-distribution")}
            className="flex items-center gap-1"
          >
            <Download size={14} /> Export
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quiz Completion Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            id="completion-status"
            config={{
              completed: { theme: { light: "#4ade80", dark: "#4ade80" } },
              pending: { theme: { light: "#fbbf24", dark: "#fbbf24" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPLETION_COLORS[index % COMPLETION_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip formatter={(value) => [`${value} users`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportChartAsImage("completion-status", "completion-status")}
            className="flex items-center gap-1"
          >
            <Download size={14} /> Export
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Average Score Per Question</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            id="avg-score-per-question"
            config={{
              avgScore: { theme: { light: "#6366f1", dark: "#818cf8" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={questionPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="question" 
                  label={{ value: "Question Number", position: "bottom", offset: 0, fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  label={{ value: "Average Score (%)", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  name="Avg. Score (%)" 
                  stroke="var(--color-avgScore)" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportChartAsImage("avg-score-per-question", "avg-score-per-question")}
            className="flex items-center gap-1"
          >
            <Download size={14} /> Export
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Registration Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            id="registration-trend"
            config={{
              registrations: { theme: { light: "#8b5cf6", dark: "#a78bfa" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={registrationTrend}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  label={{ value: "Date", position: "bottom", offset: 0, fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: "Number of Registrations", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Registrations" 
                  stroke="var(--color-registrations)" 
                  fill="var(--color-registrations)" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportChartAsImage("registration-trend", "registration-trend")}
            className="flex items-center gap-1"
          >
            <Download size={14} /> Export
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Helper function to calculate score distribution
function calculateScoreDistribution(users: User[]) {
  const maxScore = quizQuestions.length;
  const completedUsers = users.filter(user => user.completed && user.score !== undefined);
  
  // Create distribution ranges
  const ranges = 5; // 0-20%, 21-40%, etc.
  const distribution = Array(ranges).fill(0).map((_, i) => ({
    range: `${i * (100/ranges) + 1}-${(i + 1) * (100/ranges)}%`,
    count: 0
  }));
  
  // Calculate percentage and increment appropriate range
  completedUsers.forEach(user => {
    if (user.score !== undefined) {
      const percentage = (user.score / maxScore) * 100;
      const rangeIndex = Math.min(Math.floor(percentage / (100/ranges)), ranges - 1);
      distribution[rangeIndex].count++;
    }
  });
  
  return distribution;
}

// Helper function to generate simulated question performance data
function generateQuestionPerformanceData(questionsCount: number) {
  return Array(questionsCount).fill(0).map((_, i) => ({
    question: `Q${i + 1}`,
    averageScore: Math.floor(40 + Math.random() * 50) // Random score between 40-90%
  }));
}

export default StatsOverview;
