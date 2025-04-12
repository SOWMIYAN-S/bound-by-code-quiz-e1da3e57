
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { BookOpen, Users, Shield, BrainCircuit, Code, Server, Database, Lock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme } = useTheme();

  return (
    <>
      {/* Hero Section */}
      <section className={`py-16 md:py-24 ${theme === 'dark' ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-violet-50 to-white'}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-900'}`}>
                Code Quest Season 2
              </h1>
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-violet-700'}`}>
                Test your coding knowledge and challenge yourself with our interactive Python quiz
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button 
                  className="bg-violet-700 hover:bg-violet-800 px-8 py-6 text-lg"
                  onClick={() => navigate(user ? '/quiz' : '/register')}
                >
                  {user ? 'Continue Quiz' : 'Start Quiz'}
                </Button>
                
                {user && (
                  <Button 
                    variant="outline" 
                    className={`px-8 py-6 text-lg ${theme === 'dark' ? 'border-violet-700 text-violet-400 hover:bg-violet-900/30' : ''}`}
                    onClick={() => navigate('/leaderboard')}
                  >
                    View Leaderboard
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Programming code on screen" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Tech Images Section */}
      <section className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="Coding on laptop" 
              className="rounded-lg shadow-md h-48 w-full object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="Computer screen with code" 
              className="rounded-lg shadow-md h-48 w-full object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="Tech display" 
              className="rounded-lg shadow-md h-48 w-full object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="Laptop with code" 
              className="rounded-lg shadow-md h-48 w-full object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-800'}`}>
            About The Challenge
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-violet-100'}`}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-violet-100'}`}>
                    <Code className={`h-8 w-8 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`} />
                  </div>
                </div>
                <h3 className={`font-semibold text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Test Your Knowledge</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Challenge yourself with a variety of coding questions spanning multiple topics
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-violet-100'}`}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-violet-100'}`}>
                    <Users className={`h-8 w-8 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`} />
                  </div>
                </div>
                <h3 className={`font-semibold text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Compete with Others</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  See how you rank against other participants on our leaderboard
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-violet-100'}`}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-violet-100'}`}>
                    <Lock className={`h-8 w-8 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`} />
                  </div>
                </div>
                <h3 className={`font-semibold text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Secure Platform</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Our platform ensures fair competition with anti-cheating measures
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-violet-100'}`}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-violet-100'}`}>
                    <BrainCircuit className={`h-8 w-8 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`} />
                  </div>
                </div>
                <h3 className={`font-semibold text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Learn & Improve</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Enhance your coding skills through practical challenges and feedback
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-violet-100'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-900'}`}>
              Ready to Test Your Skills?
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-violet-700'}`}>
              Join the Code Quest challenge and see how you rank against other developers
            </p>
            <Button 
              className="bg-violet-700 hover:bg-violet-800 px-8 py-6 text-lg"
              onClick={() => navigate(user ? '/quiz' : '/register')}
            >
              {user ? 'Continue Quiz' : 'Start Now'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
