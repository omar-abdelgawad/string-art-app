const { invoke } = window.__TAURI__.tauri;

// let greetInputEl;
// let greetMsgEl;
// window.addEventListener("DOMContentLoaded", () => {
//       greetInputEl = document.querySelector("#greet-input");
//       greetMsgEl = document.querySelector("#greet-msg"); 
//       greet()
//     });
// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }

function generateStringArt() {
  console.log("Generating string art...");                        // Log to indicate the start of the function
  const canvas = document.getElementById('stringArtCanvas');      // Get the canvas element by its ID
  if (!canvas) {                                                  // Check if the canvas element was found
      console.error('Canvas element not found!');                 // Log an error message if not found
      return; 
  }
  const ctx = canvas.getContext('2d');                            // Get the 2D drawing context of the canvas
  canvas.width = 800;                                             // Set the canvas width
  canvas.height = 800;                                            // Set the canvas height

  const numNailsInput = document.getElementById('numNailsInput'); // Get the input element for number of nails
  const numNails = parseInt(numNailsInput.value, 10);             // Parse the number of nails from the input value
  if (isNaN(numNails)) {                                          // Check if the parsed number is not a number
      console.error('Invalid number of nails!');                  // Log an error message if invalid
      return;
  }

  const nailConnectionsInput = document.getElementById('nailConnections'); // Get the input element for nail connections
  const nailPairs = nailConnectionsInput.value.split(',')         // Split the input value by commas to get pairs
                   .map(pair => pair.split('-').map(n => parseInt(n, 10) - 1)); // Split each pair by dash and parse as integers

  const centerX = canvas.width / 2;                               // Calculate the center X coordinate of the canvas
  const centerY = canvas.height / 2;                              // Calculate the center Y coordinate of the canvas
  const radius = 400;                                             // Define the radius for the circular arrangement of nails
  const nails = {};                                               // Create an empty object to store nail positions

  ctx.clearRect(0, 0, canvas.width, canvas.height);               // Clear the canvas

  // Calculate and store nail positions in a dictionary (object)
  for (let i = 0; i < numNails; i++) {
      const angle = 2 * Math.PI * i / numNails;                   // Calculate the angle for this nail
      const x = centerX + radius * Math.cos(angle);               // Calculate the x-coordinate
      const y = centerY + radius * Math.sin(angle);               // Calculate the y-coordinate
      nails[i] = {x, y};                                          // Store each nail's coordinates keyed by its index
      ctx.beginPath();                                            // Begin a new path for drawing the nail
      ctx.arc(x, y, 1, 0, 2 * Math.PI);                           // Draw a small circle for the nail
      ctx.fill();                                                 // Fill the circle
  }

  console.log("Nail positions:", nails);                         // Log the nails object to the console for debugging
var delayInMilliseconds = 50; //1 second
  // Connect specified nail pairs using the object keys
  nailPairs.forEach((pair , index ) => {
    setTimeout(function() {
      const [startIndex, endIndex] = pair;                        // Destructure the pair into start and end indices
      if (nails[startIndex] && nails[endIndex]) {                 // Check if both indices exist in the nails object
          const startNail = nails[startIndex];                    // Get the start nail's coordinates
          const endNail = nails[endIndex];                        // Get the end nail's coordinates
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.1)';           // Set the stroke color to light gray with 50% opacity
          ctx.beginPath();                                        // Begin a new path for drawing the line
          ctx.moveTo(startNail.x, startNail.y);                   // Move to the start nail's position
          ctx.lineTo(endNail.x, endNail.y);                       // Draw a line to the end nail's position
          ctx.stroke();                                           // Stroke (draw) the line
      } else {
          console.error('Invalid nail index:', pair);             // Log an error if any index is invalid
      }
    }, delayInMilliseconds * index);
  });
}