const { invoke } = window.__TAURI__.tauri;
import { getCanvasContext } from './canvas.js';
import { getNailPositions } from './nails.js';
import { drawLinesBetweenNails } from './draw.js';
// import { uploading } from './uploading.js';


// form submit function
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('stringArtForm').addEventListener('submit', function (event) {
    event.preventDefault();
    generateStringArt();
  });
});

// upload image function
document.getElementById('imageInput').addEventListener('change', async function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const inputImagePreview = document.getElementById('imageInputPreview');
    inputImagePreview.src = e.target.result;
    // Load the image into a canvas to convert it to grayscale
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      const canvas_tmp = document.createElement('canvas');
      const ctx_tmp = canvas_tmp.getContext('2d');
      canvas_tmp.width = img.width;
      canvas_tmp.height = img.height;
      ctx_tmp.drawImage(img, 0, 0);

      const imageData = ctx_tmp.getImageData(0, 0, canvas_tmp.width, canvas_tmp.height);
      const data = imageData.data;
      let grayImageAsSpaceSeparatedString = "";

      // Convert each pixel to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const grayscale = Math.floor((r + g + b) / 3);
        data[i] = data[i + 1] = data[i + 2] = grayscale;
        grayImageAsSpaceSeparatedString += grayscale + " ";
      }
      ctx_tmp.putImageData(imageData, 0, 0);

      // Set the grayscale image source to the grayscale image preview
      const grayInputImagePreview = document.getElementById('grayImageInputPreview');
      grayInputImagePreview.src = canvas_tmp.toDataURL();
      ///////////////////////////////////////////////////////////////////////

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
        width: canvas.width,
        height: canvas.height,
        numNails: numNails,
        opacity: 0.3,
      });
      const numIterations = 1000;
      let cur_nail = 0;
      let delayInMilliseconds = 1000;
      for (let i = 0; i < numIterations; i++) {
        invoke('get_next_nail').then((nail) => {
          nail = nail % numNails;
          console.log(nail);
          const startNail = nails[cur_nail];
          const endNail = nails[nail];
          ctx.strokeStyle = 'rgba(87, 87, 87,0.8)';
          ctx.beginPath();
          ctx.moveTo(startNail.x, startNail.y);
          ctx.lineTo(endNail.x, endNail.y);
          ctx.stroke();
          cur_nail = nail;
          setTimeout(() => { }, delayInMilliseconds);
        });
      }
    };
  };
  reader.readAsDataURL(file);
});

function generateStringArt() {
  console.log("Generating string art...");                        // Log to indicate the start of the function
  const { canvas, ctx } = getCanvasContext();
  const radius = canvas.width / 2; // Define radius here
  if (!ctx) {
    return;
  }


  const numNailsInput = document.getElementById('numNailsInput'); // Get the input element for number of nails
  const numNails = parseInt(numNailsInput.value, 10);             // Parse the number of nails from the input value
  if (isNaN(numNails)) {                                          // Check if the parsed number is not a number
    console.error('Invalid number of nails!');                  // Log an error message if invalid
    return;
  }

  const nails = getNailPositions(numNails, canvas, radius);
  for (let i = 0; i < numNails; i++) {
    const nail = nails[i];
    ctx.beginPath();
    ctx.arc(nail.x, nail.y, 1, 0, 2 * Math.PI);
    ctx.fill();
  }

  const nailConnectionsInput = document.getElementById('nailConnections'); // Add this line

  const nailSequence = nailConnectionsInput.value.split(',').map(n => parseInt(n, 10));

  console.log("Nail positions:", nails);                         // Log the nails object to the console for debugging
  var delayInMilliseconds = 50; //1 second
  // Connect specified nail pairs using the object keys
  drawLinesBetweenNails(nails, nailSequence, ctx, delayInMilliseconds);
}