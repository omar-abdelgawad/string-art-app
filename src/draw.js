function drawLinesBetweenNails(nails, nailSequence, ctx, delayInMilliseconds) {
  for (let i = 1; i < nailSequence.length; i++) {
    const startNail = nails[nailSequence[i - 1]];
    const endNail = nails[nailSequence[i]];
    ctx.strokeStyle = 'rgba(87, 87, 87,0.2)';
    ctx.beginPath();
    ctx.moveTo(startNail.x, startNail.y);
    ctx.lineTo(endNail.x, endNail.y);
    ctx.stroke();
    setTimeout(() => { }, delayInMilliseconds);
  }
}
export { drawLinesBetweenNails };