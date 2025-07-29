const canvas = document.getElementById("strip-canvas");
const ctx = canvas.getContext("2d");

const borderSlider = document.getElementById("border-width");
const borderColorRadios = document.querySelectorAll('input[name="border-color"]');

const photos = JSON.parse(localStorage.getItem("capturedPhotos") || "[]");

const imgWidth = 200;
const imgHeight = 150;
const spacing = 5;

let borderWidth = parseInt(borderSlider.value);
let borderColor = "#000000"; // Default Black

function drawStrip() {
    canvas.width = imgWidth + borderWidth * 2;
    canvas.height = imgHeight * photos.length + spacing * (photos.length - 1) + borderWidth * 2;

    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    photos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo;
        img.onload = () => {
            ctx.drawImage(
                img,
                borderWidth,
                borderWidth + index * (imgHeight + spacing),
                imgWidth,
                imgHeight
            );
        };
    });
}

borderSlider.addEventListener("input", () => {
    borderWidth = parseInt(borderSlider.value);
    drawStrip();
});

borderColorRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (e.target.checked) {
            borderColor = e.target.value;
            drawStrip();
        }
    });
});

document.getElementById("download-strip").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "photo-strip.png";
    link.click();
});

drawStrip();



