// chartExport.ts
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the registration order for certificate ID generation
 */
const getRegistrationOrder = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('created_at')
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching registration order:', error);
    return 0;
  }

  const userIndex = data.findIndex(item => item.created_at === userId);
  return userIndex >= 0 ? userIndex + 1 : 0;
};

/**
 * Generate and download a certificate for a user
 */
export const generateCertificate = async (
  userName: string,
  score: number,
  totalQuestions: number,
  userId: string
) => {
  try {
    const registrationOrder = await getRegistrationOrder(userId);
    if (registrationOrder === 0) {
      console.error('User not found in ordered results');
      return false;
    }

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
      
      img.onerror = () => {
        console.error('Failed to load certificate template');
        resolve(false);
      };
      
      img.src = 'https://raw.githubusercontent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';
    });
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    return false;
  }
};

/**
 * Verify certificate against database records
 */
export const verifyCertificate = async (certificateId: string) => {
  try {
    if (!/^BBCCQ20\d{2}$/.test(certificateId)) {
      return { isValid: false, error: 'Invalid certificate format' };
    }

    const certNumber = parseInt(certificateId.substring(7), 10);
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      return { isValid: false, error: 'Database error' };
    }

    if (certNumber < 1 || certNumber > data.length) {
      return { isValid: false, error: 'Certificate number out of range' };
    }

    const userData = data[certNumber - 1];
    const score = userData.score || 0;
    const percentage = Math.round((score / quizQuestions.length) * 100);

    return {
      isValid: percentage >= 50,
      userData,
      percentage,
      date: userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Unknown'
    };
  } catch (error) {
    console.error('Verification error:', error);
    return { isValid: false, error: 'Verification failed' };
  }
};

// Keep the existing export functions
export { exportChartAsImage, exportElementAsImage };
