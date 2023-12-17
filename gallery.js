document.addEventListener("DOMContentLoaded", () => {
  // Open a connection to IndexedDB
  const request = indexedDB.open("YourImageDatabase", 1);

  // Handle successful database opening
  request.onsuccess = (event) => {
    const db = event.target.result;

    // Create a transaction and access the object store
    const transaction = db.transaction(["images"], "readonly");
    const objectStore = transaction.objectStore("images");

    // Open a cursor to iterate over the images
    const cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        // Display the image on the gallery page
        displayImage(cursor.value.url);

        // Move to the next image
        cursor.continue();
      }
    };

    // Handle errors
    cursorRequest.onerror = (error) => {
      console.error("Error opening cursor:", error);
    };
  };

  // Handle database opening errors
  request.onerror = (event) => {
    console.error("Error opening IndexedDB:", event.target.error);
  };
});

function displayImage(imageUrl) {
  const galleryContainer = document.getElementById("galleryContainer");
  const imageElement = document.createElement("img");
  imageElement.src = imageUrl;
  imageElement.alt = "Gallery Image";
  galleryContainer.appendChild(imageElement);
}
