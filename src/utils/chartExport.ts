
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
        scale: 2, // Better quality
        logging: false,
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
        const xOffset = (size - canvas.width) / 2;
        const yOffset = (size - canvas.height) / 2;
        ctx.drawImage(canvas, xOffset, yOffset);
        
        // Convert to image and download
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = squareCanvas.toDataURL('image/png');
        link.click();
      });
    });
  } catch (error) {
    console.error('Failed to export chart:', error);
  }
};
