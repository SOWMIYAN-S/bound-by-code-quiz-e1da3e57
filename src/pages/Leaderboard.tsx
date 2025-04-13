
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '@/data/questions';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/context/ThemeContext';

const Leaderboard = () => {
  const { allUsers } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState(allUsers);
  const { theme } = useTheme();
  
  // Fetch leaderboard data directly from Supabase
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('completed', true)
          .order('score', { ascending: false });
        
        if (error) {
          console.error('Error fetching leaderboard:', error);
        } else if (data) {
          setLeaderboardData(data);
        }
      } catch (error) {
        console.error('Error in fetchLeaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, []);
  
  // Sort users by score (descending)
  const sortedUsers = [...leaderboardData]
    .filter(user => user.completed)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className={`${theme === 'dark' ? 'card-enhanced-dark' : 'card-enhanced'}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Trophy size={40} className={`${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
            </div>
            <CardTitle className={`text-2xl sm:text-3xl font-bold font-heading ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`}>
              Leaderboard
            </CardTitle>
            <CardDescription className="text-base">
              Top performers in the Code Quest challenge
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading leaderboard data...</p>
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed quizzes yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-violet-200'}`}>
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
                          className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/30' : 'border-violet-100 hover:bg-violet-50'} transition-colors ${
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
