// chartExport.ts
import { supabase } from '@/integrations/supabase/client';
import { quizQuestions } from '@/data/questions';

/**
 * Utility function to export a chart as an image
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

/**
 * Utility function to export any HTML element as an image
 */
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
        exportCanvas.width = canvas.width + 40;
        exportCanvas.height = canvas.height + 40;
        
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        ctx.drawImage(canvas, 20, 20);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(filename, exportCanvas.width / 2, canvas.height + 30);
        
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

/**
 * Generate and download a certificate for a user
 */
export const generateCertificate = async (
  userName: string,
  score: number,
  userId: string
) => {
  try {
    // Check for existing certificate
    const { data: existingData } = await supabase
      .from('quiz_results')
      .select('certificate_id')
      .eq('user_id', userId)
      .single();

    let certificateId: string;

    if (existingData?.certificate_id) {
      certificateId = existingData.certificate_id;
    } else {
      // Get next certificate number
      const { data: maxCertData } = await supabase
        .from('quiz_results')
        .select('certificate_id')
        .not('certificate_id', 'is', null)
        .order('certificate_id', { ascending: false })
        .limit(1);

      const nextNumber = maxCertData?.length
        ? parseInt(maxCertData[0].certificate_id?.replace('BBCCQ', '') || '0') + 1
        : 1;

      certificateId = `BBCCQ${nextNumber.toString().padStart(2, '0')}`;

      // Update record with certificate ID
      await supabase
        .from('quiz_results')
        .update({ certificate_id: certificateId })
        .eq('user_id', userId);
    }

    // Generate certificate image
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
          `Certificate ID: ${certificateId}   Verify At: https://bound-by-code-quiz.lovable.app/verify-certificate`, 
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
    if (!/^BBCCQ\d{2}$/.test(certificateId)) {
      return { 
        isValid: false, 
        error: 'Invalid certificate format',
        errorDetails: 'Please enter a valid certificate ID in the format BBCCQ##.'
      };
    }

    const { data: resultData, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('certificate_id', certificateId)
      .single();

    if (error || !resultData) {
      return { 
        isValid: false, 
        error: 'Certificate not found',
        errorDetails: 'This certificate ID does not exist in our records.'
      };
    }

    const score = resultData.score || 0;
    const percentage = Math.round((score / quizQuestions.length) * 100);

    if (percentage < 50) {
      return { 
        isValid: false, 
        error: 'Invalid certificate',
        errorDetails: 'This certificate is not valid as the user did not achieve the minimum passing score.'
      };
    }

    return {
      isValid: true,
      name: resultData.name,
      email: resultData.email,
      score,
      percentage,
      date: resultData.created_at ? new Date(resultData.created_at).toLocaleDateString() : 'Unknown',
      registerNumber: resultData.register_number,
      studentClass: resultData.class,
      certificateId: resultData.certificate_id
    };
  } catch (error) {
    console.error('Verification error:', error);
    return { 
      isValid: false, 
      error: 'Verification failed',
      errorDetails: 'An unexpected error occurred during verification.'
    };
  }
};
