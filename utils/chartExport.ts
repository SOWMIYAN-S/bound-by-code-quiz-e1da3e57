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

/**
 * Generate and download a certificate for a user
 */
export const generateCertificate = async (userName: string, score: number, totalQuestions: number, registrationOrder: number) => {
  try {
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

    // Inject Google Fonts dynamically
    const shrikhandFont = document.createElement('link');
    shrikhandFont.href = 'https://fonts.googleapis.com/css2?family=Shrikhand&display=swap';
    shrikhandFont.rel = 'stylesheet';
    document.head.appendChild(shrikhandFont);

    const beFont = document.createElement('link');
    beFont.href = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&display=swap';
    beFont.rel = 'stylesheet';
    document.head.appendChild(beFont);

    // Capitalize initials properly
    const formattedName = userName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise<boolean>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);

        // NAME - Shrikhand font
        ctx.font = `bold 48px 'Shrikhand', Arial`;
        ctx.fillStyle = '#ea384c';
        ctx.textAlign = 'center';

        const nameWidth = ctx.measureText(formattedName).width;
        const maxWidth = 500;
        let fontSize = 48;

        if (nameWidth > maxWidth) {
          fontSize = Math.floor((maxWidth * fontSize) / nameWidth);
          ctx.font = `bold ${fontSize}px 'Shrikhand', Arial`;
        }

        ctx.fillText(formattedName, width / 2, 420);

        // CERTIFICATE ID - Be Vietnam Pro
        ctx.font = `bold 20px 'Be Vietnam Pro', sans-serif`;
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(`Certificate ID: ${certificateId}`, width / 2, height - 40);

        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${formattedName.replace(/\s+/g, '_')}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        resolve(true);
      };

      img.onerror = () => {
        console.error('Failed to load certificate template image');
        resolve(false);
      };

      img.src = 'https://raw.githubusercontent.com/SOWMIYAN-S/certificates/refs/heads/main/CODEQUEST%20S2_20250414_084656_0000.png';
    });
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    return false;
  }
};
