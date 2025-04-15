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
 */
export const generateCertificate = (userName: string, score: number, totalQuestions: number, certificateId: string) => {
  try {
    // Create a certificate using canvas directly
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }
    
    // Fill background with white first
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Create a simple certificate without depending on external image
    // Draw border
    ctx.strokeStyle = '#8b5cf6'; // Violet color matching theme
    ctx.lineWidth = 15;
    ctx.strokeRect(50, 50, width - 100, height - 100);
    
    // Draw inner border
    ctx.strokeStyle = '#a78bfa'; // Lighter violet
    ctx.lineWidth = 5;
    ctx.strokeRect(80, 80, width - 160, height - 160);
    
    // Add certificate title
    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = '#7c3aed'; // Deep violet
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', width / 2, 200);
    
    // Add subtitle
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#4c1d95'; // Dark violet
    ctx.fillText('Brain Based Quiz Challenge', width / 2, 260);
    
    // Add "This is to certify that" text
    ctx.font = '24px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText('This is to certify that', width / 2, 350);
    
    // Draw line for name
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 460);
    ctx.lineTo(width / 2 + 250, 460);
    ctx.stroke();
    
    // Add participant name centered on the dotted line
    ctx.font = "48px Arial";
    ctx.fillStyle = '#ea384c'; // Red color
    ctx.textAlign = 'center';
    ctx.fillText(userName, width / 2, 450);
    
    // Add completion text
    ctx.font = '24px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`has successfully completed the Brain Based Quiz with a score of`, width / 2, 520);
    
    // Add score
    const percentage = Math.round((score / totalQuestions) * 100);
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#4c1d95';
    ctx.fillText(`${score}/${totalQuestions} (${percentage}%)`, width / 2, 580);
    
    // Add date
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    ctx.font = '24px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`Date: ${formattedDate}`, width / 2, 650);
    
    // Add certificate ID
    ctx.font = '16px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Certificate ID: ${certificateId}`, width / 2, 720);
    
    // Add watermark text
    ctx.font = '12px Arial';
    ctx.fillStyle = '#d1d5db';
    ctx.fillText('Brain Based Quiz Challenge Certificate - Verify at brainquiz.com/verify', width / 2, 815);
    
    // Convert to image and trigger download
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${userName.replace(/\s+/g, '_')}_Certificate.png`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    return false;
  }
};
