import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { quizQuestions } from '@/data/questions';
import { useTheme } from '@/context/ThemeContext';

interface VerificationResult {
  isValid: boolean;
  name?: string;
  email?: string;
  score?: number;
  percentage?: number;
  date?: string;
  register_number?: string;
  class?: string;
  correct_answers?: number;
  attended_questions?: number;
}

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleCertificateIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateId(e.target.value);
  };

  const verifyCertificate = async () => {
    if (!/^BBCCQ20\d{2}$/.test(certificateId)) {
      toast({
        title: 'Invalid Certificate ID',
        description: 'Please enter a valid certificate ID in the format BBCCQ20##.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const certPrefix = certificateId.substring(0, 7); // 'BBCCQ20'
      const certIdPart = certificateId.substring(7);    // '01'
      const userId = parseInt(certIdPart);              // convert '01' to 1

      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error.message);
        toast({
          title: 'Error',
          description: 'Verification failed due to database error',
          variant: 'destructive',
        });
        setResult(null);
        return;
      }

      if (!data) {
        console.log('No data found for ID:', userId);
        toast({
          title: 'Invalid Certificate',
          description: 'This certificate could not be verified. It may be invalid or no longer exist.',
          variant: 'destructive',
        });
        setResult({ isValid: false });
        return;
      }

      const score = data.score || 0;
      const totalQuestions = quizQuestions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      if (percentage < 50) {
        toast({
          title: 'Invalid Certificate',
          description: 'This certificate is not valid as the user did not achieve the minimum passing score.',
          variant: 'destructive',
        });
        setResult({ isValid: false });
        return;
      }

      setResult({
        isValid: true,
        name: data.name,
        email: data.email,
        score,
        percentage,
        date: data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Unknown',
        register_number: data.register_number,
        class: data.class,
        correct_answers: data.correct_answers,
        attended_questions: data.attended_questions,
      });

      toast({
        title: 'Certificate Verified',
        description: 'This certificate is valid and authentic.',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during verification. Please try again.',
        variant: 'destructive',
      });
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className={`${theme === 'dark' ? 'card-enhanced-dark' : 'card-enhanced'}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Check size={40} className={`${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
            </div>
            <CardTitle className={`text-2xl sm:text-3xl font-bold font-heading ${theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}`}>
              Verify Certificate
            </CardTitle>
            <CardDescription className="text-base">
              Enter the certificate ID to verify its authenticity
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="certificate-id" className="block text-sm font-medium">
                Certificate ID
              </label>
              <Input
                id="certificate-id"
                placeholder="e.g. BBCCQ2001"
                value={certificateId}
                onChange={handleCertificateIdChange}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                The certificate ID can be found at the bottom of the certificate.
              </p>
            </div>

            {result && (
              <div className={`border p-4 rounded-md ${result.isValid ? 'border-green-400' : 'border-red-400'}`}>
                {result.isValid ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check size={20} />
                      <h3 className="font-medium">Valid Certificate</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div><span className="font-medium">Name:</span> {result.name}</div>
                      {result.register_number && <div><span className="font-medium">Register Number:</span> {result.register_number}</div>}
                      {result.class && <div><span className="font-medium">Class:</span> {result.class}</div>}
                      <div><span className="font-medium">Email:</span> {result.email}</div>
                      <div><span className="font-medium">Score:</span> {result.score} / {quizQuestions.length} ({result.percentage}%)</div>
                      {result.correct_answers && <div><span className="font-medium">Correct Answers:</span> {result.correct_answers}</div>}
                      {result.attended_questions && <div><span className="font-medium">Attended Questions:</span> {result.attended_questions}</div>}
                      <div><span className="font-medium">Issue Date:</span> {result.date}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle size={20} />
                    <h3 className="font-medium">Invalid Certificate</h3>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
              <ArrowLeft size={16} className="mr-2" /> Go Back
            </Button>
            <Button
              onClick={verifyCertificate}
              disabled={loading}
              className={`w-full sm:w-auto ${theme === 'dark' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-700 hover:bg-violet-800'}`}
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/certificate')} className="text-sm">
            Download your certificate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
