
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
      }).then(canvas => {
        // Create a square canvas (4:4 ratio)
        const squareCanvas = document.createElement('canvas');
        const size = Math.max(canvas.width, canvas.height);
        squareCanvas.width = size;
        squareCanvas.height = size;
        
        const ctx = squareCanvas.getContext('2d');
        if (!ctx) return;
        
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        
        // Center the original canvas on the square canvas
        const xOffset = Math.max(0, (size - canvas.width) / 2);
        const yOffset = Math.max(0, (size - canvas.height) / 2);
        
        // Draw with proper positioning
        ctx.drawImage(canvas, xOffset, yOffset);
        
        // Convert to image and download
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
 * @returns A promise that resolves to true if successful, false otherwise
 */
export const generateCertificate = async (userName: string, score: number, totalQuestions: number, registrationOrder: number) => {
  try {
    // Format the certificate ID with the correct format: BBCCQ20XX
    const orderNumber = registrationOrder.toString().padStart(2, '0');
    const certificateId = `BBCCQ20${orderNumber}`;
    
    console.log(`Generating certificate with ID: ${certificateId} for user: ${userName}`);
    
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
    
    // Load LEMONMILK font
    const lemonMilkFontUrl = 'https://fonts.cdnfonts.com/css/lemon-milk';
    const fontStylesheet = document.createElement('link');
    fontStylesheet.rel = 'stylesheet';
    fontStylesheet.href = lemonMilkFontUrl;
    document.head.appendChild(fontStylesheet);
    
    // Create a new image object
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    // Create a Promise to handle the image loading
    return new Promise<boolean>((resolve) => {
      // Set up the image load handler
      img.onload = () => {
        // Draw the certificate image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Add participant name using Shrikhand font
        ctx.font = "bold 48px Shrikhand, Arial";
        ctx.fillStyle = '#ea384c';
        ctx.textAlign = 'center';
        
        // Calculate text width to ensure it fits
        const nameWidth = ctx.measureText(userName).width;
        const maxWidth = 500;
        let fontSize = 48;
        
        // Adjust font size if name is too long
        if (nameWidth > maxWidth) {
          fontSize = Math.floor((maxWidth * fontSize) / nameWidth);
          ctx.font = `bold ${fontSize}px Shrikhand, Arial`;
        }
        
        // Position the name higher up (above the line)
        ctx.fillText(userName, width / 2, 420);
        
        // Add certificate ID using Shrikhand font
        ctx.font = 'bold 16px "Shrikhand", Arial';
        ctx.fillStyle = '#4f4f4f';
        // Position the certificate ID just above the bottom of the certificate
        ctx.fillText(`Certificate ID: ${certificateId}, width / 2, height - 20);
        
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
      
      // Handle image errors
      img.onerror = () => {
        console.error('Failed to load certificate template image');
        resolve(false);
      };
      
      // Set the image source - this will trigger the load event
      img.src = 'https://raw.githubusercontent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';
    });
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    return false;
  }
};
