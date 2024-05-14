const { invoke } = window.__TAURI__.tauri;

// image preview function
var loadFile = function(event) {
  var image = document.getElementById('output');
  image.src = URL.createObjectURL(event.target.files[0]);
};

// form submit function
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('stringArtForm').addEventListener('submit', function(event) {
      event.preventDefault();
      generateStringArt();
  });
});

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