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
  