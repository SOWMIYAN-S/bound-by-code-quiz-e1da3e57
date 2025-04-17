/**/**
 * Utility function to export a chart as an imageUtility function to export a chart as an image
 */
export const exportChartAsImage = (chartId: string, filename: string) => {ort const exportChartAsImage = (chartId: string, filename: string) => {
  try {
    const chartElement = document.querySelector(`[data-chart="${chartId}"]`);st chartElement = document.querySelector(`[data-chart="${chartId}"]`);
    if (!chartElement) {
      console.error('Chart element not found');rt element not found');
      return;
    }
    
    // Use html2canvas to create an image from the chart// Use html2canvas to create an image from the chart
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(chartElement as HTMLElement, {ment, {
        backgroundColor: null,
        scale: 3, // Higher qualityality
        logging: false,
        useCORS: true,
        allowTaint: true,ue,
      }).then(canvas => {
        // Create a square canvas (4:4 ratio)e canvas (4:4 ratio)
        const squareCanvas = document.createElement('canvas');lement('canvas');
        const size = Math.max(canvas.width, canvas.height);
        squareCanvas.width = size;
        squareCanvas.height = size;;
        
        const ctx = squareCanvas.getContext('2d');const ctx = squareCanvas.getContext('2d');
        if (!ctx) return;
        
        // Fill with white background// Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size); size);
        
        // Center the original canvas on the square canvas// Center the original canvas on the square canvas
        const xOffset = Math.max(0, (size - canvas.width) / 2);/ 2);
        const yOffset = Math.max(0, (size - canvas.height) / 2);;
        
        // Draw with proper positioning// Draw with proper positioning
        ctx.drawImage(canvas, xOffset, yOffset);yOffset);
        
        // Convert to image and download// Convert to image and download
        const link = document.createElement('a');ent('a');
        link.download = `${filename}.png`;
        link.href = squareCanvas.toDataURL('image/png');('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);.removeChild(link);
      });
    });
  } catch (error) {ch (error) {
    console.error('Failed to export chart:', error);Failed to export chart:', error);
  }
};

/**/**
 * Utility function to export any HTML element as an imageUtility function to export any HTML element as an image
 */
export const exportElementAsImage = (elementSelector: string, filename: string) => {ort const exportElementAsImage = (elementSelector: string, filename: string) => {
  try {
    const element = document.querySelector(elementSelector);st element = document.querySelector(elementSelector);
    if (!element) {
      console.error('Element not found');('Element not found');
      return;
    }
    
    // Use html2canvas to create an image from the element// Use html2canvas to create an image from the element
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(element as HTMLElement, { {
        backgroundColor: 'white',
        scale: 3, // Higher qualityty
        logging: false,
        useCORS: true,
        allowTaint: true,ue,
      }).then(canvas => {
        // Create a proper aspect ratio for the imager aspect ratio for the image
        const exportCanvas = document.createElement('canvas');canvas');
        const width = canvas.width;
        const height = canvas.height;t;
        
        // Set canvas size with padding// Set canvas size with padding
        exportCanvas.width = width + 40;;
        exportCanvas.height = height + 40;0;
        
        const ctx = exportCanvas.getContext('2d');const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;
        
        // Fill with white background// Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);tCanvas.width, exportCanvas.height);
        
        // Draw with proper positioning (centered with padding)// Draw with proper positioning (centered with padding)
        ctx.drawImage(canvas, 20, 20);
        
        // Add a caption/title at the bottom// Add a caption/title at the bottom
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';;
        ctx.fillText(filename, exportCanvas.width / 2, height + 30);portCanvas.width / 2, height + 30);
        
        // Convert to image and download// Convert to image and download
        const link = document.createElement('a');ent('a');
        link.download = `${filename}.png`;
        link.href = exportCanvas.toDataURL('image/png');('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);.removeChild(link);
      });
    });
  } catch (error) {ch (error) {
    console.error('Failed to export element:', error);Failed to export element:', error);
  }
};

/**/**
 * Generate and download a certificate for a userGenerate and download a certificate for a user
 */
export const generateCertificate = async (ort const generateCertificate = async (
  userName: string,
  score: number,: number,
  totalQuestions: number,
  userId: string
): Promise<boolean> => {
  try {y {
    // Format the certificate ID with the correct format: BBCCQ20XXrmat: BBCCQ20XX
    const orderNumber = userId.slice(-2).padStart(2, '0'); // Use userId to generate a unique order number userId.slice(-2).padStart(2, '0'); // Use userId to generate a unique order number
    const certificateId = `BBCCQ20${orderNumber}`; = `BBCCQ20${orderNumber}`;

    // Save the certificateId in the databaseId in the database
    const { error: saveError } = await supabaseconst { error: saveError } = await supabase
      .from('quiz_results')
      .update({ certificate_id: certificateId }) certificate_id: certificateId })
      .eq('user_id', userId);

    if (saveError) {f (saveError) {
      console.error('Failed to save certificate ID:', saveError);  console.error('Failed to save certificate ID:', saveError);
      return false;
    }

    const canvas = document.createElement('canvas');ent('canvas');
    const width = 1200;
    const height = 900;
    canvas.width = width;canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');'2d');
    if (!ctx) {if (!ctx) {
      console.error('Could not get 2D context');D context');
      return false;
    }

    // Load the certificate template image Load the certificate template image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src =
      'https://raw.githubusercontent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';ntent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';

    return new Promise((resolve) => {
      img.onload = () => {
        // Draw the certificate templatecate template
        ctx.drawImage(img, 0, 0, width, height);g, 0, 0, width, height);

        // Add participant name
        ctx.font = 'bold 48px Shrikhand, Arial';ikhand, Arial';
        ctx.fillStyle = '#ea384c';
        ctx.textAlign = 'center';
        ctx.fillText(userName, width / 2, 420); ctx.fillText(userName, width / 2, 420);

        // Add certificate ID
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#4f4f4f';  ctx.fillStyle = '#4f4f4f';
        ctx.fillText(
          `Certificate ID: ${certificateId}   Verify At: https://bound-by-code-quiz.lovable.app/verify-certificate`,rify At: https://bound-by-code-quiz.lovable.app/verify-certificate`,
          width / 2,
          height - 20
        );

        // Convert to image and download  // Convert to image and download
        const dataURL = canvas.toDataURL('image/png');RL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${userName.replace(/\s+/g, '_')}_Certificate.png`;{userName.replace(/\s+/g, '_')}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);dy.removeChild(link);

        resolve(true);  resolve(true);
      };  };

      img.onerror = () => {
        console.error('Failed to load certificate template image');    console.error('Failed to load certificate template image');
        resolve(false);false);
      };
    });
  } catch (error) { {
    console.error('Failed to generate certificate:', error); console.error('Failed to generate certificate:', error);
    return false;  return false;
  }  }


};};
