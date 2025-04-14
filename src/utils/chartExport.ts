
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
