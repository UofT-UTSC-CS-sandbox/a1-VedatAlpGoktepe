(function () {
  "use strict";

  window.onload = function () {
    // Helper function to load images
    const loadImages = function (page = 0, limit = 1) {
      var images = apiService.getImages(page, limit);
      var imageContainer = document.querySelector(".image-display");
      if (images.length === 0) {
        imageContainer.innerHTML = "No images to display.";
        return;
      }
      
      imageContainer.innerHTML = "";
      images.forEach(function (image) {
        var elmt = document.createElement("div");
        elmt.className = "image-post";
        elmt.id = images[0].imageId
        elmt.innerHTML = `
          <img class="display-image image" src="${image.url}" alt="${image.title}">
          <div class="title">${image.title}</div>
          <div class="subtext">${image.author}</div>
        `;
        imageContainer.append(elmt);
      });
    };

    loadImages();

    // Event listener for Show/Hide Add Image Form button
    document.querySelector("#toggleAddForm").addEventListener("click", function (e) {
      e.preventDefault();

      const addForm = document.querySelector("#addImageForm");
      if (addForm.attributes.hidden) {
        e.target.innerText = "Hide Add Image Form";
        addForm.removeAttribute("hidden");
      } else {
        e.target.innerText = "Show Add Image Form";
        addForm.setAttribute("hidden", true);
      }
    });

    // Event listener for Add Image Form submission
    document.querySelector("#addImageForm").addEventListener("submit", function (e) {
      e.preventDefault();

      // get form data
      var title = e.target.title.value;
      var author = e.target.author.value;
      var url = e.target.url.value;
      e.target.reset();

      // add image to localStorage, then load the latest image (default)
      apiService.addImage(title, author, url);
      loadImages();
    });

    var imgPage = 0;
    var imgLimit = 1;
    // Event listener for Image Gallery pagination (Previous)
    document.querySelector("#prevImage").addEventListener("click", function (e) {
      e.preventDefault();
      imgPage = Math.max(0, imgPage - 1);
      loadImages(imgPage, imgLimit);
    });

    // Event listener for Image Gallery pagination (Next)
    document.querySelector("#nextImage").addEventListener("click", function (e) {
      e.preventDefault();
      imgPage = Math.min(apiService.getNumImages() - 1, imgPage + 1);
      loadImages(imgPage, imgLimit);
    });

    // Event listener for Image Gallery Image Deletion
    document.querySelector("#delImage").addEventListener("click", function (e) {
      e.preventDefault();
      var imgId = document.querySelector(".image-post").id;
      apiService.deleteImage(imgId);
      imgPage = Math.min(apiService.getNumImages() - 1, imgPage);
      loadImages(imgPage, imgLimit);
    });
  };
})();