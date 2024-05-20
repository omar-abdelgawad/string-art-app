import * as wasm from "wasm-string-art";
import { initializePage } from "./initialize-page.js";
import { getNailPositions } from "../src/nails.js";
let inputImage = new Image();
let inputImageData = null;
const mainCanvas = document.getElementById('string-art-animation');
const mainCanvasCtx = mainCanvas.getContext('2d');
function initializeUploadButton() {
    const uploadFileElement = document.getElementById('upload-file');
    uploadFileElement.addEventListener('change', (e) => {
        document.querySelector('.landing-container').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        document.querySelector('.help-button').style.display = 'block';
        const reader = new FileReader();
        reader.onload = (event) => {
            inputImage.onload = () => {
                mainCanvas.width = 300;
                mainCanvas.height = 300;
                mainCanvasCtx.drawImage(inputImage, 0, 0, mainCanvas.width, mainCanvas.height);
                inputImageData = mainCanvasCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height).data;
                // console.log(inputImageData, inputImageData.length);
            }
            inputImage.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
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


import { StringRingWrapper } from "wasm-string-art";
import { memory } from "wasm-string-art/wasm_stringart_bg";
function main() {
    initializeUploadButton();
    initializePage();
    wasm.greet();
    const updateButton = document.getElementById('update-button');
    updateButton.addEventListener('click', () => {
        const nails = document.getElementById('nails').value;
        const numIterations = document.getElementById('strings').value;
        const opacity = document.getElementById('opacity').value;
        const stringRingWrapper = StringRingWrapper.new(300, 300, nails, opacity);

        const inputImagePtr = stringRingWrapper.input_image_pointer();
        const inputImageInStringWrapper = new Uint8Array(memory.buffer, inputImagePtr, 300 * 300 * 4);
        for (let i = 0; i < inputImageData.length; i += 4) {
            inputImageInStringWrapper[i] = inputImageData[i];
            inputImageInStringWrapper[i + 1] = inputImageData[i + 1];
            inputImageInStringWrapper[i + 2] = inputImageData[i + 2];
            inputImageInStringWrapper[i + 3] = inputImageData[i + 3];
        }
        stringRingWrapper.update_input_image_to_greyscale();
        // remove the image in the mainCanvas
        mainCanvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        let cur_nail = 0;
        let delayInMilliseconds = 5;
        const nailPositions = getNailPositions(nails, mainCanvas, mainCanvas.width / 2);
        async function performLoop() {
            for (let i = 0; i < numIterations; i++) {
                const nextNail = stringRingWrapper.update();
                const startNail = nailPositions[cur_nail];
                const endNail = nailPositions[nextNail];
                mainCanvasCtx.strokeStyle = `rgba(87, 87, 87,${opacity})`;
                mainCanvasCtx.beginPath();
                mainCanvasCtx.moveTo(startNail.x, startNail.y);
                mainCanvasCtx.lineTo(endNail.x, endNail.y);
                mainCanvasCtx.stroke();
                cur_nail = nextNail;
                await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
            }
        }
        performLoop();
    })
}
main();