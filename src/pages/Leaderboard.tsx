
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '@/data/questions';

const Leaderboard = () => {
  const { allUsers } = useUser();
  const navigate = useNavigate();
  
  // Sort users by score (descending)
  const sortedUsers = [...allUsers]
    .filter(user => user.completed)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-violet-100">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Trophy size={40} className="text-violet-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-violet-700">Leaderboard</CardTitle>
            <CardDescription>
              Top performers in the Code Quest challenge
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {sortedUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed quizzes yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-violet-200">
                      <th className="p-3 text-left">Rank</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-right">Score</th>
                      <th className="p-3 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user, index) => {
                      const percentage = Math.round((user.score || 0) * 100 / quizQuestions.length);
                      
                      return (
                        <tr 
                          key={user.id} 
                          className={`border-b border-violet-100 hover:bg-violet-50 transition-colors ${
                            index < 3 ? 'font-medium' : ''
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {index === 0 ? (
                                <Trophy size={20} className="text-yellow-500" />
                              ) : index === 1 ? (
                                <Medal size={20} className="text-gray-400" />
                              ) : index === 2 ? (
                                <Award size={20} className="text-amber-700" />
                              ) : (
                                <span className="w-5 text-center">{index + 1}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">{user.name}</td>
                          <td className="p-3 text-right">{user.score} / {quizQuestions.length}</td>
                          <td className="p-3 text-right">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" /> Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
