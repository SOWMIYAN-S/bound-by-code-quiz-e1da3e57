
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
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

export default StatsOverview;
