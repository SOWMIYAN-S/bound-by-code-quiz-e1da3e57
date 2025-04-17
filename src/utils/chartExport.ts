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

    // Use html2canvas to create an image from the chart
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(chartElement as HTMLElement, {
        backgroundColor: null,
        scale: 3, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
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
    
    // Use html2canvas to create an image from the element
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(element as HTMLElement, {
        backgroundColor: 'white',
        scale: 3, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        // Create a proper aspect ratio for the image
        const exportCanvas = document.createElement('canvas');
        const width = canvas.width;
        const height = canvas.height;
        
        // Set canvas size with padding
        exportCanvas.width = width + 40;
        exportCanvas.height = height + 40;
        
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;
        
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // Draw with proper positioning (centered with padding)
        ctx.drawImage(canvas, 20, 20);
        
        // Add a caption/title at the bottom
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(filename, exportCanvas.width / 2, height + 30);
        
        // Convert to image and download
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
  totalQuestions: number,
  userId: string
): Promise<boolean> => {
  try {
    // Format the certificate ID with the correct format: BBCCQ20XX
    const orderNumber = userId.slice(-2).padStart(2, '0'); // Use userId to generate a unique order number
    const certificateId = `BBCCQ20${orderNumber}`;

    // Save the certificateId in the database
    const { error: saveError } = await supabase
      .from('quiz_results')
      .update({ certificate_id: certificateId })
      .eq('user_id', userId);

    if (saveError) {
      console.error('Failed to save certificate ID:', saveError);
      return false;
    }

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

    // Load the certificate template image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src =
      'https://raw.githubusercontent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';

    return new Promise((resolve) => {
      img.onload = () => {
        // Draw the certificate template
        ctx.drawImage(img, 0, 0, width, height);

        // Add participant name
        ctx.font = 'bold 48px Shrikhand, Arial';
        ctx.fillStyle = '#ea384c';
        ctx.textAlign = 'center';
        ctx.fillText(userName, width / 2, 420);

        // Add certificate ID
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#4f4f4f';
        ctx.fillText(
          `Certificate ID: ${certificateId}   Verify At: https://bound-by-code-quiz.lovable.app/verify-certificate`,
          width / 2,
          height - 20
        );

        // Convert to image and download
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
        console.error('Failed to load certificate template image');
        resolve(false);
      };
    });
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    return false;
  }
};
