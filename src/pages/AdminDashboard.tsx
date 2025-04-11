
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { quizQuestions } from '@/data/questions';
import { Download, Users, Search, User, BarChart4 } from 'lucide-react';

const AdminDashboard = () => {
  const { allUsers } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  // Static admin password (in a real app, this would be authenticated properly)
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Score',
      'Completed',
      'Percentage'
    ];
    
    const csvRows = allUsers.map(user => {
      const percentage = user.score 
        ? Math.round(user.score * 100 / quizQuestions.length) 
        : 0;
        
      return [
        user.name,
        user.email,
        user.phone,
        user.score || 0,
        user.completed ? 'Yes' : 'No',
        `${percentage}%`
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz_results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-violet-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-violet-700">Admin Login</CardTitle>
              <CardDescription>
                Enter the admin password to access the dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-violet-700 hover:bg-violet-800"
                >
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completedCount = allUsers.filter(user => user.completed).length;
  const averageScore = allUsers.length > 0
    ? allUsers.reduce((sum, user) => sum + (user.score || 0), 0) / allUsers.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-800 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-violet-600 mr-2" />
                <span className="text-2xl font-bold">{allUsers.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart4 className="h-6 w-6 text-violet-600 mr-2" />
                <span className="text-2xl font-bold">{completedCount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-6 w-6 text-violet-600 mr-2" />
                <span className="text-2xl font-bold">{averageScore.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg border-violet-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-violet-700">User Data</CardTitle>
              <Button onClick={handleExportCSV} variant="outline" className="flex items-center">
                <Download size={16} className="mr-2" /> Export CSV
              </Button>
            </div>
            
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <UserTable 
                    users={filteredUsers} 
                    sortBy="score"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="overflow-x-auto">
                  <UserTable 
                    users={filteredUsers.filter(user => user.completed)} 
                    sortBy="score"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="overflow-x-auto">
                  <UserTable 
                    users={filteredUsers.filter(user => !user.completed)} 
                    sortBy="name"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface UserTableProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    score?: number;
    completed?: boolean;
  }>;
  sortBy: 'name' | 'score';
}

const UserTable = ({ users, sortBy }: UserTableProps) => {
  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'score') {
      return (b.score || 0) - (a.score || 0);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  if (users.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No users found</p>;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-violet-200">
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-right">Score</th>
          <th className="p-3 text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.map(user => {
          const percentage = user.score 
            ? Math.round(user.score * 100 / quizQuestions.length) 
            : 0;
            
          return (
            <tr key={user.id} className="border-b border-violet-100 hover:bg-violet-50 transition-colors">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3 text-right">
                {user.completed 
                  ? `${user.score}/${quizQuestions.length} (${percentage}%)`
                  : '-'
                }
              </td>
              <td className="p-3 text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.completed ? 'Completed' : 'Pending'}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AdminDashboard;
