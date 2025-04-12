
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
      {/* Hero Section with background image */}
      <section 
        className={`py-16 md:py-24 bg-cover bg-center relative 
          ${theme === 'dark' 
            ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
            : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'}`}
        style={{
          backgroundImage: `linear-gradient(${
            theme === 'dark' 
              ? 'rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9)' 
              : 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)'}), 
              url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-violet-400' : 'text-white'}`}>
                Bound By Code
              </h1>
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-white/90'}`}>
                Test your coding knowledge and challenge yourself with our interactive quiz
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
                    className={`px-8 py-6 text-lg ${theme === 'dark' ? 'border-violet-700 text-violet-400 hover:bg-violet-900/30' : 'text-white border-white/50 hover:bg-white/20'}`}
                    onClick={() => navigate('/leaderboard')}
                  >
                    View Leaderboard
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              {/* Keep this empty to allow the background image to show fully */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with background image */}
      <section 
        className={`py-16 relative 
          ${theme === 'dark' 
            ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
            : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'}`}
        style={{
          backgroundImage: `linear-gradient(${
            theme === 'dark' 
              ? 'rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9)' 
              : 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)'}), 
              url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-violet-400' : 'text-white'}`}>
            About The Challenge
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-violet-100'}`}>
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
            
            <Card className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-violet-100'}`}>
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
            
            <Card className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-violet-100'}`}>
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
            
            <Card className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-violet-100'}`}>
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
      
      {/* CTA Section with background image */}
      <section 
        className={`py-16 relative 
          ${theme === 'dark' 
            ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
            : 'bg-gradient-to-b from-white to-gray-50 text-gray-900'}`}
        style={{
          backgroundImage: `linear-gradient(${
            theme === 'dark' 
              ? 'rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9)' 
              : 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)'}), 
              url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-violet-400' : 'text-white'}`}>
              Ready to Test Your Skills?
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-white/90'}`}>
              Join the Bound By Code challenge and see how you rank against other developers
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
