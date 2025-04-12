
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { quizQuestions } from '@/data/questions';
import { Award, ArrowLeft, Home } from 'lucide-react';

const Results = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if no user or quiz not completed
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.score === undefined) {
    return null;
  }

  // Calculate percentage only when we have a valid score
  const percentage = Math.round((user.score * 100) / quizQuestions.length);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-violet-100">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-violet-700">Quiz Results</CardTitle>
            <CardDescription>
              Great job completing the quiz, {user.name}!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-violet-100">
                <Award size={48} className="text-violet-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-violet-700">{percentage}%</span>
                    <span className="text-sm text-violet-600">Score</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-medium">You scored {user.score} out of {quizQuestions.length}</h3>
              <p className="text-muted-foreground mt-2">
                {percentage >= 80 
                  ? "Excellent! You've mastered the material." 
                  : percentage >= 60
                    ? "Good work! You've got a solid understanding."
                    : "You've completed the quiz. Keep learning and try again!"}
              </p>
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
                className="bg-violet-700 hover:bg-violet-800"
              >
                View Leaderboard
              </Button>
              
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
