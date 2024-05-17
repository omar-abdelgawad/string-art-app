// loadImage.js
export let img = new Image();
let zoomSlider = document.getElementById('zoomSlider');
let rotateSlider = document.getElementById('rotateSlider');

export function initializeImageUpload(canvas, ctx, drawImage) {
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        let reader = new FileReader();
        reader.onload = function(event) {
            img.onload = function() {
                drawImage(img, canvas, ctx, zoomSlider.value, rotateSlider.value);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    zoomSlider.addEventListener('input', function() {
        drawImage(img, canvas, ctx, zoomSlider.value, rotateSlider.value);
    });

    rotateSlider.addEventListener('input', function() {
        drawImage(img, canvas, ctx, zoomSlider.value, rotateSlider.value);
    });
}