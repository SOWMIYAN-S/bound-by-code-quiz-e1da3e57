
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { quizQuestions } from '@/data/questions';
import { Download, Users, Search, User, BarChart4, Trash2, LineChart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import StatsOverview from '@/components/admin/StatsOverview';
import UserPerformance from '@/components/admin/UserPerformance';

const AdminDashboard = () => {
  const { allUsers, deleteUserResponse } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(allUsers);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    score?: number;
    completed?: boolean;
  } | null>(null);
  
  const ADMIN_PASSWORD = '123123123';

  useEffect(() => {
    async function fetchAllUserData() {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*');
        
        if (error) {
          console.error('Error fetching user data:', error);
        } else if (data) {
          setAdminData(data);
        }
      } catch (error) {
        console.error('Error in fetchAllUserData:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAllUserData();
  }, [isAuthenticated]);

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
    
    const csvRows = adminData.map(user => {
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

  const handleDeleteResponse = async (userId: string, userName: string) => {
    try {
      await deleteUserResponse(userId);
      const { data } = await supabase
        .from('quiz_results')
        .select('*');
      
      if (data) {
        setAdminData(data);
      }
      
      toast({
        title: "Response Deleted",
        description: `${userName}'s quiz response has been reset. They can now retake the quiz.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting response:', error);
      toast({
        title: "Error",
        description: "Failed to delete response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUserSelect = (user: typeof selectedUser) => {
    setSelectedUser(user);
  };

  const filteredUsers = adminData.filter(user => 
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="py-12">
            <p>Loading user data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedCount = adminData.filter(user => user.completed).length;
  const averageScore = adminData.length > 0
    ? adminData.reduce((sum, user) => sum + (user.score || 0), 0) / adminData.length
    : 0;
  const averagePercentage = Math.round((averageScore / quizQuestions.length) * 100);

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
                <span className="text-2xl font-bold">{adminData.length}</span>
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
                <span className="ml-2 text-sm text-muted-foreground">
                  ({adminData.length > 0 ? Math.round((completedCount / adminData.length) * 100) : 0}%)
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <LineChart className="h-6 w-6 text-violet-600 mr-2" />
                <span className="text-2xl font-bold">{averageScore.toFixed(2)}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({averagePercentage}%)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg border-violet-100 mb-6">
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
                    onDeleteResponse={handleDeleteResponse}
                    onUserSelect={handleUserSelect}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="overflow-x-auto">
                  <UserTable 
                    users={filteredUsers.filter(user => user.completed)} 
                    sortBy="score"
                    onDeleteResponse={handleDeleteResponse}
                    onUserSelect={handleUserSelect}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="overflow-x-auto">
                  <UserTable 
                    users={filteredUsers.filter(user => !user.completed)} 
                    sortBy="name"
                    onDeleteResponse={handleDeleteResponse}
                    onUserSelect={handleUserSelect}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Overall Statistics Visualizations */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-violet-800 mb-4">Analytics Overview</h2>
          <StatsOverview users={adminData} />
        </div>
        
        {/* User Performance Card - Placed at the bottom */}
        {selectedUser && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-violet-800 mb-4">User Analysis</h2>
            <UserPerformance 
              user={selectedUser} 
              onClose={() => setSelectedUser(null)} 
            />
          </div>
        )}
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
  onDeleteResponse: (userId: string, userName: string) => void;
  onUserSelect: (user: UserTableProps['users'][0]) => void;
}

const UserTable = ({ users, sortBy, onDeleteResponse, onUserSelect }: UserTableProps) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUsers.map(user => {
          const percentage = user.score !== undefined
            ? Math.round((user.score * 100) / quizQuestions.length)
            : 0;
            
          return (
            <TableRow key={user.id}>
              <TableCell>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-foreground hover:text-violet-600"
                  onClick={() => onUserSelect(user)}
                >
                  {user.name}
                </Button>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell className="text-right">
                {user.completed 
                  ? `${user.score}/${quizQuestions.length} (${percentage}%)`
                  : '-'
                }
              </TableCell>
              <TableCell className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.completed ? 'Completed' : 'Pending'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDeleteResponse(user.id, user.name)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AdminDashboard;
