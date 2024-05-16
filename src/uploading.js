async function uploading(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async function (e) {
        const inputImagePreview = document.getElementById('imageInputPreview');
        inputImagePreview.src = e.target.result;
        // Load the image into a canvas to convert it to grayscale
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Convert each pixel to grayscale
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const grayscale = (r + g + b) / 3;
                data[i] = data[i + 1] = data[i + 2] = grayscale;
            }

            ctx.putImageData(imageData, 0, 0);

            // Set the grayscale image source to the grayscale image preview
            const grayInputImagePreview = document.getElementById('grayImageInputPreview');
            grayInputImagePreview.src = canvas.toDataURL();
        };
    };
    reader.readAsDataURL(file);
}
export { uploading };