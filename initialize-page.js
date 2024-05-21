
function syncInput(range, number) {
    range.addEventListener('input', () => number.value = range.value);
    number.addEventListener('input', () => range.value = number.value);
}

function toggleMode() {
    if (document.body.classList.contains('dark-mode')) {
        // If the body has the 'dark-mode' class, remove it and add the 'light-mode' class
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    } else {
        // If the body doesn't have the 'dark-mode' class, remove the 'light-mode' class and add the 'dark-mode' class
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    }
}
export function initializePage() {

    const zoomRange = document.getElementById('zoom');
    const zoomNumber = document.getElementById('zoom-number');
    syncInput(zoomRange, zoomNumber);

    const rotateRange = document.getElementById('rotate');
    const rotateNumber = document.getElementById('rotate-number');
    syncInput(rotateRange, rotateNumber);

    const nailsRange = document.getElementById('nails');
    const nailsNumber = document.getElementById('nails-number');
    syncInput(nailsRange, nailsNumber);

    const stringsRange = document.getElementById('strings');
    const stringsNumber = document.getElementById('strings-number');
    syncInput(stringsRange, stringsNumber);

    const opacityRange = document.getElementById('opacity');
    const opacityNumber = document.getElementById('opacity-number');
    syncInput(opacityRange, opacityNumber);

    const helpButton = document.querySelector('.help-button');
    helpButton.addEventListener('click', () => {
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.help-button').style.display = 'none';
        document.querySelector('.help-container').style.display = 'block';
        document.querySelector('.back-button').style.display = 'block'; // Show the back button
    });

    const helpBackButton = document.querySelector('.back-button');
    helpBackButton.addEventListener('click', () => {
        document.querySelector('.container').style.display = 'block';
        document.querySelector('.help-button').style.display = 'block';
        document.querySelector('.help-container').style.display = 'none';
        document.querySelector('.back-button').style.display = 'none'; // Hide the back button again
    });

    const toggleButton = document.getElementById('toggle-button');
    toggleButton.addEventListener('click', toggleMode);
}
