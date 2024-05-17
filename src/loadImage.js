// loadImage.js
let img = new Image();
const zoomSlider = document.getElementById('zoomSlider');
const rotateSlider = document.getElementById('rotateSlider');

export function initializeImageUpload(canvas, ctx, drawImage) {
    document.getElementById('imageUpload').addEventListener('change', (e) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            img.onload = () => {
                zoomSlider.value = 1;
                rotateSlider.value = 0;
                img = resizeImage(img, canvas.width, canvas.height);
                img.onload = () => {
                    drawImage(img, canvas, ctx, zoomSlider.value, rotateSlider.value);
                }
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    zoomSlider.addEventListener('input', () => {
        drawImage(img, canvas, ctx, zoomSlider.value, rotateSlider.value);
    });

    rotateSlider.addEventListener('input', () => {
        drawImage(img, canvas, ctx, zoomSlider.value, rotateSlider.value);
    });
}
function resizeImage(image, width, height) {
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = width;
    offScreenCanvas.height = height;
    const offScreenCtx = offScreenCanvas.getContext('2d');
    offScreenCtx.drawImage(image, 0, 0, width, height);
    const resizedImage = new Image();
    resizedImage.src = offScreenCanvas.toDataURL();
    return resizedImage;
}