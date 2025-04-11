
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { quizQuestions } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Clock, ArrowRight, Filter } from 'lucide-react';
import QuizFilters from '@/components/QuizFilters';
import { useTheme } from '@/context/ThemeContext';

const Quiz = () => {
  const { user, updateUserScore, allUsers } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState(quizQuestions);

  // Check if user has already completed the quiz
  useEffect(() => {
    if (user) {
      const existingUser = allUsers.find(u => u.email === user.email);
      if (existingUser && existingUser.completed) {
        toast({
          title: "Quiz already completed",
          description: "You have already completed this quiz. Redirecting to results page.",
          duration: 3000,
        });
        navigate('/results');
      }
    }
  }, [user, allUsers, navigate, toast]);

  // Filter questions based on selected criteria
  useEffect(() => {
    let filtered = [...quizQuestions];
    
    if (difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(q => q.category === category);
    }
    
    // Ensure we have at least one question
    if (filtered.length === 0) {
      filtered = quizQuestions.slice(0, 10);
      toast({
        title: "No questions match your filters",
        description: "Showing default questions instead",
        duration: 3000,
      });
    }
    
    setFilteredQuestions(filtered);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setTimeLeft(600);
    setIsQuizComplete(false);
  }, [difficulty, category, toast]);

  // Prevent unauthorized access
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
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
    if (selectedOption === filteredQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizComplete(true);
    
    if (user) {
      // Calculate final score including current question if answered correctly
      const finalScore = score + (selectedOption === filteredQuestions[currentQuestion].correctAnswer ? 1 : 0);
      updateUserScore(user.id, finalScore, true);
      
      toast({
        title: "Quiz completed!",
        description: `Your score: ${finalScore} out of ${filteredQuestions.length}`,
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
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;

  if (!user) {
    return null; // Prevent rendering if user is not logged in
  }

  // If no questions match the filter, show a message
  if (filteredQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p>No questions match your selected filters. Please try different criteria.</p>
            <Button onClick={() => {
              setDifficulty('all');
              setCategory('all');
            }}>Reset Filters</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-white' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={`${theme === 'dark' ? 'border-gray-700 text-white' : ''}`}
          >
            <Filter size={16} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-violet-100'
          }`}>
            <Clock size={18} className={theme === 'dark' ? 'text-violet-400' : 'text-violet-700'} />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {showFilters && (
          <Card className={`mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-violet-100'}`}>
            <CardContent className="pt-6">
              <QuizFilters 
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                category={category}
                setCategory={setCategory}
              />
            </CardContent>
          </Card>
        )}
        
        <div className="mb-6">
          <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
            Question {currentQuestion + 1} of {filteredQuestions.length}
          </h2>
          <Progress value={progress} className={`h-2 mt-2 ${
            theme === 'dark' ? 'bg-gray-700' : ''
          }`} />
        </div>
        
        <Card className={`shadow-md mb-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-violet-100'
        }`}>
          <CardHeader>
            <CardTitle className={`text-xl whitespace-pre-line no-select no-copy ${
              theme === 'dark' ? 'text-white' : 'text-violet-900'
            }`}>
              {filteredQuestions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {filteredQuestions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-colors no-select no-copy ${
                  selectedOption === index
                    ? theme === 'dark' 
                      ? 'bg-violet-800 text-white' 
                      : 'bg-violet-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-secondary hover:bg-violet-100'
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <span className="flex items-start">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 font-medium ${
                    theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-violet-700'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="whitespace-pre-line">{option}</span>
                </span>
              </div>
            ))}
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className={`ml-auto ${
                theme === 'dark' 
                  ? 'bg-violet-800 hover:bg-violet-900' 
                  : 'bg-violet-700 hover:bg-violet-800'
              }`}
            >
              {currentQuestion < filteredQuestions.length - 1 ? (
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
