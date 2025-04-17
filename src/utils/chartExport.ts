import { supabase } from '@/integrations/supabase/client';
import { quizQuestions } from '@/data/questions';

/**
 * Export a chart as PNG image
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
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        const squareCanvas = document.createElement('canvas');
        const size = Math.max(canvas.width, canvas.height);
        squareCanvas.width = size;
        squareCanvas.height = size;

        const ctx = squareCanvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);

        const xOffset = (size - canvas.width) / 2;
        const yOffset = (size - canvas.height) / 2;
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
 * Export any HTML element as PNG image
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
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
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
 * Generate downloadable certificate
 */
export const generateCertificate = async (
  userName: string,
  score: number,
  userId: string
): Promise<boolean> => {
  try {
    const { data: quizResult, error: fetchError } = await supabase
      .from('quiz_results')
      .select('certificate_id')
      .eq('user_id', userId)
      .single();

    let certificateId: string;

    if (fetchError || !quizResult) {
      const { data: newResult, error: createError } = await supabase
        .from('quiz_results')
        .upsert({
          user_id: userId,
          name: userName,
          score: score,
          completed: true,
          certificate_id: null,
        })
        .select('certificate_id')
        .single();

      if (createError || !newResult?.certificate_id) {
        throw createError || new Error('Certificate ID not generated');
      }

      certificateId = newResult.certificate_id;
    } else {
      if (!quizResult.certificate_id) {
        const { data: updatedResult, error: updateError } = await supabase
          .from('quiz_results')
          .update({
            completed: true,
            score: score,
            certificate_id: null,
          })
          .eq('user_id', userId)
          .select('certificate_id')
          .single();

        if (updateError || !updatedResult?.certificate_id) {
          throw updateError || new Error('Certificate ID generation failed');
        }

        certificateId = updatedResult.certificate_id;
      } else {
        certificateId = quizResult.certificate_id;
      }
    }

    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 900;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('2D context not available');
      return false;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src =
      'https://raw.githubusercontent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';

    return new Promise((resolve) => {
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, width, height);

        // Font setup (fallback-safe)
        const fontFace = new FontFace('Shrikhand', 'url(https://fonts.gstatic.com/s/shrikhand/v14/a8IbNovtLWfR7T7bMJwrGg.woff2)');
        await fontFace.load();
        document.fonts.add(fontFace);

        await new Promise(res => setTimeout(res, 100)); // give time for font render

        ctx.font = 'bold 48px "Shrikhand", Arial';
        ctx.fillStyle = '#ea384c';
        ctx.textAlign = 'center';

        let fontSize = 48;
        const nameWidth = ctx.measureText(userName).width;
        if (nameWidth > 500) {
          fontSize = Math.floor((500 * fontSize) / nameWidth);
          ctx.font = `bold ${fontSize}px "Shrikhand", Arial`;
        }

        ctx.fillText(userName, width / 2, 420);

        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#4f4f4f';
        ctx.fillText(
          `Certificate ID: ${certificateId}   Verify At: https://bound-by-code-quiz.lovable.app/verify-certificate`,
          width / 2,
          height - 20
        );

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${userName.replace(/\s+/g, '_')}_Certificate.png`;

        // Fallback mechanism for download
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 1000);

        resolve(true);
      };

      img.onerror = () => {
        console.error('Certificate template image load failed.');
        resolve(false);
      };
    });
  } catch (err) {
    console.error('Certificate generation error:', err);
    return false;
  }
};

/**
 * Certificate verification from database
 */
export const verifyCertificate = async (certificateId: string) => {
  try {
    if (!/^BBCCQ20\d{2}$/.test(certificateId)) {
      return {
        isValid: false,
        error: 'Invalid format',
        errorDetails: 'Format should be BBCCQ20##',
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
        error: 'Invalid certificate',
        errorDetails: 'Certificate not found.',
      };
    }

    const percentage = Math.round((resultData.score / quizQuestions.length) * 100);
    if (percentage < 50) {
      return {
        isValid: false,
        error: 'Failed attempt',
        errorDetails: 'Score below passing threshold.',
      };
    }

    return {
      isValid: true,
      name: resultData.name,
      email: resultData.email,
      score: resultData.score,
      percentage,
      date: resultData.created_at
        ? new Date(resultData.created_at).toLocaleDateString()
        : 'Unknown',
      registerNumber: resultData.register_number,
      studentClass: resultData.class,
      certificateId: resultData.certificate_id,
    };
  } catch (err) {
    console.error('Verification error:', err);
    return {
      isValid: false,
      error: 'Error',
      errorDetails: 'Something went wrong.',
    };
  }
};
