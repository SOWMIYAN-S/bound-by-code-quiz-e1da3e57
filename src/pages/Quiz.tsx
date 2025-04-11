
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { quizQuestions } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Clock, ArrowRight } from 'lucide-react';

const Quiz = () => {
  const { user, updateUserScore } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Prevent unauthorized access
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isQuizComplete) {
      finishQuiz();
    }
  }, [timeLeft, isQuizComplete]);

  // Prevent copy and right-click
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('copy', preventCopy);
    document.addEventListener('contextmenu', preventRightClick);
    
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('contextmenu', preventRightClick);
    };
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizComplete(true);
    
    if (user) {
      updateUserScore(user.id, score, true);
      
      toast({
        title: "Quiz completed!",
        description: `Your score: ${score} out of ${quizQuestions.length}`,
        duration: 5000,
      });
    }
    
    // Navigate to results page after a short delay
    setTimeout(() => {
      navigate('/results');
    }, 1500);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (!user) {
    return null; // Prevent rendering if user is not logged in
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Question {currentQuestion + 1} of {quizQuestions.length}</h2>
            <Progress value={progress} className="h-2 mt-2" />
          </div>
          
          <div className="flex items-center gap-2 bg-violet-100 px-3 py-1 rounded-full">
            <Clock size={18} className="text-violet-700" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <Card className="shadow-md border-violet-100 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-violet-900 no-select no-copy">
              {quizQuestions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-colors no-select no-copy ${
                  selectedOption === index
                    ? 'bg-violet-600 text-white'
                    : 'bg-secondary hover:bg-violet-100'
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <span className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-violet-700 flex items-center justify-center mr-3 font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </span>
              </div>
            ))}
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="ml-auto bg-violet-700 hover:bg-violet-800"
            >
              {currentQuestion < quizQuestions.length - 1 ? (
                <>
                  Next <ArrowRight size={16} className="ml-2" />
                </>
              ) : (
                "Finish Quiz"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
