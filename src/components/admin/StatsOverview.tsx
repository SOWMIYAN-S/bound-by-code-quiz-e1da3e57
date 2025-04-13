
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line,
  CartesianGrid, Tooltip, AreaChart, Area
} from "recharts";
import { quizQuestions } from "@/data/questions";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              score: { theme: { light: "#8884d8", dark: "#8884d8" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quiz Completion Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Average Score Per Question</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              avgScore: { theme: { light: "#6366f1", dark: "#818cf8" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={questionPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis domain={[0, 100]} />
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
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registration Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              registrations: { theme: { light: "#8b5cf6", dark: "#a78bfa" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={registrationTrend}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
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
