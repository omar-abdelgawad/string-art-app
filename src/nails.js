function getNailPositions(numNails, canvas, radius) {
    const centerX = canvas.width / 2;                               
    const centerY = canvas.height / 2;                                                                          
    const nails = {};                                               
  
    for (let i = 0; i < numNails; i++) {
      const angle = 2 * Math.PI * i / numNails;                   
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nails[i] = {x, y};
    }
  
    return nails;
  }
    export { getNailPositions };