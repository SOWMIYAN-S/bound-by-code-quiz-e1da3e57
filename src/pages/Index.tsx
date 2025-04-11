
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { BookOpen, Users, Shield, BrainCircuit } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-violet-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-violet-900">
                Code Quest Season 2
              </h1>
              <p className="text-xl mb-8 text-violet-700">
                Test your coding knowledge and challenge yourself with our interactive quiz
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  className="bg-violet-700 hover:bg-violet-800 px-8 py-6 text-lg"
                  onClick={() => navigate(user ? '/quiz' : '/register')}
                >
                  {user ? 'Continue Quiz' : 'Start Quiz'}
                </Button>
                
                {user && (
                  <Button 
                    variant="outline" 
                    className="px-8 py-6 text-lg"
                    onClick={() => navigate('/leaderboard')}
                  >
                    View Leaderboard
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-violet-800">
              About The Challenge
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-violet-100">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-violet-700" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Test Your Knowledge</h3>
                  <p className="text-gray-600">
                    Challenge yourself with a variety of coding questions spanning multiple topics
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-violet-100">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-violet-700" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Compete with Others</h3>
                  <p className="text-gray-600">
                    See how you rank against other participants on our leaderboard
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-violet-100">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                      <Shield className="h-8 w-8 text-violet-700" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Secure Platform</h3>
                  <p className="text-gray-600">
                    Our platform ensures fair competition with anti-cheating measures
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-violet-100">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                      <BrainCircuit className="h-8 w-8 text-violet-700" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Learn & Improve</h3>
                  <p className="text-gray-600">
                    Enhance your coding skills through practical challenges and feedback
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-violet-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-violet-900">
                Ready to Test Your Skills?
              </h2>
              <p className="text-lg mb-8 text-violet-700">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
