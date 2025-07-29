const video = document.getElementById("video");
const cameraContainer = document.getElementById("camera-container");
const captureBtn = document.getElementById("capture-btn");
const generateBtn = document.getElementById("generate-strip-btn");
const countdownEl = document.getElementById("countdown");
const useCameraBtn = document.getElementById("btn1");
const uploadPhotosBtn = document.getElementById("btn2");

let stream = null;
let capturedPhotos = [];

// Start camera on "Use Camera" button click
useCameraBtn.addEventListener("click", async () => {
  generateBtn.classList.add("hidden");
  capturedPhotos = [];
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    cameraContainer.classList.remove("hidden");
  } catch (err) {
    alert("Error accessing camera: " + err.message);
  }
});

// Upload photos
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.multiple = true;
fileInput.style.display = "none";
document.body.appendChild(fileInput);

uploadPhotosBtn.addEventListener("click", () => {
  capturedPhotos = [];
  generateBtn.classList.add("hidden");
  cameraContainer.classList.add("hidden");
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  fileInput.value = null;
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  if (files.length !== 3) {
    alert("Please select exactly 3 photos.");
    return;
  }
  capturedPhotos = [];
  let loadedCount = 0;
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      capturedPhotos.push(event.target.result);
      loadedCount++;
      if (loadedCount === 3) {
        generateBtn.classList.remove("hidden");
      }
    };
    reader.readAsDataURL(file);
  });
});

// Countdown & Capture photo logic
function startCountdown(seconds = 3) {
  countdownEl.textContent = seconds;
  countdownEl.classList.remove("hidden");

  const interval = setInterval(() => {
    seconds--;
    if (seconds === 0) {
      clearInterval(interval);
      countdownEl.classList.add("hidden");
      capturePhoto();
    } else {
      countdownEl.textContent = seconds;
    }
  }, 1000);
}

function capturePhoto() {
  // Create canvas to capture current video frame
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  // Draw video frame with grayscale filter
  ctx.filter = "grayscale(100%)";
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/png");
  capturedPhotos.push(dataUrl);

  // No alert after each capture

  if (capturedPhotos.length === 3) {
    generateBtn.classList.remove("hidden");
    // Stop camera since all photos captured
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    cameraContainer.classList.add("hidden");
  }
}

// Capture button event
captureBtn.addEventListener("click", () => {
  if (capturedPhotos.length >= 3) {
    alert("You already captured 3 photos.");
    return;
  }
  startCountdown();
});

// Generate Strip button click
generateBtn.addEventListener("click", () => {
  if (capturedPhotos.length !== 3) {
    alert("You need exactly 3 photos to generate the strip.");
    return;
  }
  localStorage.setItem("capturedPhotos", JSON.stringify(capturedPhotos));
  window.location.href = "strip.html";
});



