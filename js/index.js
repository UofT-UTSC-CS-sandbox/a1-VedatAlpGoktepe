(function () {
  "use strict";

  window.onload = function () {
    // Helper function to load images
    const loadImages = function (page = 0, limit = 1) {
      var posts = document.querySelector(".posts");
      var imageContainer = document.querySelector(".image-display");
      posts.setAttribute("hidden", true);
      imageContainer.innerHTML = "Loading images...";

      var images = apiService.getImages(page, limit);
      if (images.length === 0) {
        imageContainer.innerHTML = "No images to display.";
        return;
      }
      
      posts.removeAttribute("hidden");
      var imageCounter = document.querySelector("#imageCounter");
      imageCounter.innerHTML = `${apiService.getNumImages()} Image(s) in Gallery`;
      imageContainer.innerHTML = "";
      images.forEach(function (image) {
        var elmt = document.createElement("div");
        elmt.className = "image-post";
        elmt.id = images[0].imageId
        elmt.innerHTML = `
          <img class="display-image image" src="${image.url}" alt="${image.title}" height="250px">
          <div class="title">${image.title}</div>
          <div class="subtext">${image.author}</div>
        `;
        imageContainer.append(elmt);
      });
    };

    // Helper function to load comments
    const loadComments = function (page = 0, limit = 10) {
      var commentDisplay = document.querySelector(".comment-display");
      commentDisplay.innerHTML = "Loading comments...";

      var imageId;
      if (!document.querySelector(".image-post")) {
        return;
      }
      imageId = document.querySelector(".image-post").id;
      var comments = apiService.getComments(imageId, page, limit);
      if (comments.length === 0) {
        commentDisplay.innerHTML = "No comments to display.";
        return;
      }

      commentDisplay.innerHTML = "";
      comments.forEach(function (comment) {
        var elmt = document.createElement("div");
        elmt.className = "comment";
        elmt.id = comment.commentId;
        elmt.innerHTML = `
          <div class="author">${comment.author}</div>
          <div class="subtext">${comment.date}</div>
          <div class="comment-text">${comment.content}</div>
          <button class="btn delete-comment" type="submit">Delete</button>
        `;

        elmt.querySelector(".delete-comment").addEventListener("click", function (e) {
          e.preventDefault();
          var cmtId = e.target.parentElement.id;
          var imgId = document.querySelector(".image-post").id;
          apiService.deleteComment(cmtId);
          cmtPage = Math.max(0, Math.min(cmtPage, Math.ceil(apiService.getNumComments(imgId)/10)-1));
          loadComments(cmtPage, cmtLimit);
        });
        commentDisplay.append(elmt);
      });
    };
    
    loadImages();
    loadComments();



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

    var imgPage = 0;
    var imgLimit = 1;
    // Event listener for Add Image Form submission
    document.querySelector("#addImageForm").addEventListener("submit", function (e) {
      e.preventDefault();

      // get form data
      var title = e.target.title.value;
      var author = e.target.author.value;
      var url = e.target.url.value;
      e.target.reset();

      // add image to localStorage, then load the latest image
      apiService.addImage(title, author, url);
      imgPage = 0;
      loadImages(imgPage, imgLimit);
      loadComments();
    });

    // Event listener for Image Gallery pagination (Previous)
    document.querySelector("#prevImage").addEventListener("click", function (e) {
      e.preventDefault();
      imgPage = Math.min(apiService.getNumImages() - 1, imgPage + 1);
      loadImages(imgPage, imgLimit);
      cmtPage = 0;
      loadComments(cmtPage);
    });
    
    // Event listener for Image Gallery pagination (Next)
    document.querySelector("#nextImage").addEventListener("click", function (e) {
      e.preventDefault();
      imgPage = Math.max(0, imgPage - 1);
      loadImages(imgPage, imgLimit);
      cmtPage = 0;
      loadComments(cmtPage);
    });

    // Event listener for Image Gallery Image Deletion
    document.querySelector("#delImage").addEventListener("click", function (e) {
      e.preventDefault();
      var imgId = document.querySelector(".image-post").id;
      apiService.deleteImage(imgId);
      apiService.deleteAllComments(imgId);
      imgPage = Math.max(0, imgPage - 1);
      loadImages(imgPage, imgLimit);
      cmtPage = 0;
      loadComments(cmtPage);
    });

    var cmtPage = 0;
    var cmtLimit = 10;
    // Event listener for Add Comment Form submission
    document.querySelector("#addCommentForm").addEventListener("submit", function (e) {
      e.preventDefault();

      // get form data
      var author = e.target.author.value;
      var content = e.target.content.value;
      e.target.reset();
      var imgId = document.querySelector(".image-post").id;

      // add comment to localStorage, then load the latest comments
      apiService.addComment(imgId, author, content);
      cmtPage = 0;
      loadComments(cmtPage, cmtLimit);
    });

    // Event listener for Comment pagination (Previous)
    document.querySelector("#prevComment").addEventListener("click", function (e) {
      e.preventDefault();
      var imgId = document.querySelector(".image-post").id;
      cmtPage = Math.max(0, cmtPage - 1);
      loadComments(cmtPage, cmtLimit);
    });
    
    // Event listener for Comment pagination (Next)
    document.querySelector("#nextComment").addEventListener("click", function (e) {
      e.preventDefault();
      var imgId = document.querySelector(".image-post").id;
      cmtPage = Math.min(Math.ceil(apiService.getNumComments(imgId)/10) - 1, cmtPage + 1);
      loadComments(cmtPage, cmtLimit);
    });
  };
})();