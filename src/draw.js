function drawLinesBetweenNails(nails, nailPairs, ctx, delayInMilliseconds) {
    nailPairs.forEach((pair , index ) => {
      setTimeout(function() {
        const [startIndex, endIndex] = pair;
        if (nails[startIndex] && nails[endIndex]) {
            const startNail = nails[startIndex];
            const endNail = nails[endIndex];
            ctx.strokeStyle = 'rgba(87, 87, 87,0.2)';
            ctx.beginPath();
            ctx.moveTo(startNail.x, startNail.y);
            ctx.lineTo(endNail.x, endNail.y);
            ctx.stroke();
        } else {
            console.error('Invalid nail index:', pair);
        }
      }, delayInMilliseconds * index);
    });
  }
    export { drawLinesBetweenNails };