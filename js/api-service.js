let apiService = (function () {
  let module = {};

  /*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date
  */

  var images = [];
  if (localStorage.getItem("images") !== null) {
    images = JSON.parse(localStorage.getItem("images"));
  }
  var comments = [];
  if (localStorage.getItem("comments") !== null) {
    comments = JSON.parse(localStorage.getItem("comments"));
  }

  // if image/comment exists, start the ID from the max existing ID + 1
  var curImgID = 1;
  if (images.length !== 0) {
    curImgID = images[0].imageId + 1;
  }
  var curCmtID = 1;
  if (comments.length !== 0) {
    curCmtID = comments[0].commentId + 1;
  }

  // add an image to the gallery
  module.addImage = function (title, author, url) {
    let newImage = {
      imageId: curImgID,
      title: title,
      author: author,
      url: url,
      date: new Date(),
    };
    curImgID++;
    images.unshift(newImage);
    localStorage.setItem("images", JSON.stringify(images));
  };

  // delete an image from the gallery given its imageId
  module.deleteImage = function (imageId) {
    const index = images.findIndex((img) => img.imageId == imageId);
    if (index > -1) {
      images.splice(index, 1);
    }
    localStorage.setItem("images", JSON.stringify(images));
  };

  // get limit images from the gallery starting from page*limit
  module.getImages = function (page=0, limit=1) {
    return images.slice(page * limit, (page + 1) * limit);
  };

  module.getNumImages = function () {
    return images.length;
  };

  // add a comment to an image
  module.addComment = function (imageId, author, content) {
    let newComment = {
      commentId: curCmtID,
      imageId: imageId,
      author: author,
      content: content,
      date: new Date(),
    };
    comments.unshift(newComment);
    curCmtID++;
    localStorage.setItem("comments", JSON.stringify(comments));
  };

  // delete a comment to an image
  module.deleteComment = function (commentId) {
    const index = comments.findIndex((cmt) => cmt.commentId == commentId);
    if (index > -1) {
      comments.splice(index, 1);
    }
    localStorage.setItem("comments", JSON.stringify(comments));
  };

  // delete all comments for an image
  module.deleteAllComments = function (imageId) {
    comments = comments.filter((comment) => comment.imageId != imageId);
    localStorage.setItem("comments", JSON.stringify(comments));
  };

  // get limit comments for imageId starting from page*limit
  module.getComments = function (imageId, page=0, limit=10) {
    return comments
      .filter((comment) => comment.imageId == imageId)
      .slice(page * limit, (page + 1) * limit);
  };

  module.getNumComments = function (imageId) {
    return comments.filter((comment) => comment.imageId == imageId).length;
  }

  return module;
})();
