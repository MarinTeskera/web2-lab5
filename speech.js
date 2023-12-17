const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const grammar =
  "#JSGF V1.0; grammar shapes; public <shape> = circle | square | triangle | star ;";
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const diagnostic = document.querySelector(".output");
const imageContainer = document.getElementById("imageContainer");
const imageInput = document.getElementById("imageInput");
const recordButton = document.getElementById("record-start");

recordButton.onclick = () => {
  recognition.start();
  console.log("Ready to receive a shape command.");
};

imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageUrl = e.target.result;
      imageContainer.innerHTML = `<img src="${imageUrl}" alt="Uploaded Image" id="uploadedImage">`;

      // Store the original dimensions
      const uploadedImage = document.getElementById("uploadedImage");
      originalWidth = uploadedImage.width;
      originalHeight = uploadedImage.height;

      // Do not call resizeImage here to retain the original size
    };

    reader.readAsDataURL(file);
  }
}

function applyShapeTransformation(shape) {
  const uploadedImage = document.getElementById("uploadedImage");

  if (uploadedImage) {
    switch (shape) {
      case "circle":
        uploadedImage.style.borderRadius = "50%";
        uploadedImage.style.clipPath = "none"; // Clear any existing clip path
        break;
      case "square":
        uploadedImage.style.borderRadius = "0";
        uploadedImage.style.clipPath = "none"; // Clear any existing clip path
        resizeImage(); // Call resizeImage only when the shape is "square"
        break;
      case "triangle":
        uploadedImage.style.borderRadius = "0";
        uploadedImage.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
        break;
      case "star":
        uploadedImage.style.borderRadius = "0";
        uploadedImage.style.clipPath =
          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        break;
      case "reset":
        resetStyles();
        break;
      default:
        break;
    }
  }
}

function resizeImage() {
  const uploadedImage = document.getElementById("uploadedImage");

  if (uploadedImage) {
    // Set the size to the smaller dimension only when the shape is "square"
    const imageSize = Math.min(uploadedImage.height, uploadedImage.width);

    // Avoid setting the size to 0
    if (imageSize > 0) {
      uploadedImage.style.width = `${imageSize}px`;
      uploadedImage.style.height = `${imageSize}px`;
      uploadedImage.style.objectFit = "cover"; // Enable cropping
      uploadedImage.style.objectPosition = "50% 50%"; // Center the cropped region
    }
  }
}

function resetStyles() {
  const uploadedImage = document.getElementById("uploadedImage");

  if (uploadedImage) {
    // Remove all styles
    uploadedImage.style.borderRadius = "0";
    uploadedImage.style.width = "auto";
    uploadedImage.style.height = "auto";
  }
}

// Your other existing code...

recognition.onresult = (event) => {
  const shape = event.results[0][0].transcript.trim().toLowerCase();
  diagnostic.textContent = `Result received: ${shape}`;

  const allowedShapes = ["circle", "square", "triangle", "star", "reset"];

  if (allowedShapes.includes(shape)) {
    applyShapeTransformation(shape);
  } else {
    diagnostic.textContent += " (Invalid shape)";
  }
};
