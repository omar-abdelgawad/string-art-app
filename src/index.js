const { invoke } = window.__TAURI__.tauri;
import { getCanvasContext } from './canvas.js';
import { getNailPositions } from './nails.js';
import { initializeImageUpload } from './loadImage.js';
import { drawImage } from './drawImage.js';




window.onload = () => {
  let canvas = document.getElementById('imageCanvas');
  let ctx = canvas.getContext('2d');

  initializeImageUpload(canvas, ctx, drawImage);
}

document.getElementById('updateButton').addEventListener('click', async function (event) {
  const img = new Image();
  img.src = document.getElementById('imageCanvas').toDataURL();
  img.onload = function () {
    const canvas_tmp = document.createElement('canvas');
    const ctx_tmp = canvas_tmp.getContext('2d');
    canvas_tmp.width = 900;
    canvas_tmp.height = 900;
    ctx_tmp.drawImage(img, 0, 0, canvas_tmp.width, canvas_tmp.height);


    const imageData = ctx_tmp.getImageData(0, 0, canvas_tmp.width, canvas_tmp.height);
    const data = imageData.data;
    let grayImageAsSpaceSeparatedString = "";

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const grayscale = Math.floor((r + g + b) / 3);
      data[i] = data[i + 1] = data[i + 2] = grayscale;
      grayImageAsSpaceSeparatedString += grayscale + " ";
    }
    ctx_tmp.putImageData(imageData, 0, 0);
    const grayInputImagePreview = document.getElementById('grayImageInputPreview');
    grayInputImagePreview.src = canvas_tmp.toDataURL();
    grayImageAsSpaceSeparatedString = grayImageAsSpaceSeparatedString.trim();
    const { canvas, ctx } = getCanvasContext();
    const radius = canvas.width / 2;
    const numNails = parseInt(document.getElementById('numNailsInput').value, 10);
    const nails = getNailPositions(numNails, canvas, radius);
    for (let i = 0; i < numNails; i++) {
      const nail = nails[i];
      ctx.beginPath();
      ctx.arc(nail.x, nail.y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    invoke('insert_data', {
      data: grayImageAsSpaceSeparatedString,
      width: canvas_tmp.width,
      height: canvas_tmp.height,
      numNails: numNails,
      opacity: 0.3,
    });
    const numIterations = 2000;
    let cur_nail = 0;
    let delayInMilliseconds = 5;
    async function performLoop() {
      for (let i = 0; i < numIterations; i++) {
        const nail = await invoke('get_next_nail');
        const startNail = nails[cur_nail];
        const endNail = nails[nail % numNails];
        ctx.strokeStyle = 'rgba(87, 87, 87,0.2)';
        ctx.beginPath();
        ctx.moveTo(startNail.x, startNail.y);
        ctx.lineTo(endNail.x, endNail.y);
        ctx.stroke();
        cur_nail = nail;
        await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
      }
    }
    performLoop();
  };
});



window.downloadImage = () => {
  var download = document.getElementById("download");
  var image = document.getElementById("stringArtCanvas").toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}