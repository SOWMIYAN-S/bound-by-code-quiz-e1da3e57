
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quizQuestions } from '@/data/questions';
import { Award, ArrowLeft, Home, FileCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/context/ThemeContext';

const Results = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userResult, setUserResult] = useState(user);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Redirect if no user
    if (!user) {
      navigate('/');
      return;
    }
    
    async function fetchUserResult() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user result:', error);
        } else if (data) {
          setUserResult(data);
        } else {
          setUserResult(user);
        }
      } catch (error) {
        console.error('Error in fetchUserResult:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserResult();
  }, [user, navigate]);

  if (!user || (!userResult?.score && !loading)) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className={`${theme === 'dark' ? 'card-enhanced-dark' : 'card-enhanced'}`}>
          <CardContent className="py-12">
            <p>Loading your results...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate percentage only when we have a valid score
  const score = userResult?.score || 0;
  const percentage = Math.round((score * 100) / quizQuestions.length);
  const isPassing = percentage >= 50;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className={`${theme === 'dark' ? 'card-enhanced-dark' : 'card-enhanced'}`}>
          <CardHeader className="text-center pb-2">
            <CardTitle className={`text-2xl sm:text-3xl font-bold font-heading ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`}>
              Quiz Results
            </CardTitle>
            <CardDescription className="text-base">
              Great job completing the quiz, {userResult?.name}!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-center">
              <div className={`relative w-36 h-36 flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-violet-900/30' : 'bg-violet-100'}`}>
                <Award size={48} className={`${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={`block text-3xl font-bold ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`}>{percentage}%</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-violet-300' : 'text-violet-600'}`}>Score</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-medium">You scored {score} out of {quizQuestions.length}</h3>
              <p className="text-muted-foreground mt-2">
                {percentage >= 80 
                  ? "Excellent! You've mastered the material." 
                  : percentage >= 60
                    ? "Good work! You've got a solid understanding."
                    : percentage >= 50
                      ? "Congratulations! You've passed the quiz."
                      : "You've completed the quiz. Keep learning and try again!"}
              </p>
              
              {isPassing && (
                <div className="mt-4">
                  <p className="text-green-600 dark:text-green-400">
                    You've qualified for a certificate!
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/quiz')}
                className="flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" /> Retake Quiz
              </Button>
              
              <Button 
                onClick={() => navigate('/leaderboard')}
                className={`${theme === 'dark' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-700 hover:bg-violet-800'}`}
              >
                View Leaderboard
              </Button>
              
              {isPassing && (
                <Button 
                  onClick={() => navigate('/certificate')}
                  variant="outline"
                  className="flex items-center"
                >
                  <FileCheck size={16} className="mr-2" /> Get Certificate
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <Home size={16} className="mr-2" /> Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
