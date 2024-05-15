const { invoke } = window.__TAURI__.tauri;
import { getCanvasContext } from './canvas.js';
import { getNailPositions } from './nails.js';
import { drawLinesBetweenNails } from './draw.js';


// form submit function
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('stringArtForm').addEventListener('submit', function(event) {
      event.preventDefault();
      generateStringArt();
  });
});


function generateStringArt() {
  console.log("Generating string art...");                        // Log to indicate the start of the function
  const { canvas, ctx } = getCanvasContext();
  const radius = 200; // Define radius here
  if (!ctx) {
    return;
  }


  const numNailsInput = document.getElementById('numNailsInput'); // Get the input element for number of nails
  const numNails = parseInt(numNailsInput.value, 10);             // Parse the number of nails from the input value
  if (isNaN(numNails)) {                                          // Check if the parsed number is not a number
    console.error('Invalid number of nails!');                  // Log an error message if invalid
    return;
  }
  
  const nails = getNailPositions(numNails, canvas ,radius);
  for (let i = 0; i < numNails; i++) {
    const nail = nails[i];
    ctx.beginPath();
    ctx.arc(nail.x, nail.y, 1, 0, 2 * Math.PI);
    ctx.fill();
}

  const nailConnectionsInput = document.getElementById('nailConnections'); // Add this line

  const nailPairs = nailConnectionsInput.value.split(',')
                    .map(pair => pair.split('-').map(n => parseInt(n, 10) - 1));

  console.log("Nail positions:", nails);                         // Log the nails object to the console for debugging
  var delayInMilliseconds = 50; //1 second
  // Connect specified nail pairs using the object keys
  drawLinesBetweenNails(nails, nailPairs, ctx, delayInMilliseconds);
}