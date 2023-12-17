// Open a connection to IndexedDB
const request = indexedDB.open("YourImageDatabase", 1);

// Handle successful database opening
request.onsuccess = (event) => {
  const db = event.target.result;

  // Create a transaction and access the object store
  const transaction = db.transaction(["images"], "readonly");
  const objectStore = transaction.objectStore("images");

  // Open a cursor to iterate over stored images
  const cursorRequest = objectStore.openCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      // Create a gallery item for each stored image
      createGalleryItem(cursor.value);
      cursor.continue();
    }
  };

  // Handle errors
  transaction.onerror = (error) => {
    console.error("Error accessing IndexedDB:", error);
  };
};

// Function to create a gallery item and append it to the gallery container
function createGalleryItem(imageData) {
  const galleryContainer = document.getElementById("galleryContainer");

  if (galleryContainer) {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";

    const image = document.createElement("img");
    image.src = imageData.url;
    image.alt = "Saved Image";

    // Apply stored styles to the image
    if (imageData.styles) {
      const data = imageData.styles;

      applyStoredStyles(image, imageData.styles);

      if (data.height && data.height > 0) {
        image.height = data.height;
      }
      if (data.width && data.width > 0) {
        image.width = data.width;
      }
    }

    galleryItem.appendChild(image);
    galleryContainer.appendChild(galleryItem);
  }
}

// Function to apply stored styles to an image
function applyStoredStyles(image, styles) {
  if (image && styles) {
    // Apply stored styles to the image
    image.style.borderRadius = styles.border;
    image.style.clipPath = styles.clipPath;
    // Add other style properties as needed
  }
}
