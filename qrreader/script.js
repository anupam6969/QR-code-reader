const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const ctx = canvas.getContext('2d');
let scanning = false;

// Access the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing the camera:', err);
    });

// Start scanning QR codes
video.addEventListener('play', () => {
    scanning = true;
    tick();
});

// Decode QR codes
const tick = () => {
    if (video.paused || video.ended || !scanning) return false;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            output.textContent = code.data;
            scanning = false;
        }
    } catch (err) {
        console.error('Error decoding QR code:', err);
    }

    if (scanning) requestAnimationFrame(tick);
};

// Load QR code decoding library
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.0.0/dist/jsQR.js';
script.async = true;
document.body.appendChild(script);
