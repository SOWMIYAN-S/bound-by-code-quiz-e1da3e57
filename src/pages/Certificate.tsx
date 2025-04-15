
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { quizQuestions } from '@/data/questions';
import { useTheme } from '@/context/ThemeContext';
import { generateCertificate } from '@/utils/chartExport';
import { useUser } from '@/context/UserContext';

const Certificate = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useUser();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const checkEligibilityAndDownload = async () => {
    // If user is logged in, use their email automatically
    const emailToCheck = user?.email || email;
    
    if (!emailToCheck.trim() || !emailToCheck.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Show checking eligibility toast
      toast({
        title: 'Checking Eligibility',
        description: 'Verifying your quiz results...',
      });

      // Try to get the data from the user context first if available
      if (user && user.email === emailToCheck && user.score !== undefined) {
        // User already has score data in context
        const score = user.score;
        const totalQuestions = quizQuestions.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        
        if (percentage < 50) {
          toast({
            title: 'Not Eligible',
            description: `Your score (${percentage}%) is below the required 50% passing score. Please retake the quiz to improve your score.`,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        // Generate certificate using data from context
        generateCertificateForUser(user.name, score, totalQuestions, user.id);
        return;
      }

      // If not available in context, query the database
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('email', emailToCheck)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user data:', error);
        
        // Special handling for permission errors
        if (error.code === '18' || error.code === '42501' || error.message.includes('permission') || error.message.includes('denied')) {
          toast({
            title: 'Access Restricted',
            description: 'Unable to access quiz data due to permission restrictions. Please try logging in first.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch user data. Please try again.',
            variant: 'destructive',
          });
        }
        setLoading(false);
        return;
      }

      // Handle case where user not found
      if (!data) {
        toast({
          title: 'User Not Found',
          description: 'No records found for this email address. Please register and complete the quiz first.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Calculate percentage
      const score = data.score || 0;
      const totalQuestions = quizQuestions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      // Check if user has passed (score >= 50%)
      if (percentage < 50) {
        toast({
          title: 'Not Eligible',
          description: `Your score (${percentage}%) is below the required 50% passing score. Please retake the quiz to improve your score.`,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Generate certificate
      generateCertificateForUser(data.name, score, totalQuestions, data.id);
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate certificate. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Helper function to generate and handle certificate creation
  const generateCertificateForUser = (name: string, score: number, totalQuestions: number, userId: string) => {
    toast({
      title: 'Generating Certificate',
      description: 'Your certificate is being prepared, please wait...',
    });
    
    // Certificate ID from user ID
    const certificateId = `BBCCQ00${userId.substring(0, 6)}`;
    
    // Add slight delay to ensure UI updates properly before generating certificate
    setTimeout(() => {
      try {
        const success = generateCertificate(name, score, totalQuestions, certificateId);
        
        if (success !== false) {
          toast({
            title: 'Certificate Generated',
            description: 'Your certificate has been successfully generated and is downloading now.',
          });
        } else {
          toast({
            title: 'Generation Error',
            description: 'There was a problem generating your certificate. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (certError) {
        console.error('Certificate generation error:', certError);
        toast({
          title: 'Generation Error',
          description: 'There was a problem generating your certificate. Please try again.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className={`${theme === 'dark' ? 'card-enhanced-dark' : 'card-enhanced'}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <FileCheck size={40} className={`${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
            </div>
            <CardTitle className={`text-2xl sm:text-3xl font-bold font-heading ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`}>
              Certificate Download
            </CardTitle>
            <CardDescription className="text-base">
              {user ? 'Click below to download your quiz certificate' : 'Enter your email to download your quiz certificate'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!user && (
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter the email you used for registration"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  You must have completed the quiz with a score of 50% or higher to be eligible.
                </p>
              </div>
            )}
            
            {user && (
              <div className="text-center py-2">
                <p className="text-sm">
                  Logged in as <span className="font-medium">{user.email}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your certificate will be generated based on your quiz results.
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              <ArrowLeft size={16} className="mr-2" /> Go Back
            </Button>
            
            <Button
              onClick={checkEligibilityAndDownload}
              disabled={loading}
              className={`w-full sm:w-auto ${theme === 'dark' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-700 hover:bg-violet-800'}`}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Download size={16} className="mr-2" /> Download Certificate
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="flex justify-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/verify-certificate')}
            className="text-sm"
          >
            Verify a certificate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
