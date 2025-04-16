import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
  registerNumber?: string;
  studentClass?: string;
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
      const certNumber = parseInt(certificateId.substring(7), 10);
      
      const { data: allResults, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('created_at', { ascending: true });

      if (error || !allResults) {
        toast({
          title: 'Database Error',
          description: 'Failed to fetch certificate data.',
          variant: 'destructive',
        });
        setResult(null);
        return;
      }

      if (certNumber < 1 || certNumber > allResults.length) {
        toast({
          title: 'Invalid Certificate',
          description: 'Certificate number out of range.',
          variant: 'destructive',
        });
        setResult({ isValid: false });
        return;
      }

      const data = allResults[certNumber - 1];
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
        registerNumber: data.register_number,
        studentClass: data.class,
      });

      toast({
        title: 'Certificate Verified',
        description: 'This certificate is valid and authentic.',
      });
    } catch (error) {
      console.error('Error in certificate verification:', error);
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
                      {result.registerNumber && <div><span className="font-medium">Register Number:</span> {result.registerNumber}</div>}
                      {result.studentClass && <div><span className="font-medium">Class:</span> {result.studentClass}</div>}
                      <div><span className="font-medium">Email:</span> {result.email}</div>
                      <div><span className="font-medium">Score:</span> {result.score} / {quizQuestions.length} ({result.percentage}%)</div>
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

/**
 * Utility functions for certificate generation and export
 */
export const exportChartAsImage = (chartId: string, filename: string) => {
  try {
    const chartElement = document.querySelector(`[data-chart="${chartId}"]`);
    if (!chartElement) {
      console.error('Chart element not found');
      return;
    }
    
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(chartElement as HTMLElement, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        const squareCanvas = document.createElement('canvas');
        const size = Math.max(canvas.width, canvas.height);
        squareCanvas.width = size;
        squareCanvas.height = size;
        
        const ctx = squareCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        
        const xOffset = Math.max(0, (size - canvas.width) / 2);
        const yOffset = Math.max(0, (size - canvas.height) / 2);
        ctx.drawImage(canvas, xOffset, yOffset);
        
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = squareCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  } catch (error) {
    console.error('Failed to export chart:', error);
  }
};

export const exportElementAsImage = (elementSelector: string, filename: string) => {
  try {
    const element = document.querySelector(elementSelector);
    if (!element) {
      console.error('Element not found');
      return;
    }
    
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(element as HTMLElement, {
        backgroundColor: 'white',
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        const exportCanvas = document.createElement('canvas');
        const width = canvas.width;
        const height = canvas.height;
        
        exportCanvas.width = width + 40;
        exportCanvas.height = height + 40;
        
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        ctx.drawImage(canvas, 20, 20);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(filename, exportCanvas.width / 2, height + 30);
        
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  } catch (error) {
    console.error('Failed to export element:', error);
  }
};

export const generateCertificate = async (
  userName: string,
  score: number,
  totalQuestions: number,
  userId: string
) => {
  try {
    // First get the user's position in ordered results
    const { data: allResults, error } = await supabase
      .from('quiz_results')
      .select('id')
      .order('created_at', { ascending: true });

    if (error || !allResults) {
      console.error('Error fetching ordered results:', error);
      return false;
    }

    const registrationOrder = allResults.findIndex(r => r.id === userId) + 1;
    const orderNumber = registrationOrder.toString().padStart(2, '0');
    const certificateId = `BBCCQ20${orderNumber}`;
    
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return false;
    }
    
    // Preload font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.cdnfonts.com/css/lemon-milk';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    return new Promise<boolean>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        
        ctx.font = "bold 48px Shrikhand, Arial";
        ctx.fillStyle = '#ea384c';
        ctx.textAlign = 'center';
        
        const nameWidth = ctx.measureText(userName).width;
        const maxWidth = 500;
        let fontSize = 48;
        
        if (nameWidth > maxWidth) {
          fontSize = Math.floor((maxWidth * fontSize) / nameWidth);
          ctx.font = `bold ${fontSize}px Shrikhand, Arial`;
        }
        
        ctx.fillText(userName, width / 2, 420);
        
        ctx.font = 'bold 16px "Shrikhand", Arial';
        ctx.fillStyle = '#4f4f4f';
        ctx.fillText(
          `Certificate ID: ${certificateId}   Verify At : https://bound-by-code-quiz.lovable.app/verify-certificate`, 
          width / 2, 
          height - 20
        );
        
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${userName.replace(/\s+/g, '_')}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        resolve(true);
      };
      
      img.src = 'https://raw.githubusercontent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';
    });
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    return false;
  }
};
