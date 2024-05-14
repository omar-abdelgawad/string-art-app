function getCanvasContext() {
    const canvas = document.getElementById('stringArtCanvas');
    if (!canvas) {
      console.error('Canvas element not found!');
      return null; 
    }
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    return { canvas, ctx };
  }
  export { getCanvasContext };