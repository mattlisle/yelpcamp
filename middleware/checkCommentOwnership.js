const Comment = require('../models/comment');

module.exports = function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(
      req.params.commentId,
      (error, comment) => {
        if (error) {
          throw error;
        } else if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    );
  } else {
    res.redirect('/login');
  }
};
