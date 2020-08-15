const Comment = require('../models/comment');

module.exports = function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(
      req.params.commentId,
      (error, comment) => {
        if (error) {
          req.flash('error', 'Comment not found');
          res.redirect('back');
        } else if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Permission denied');
          res.redirect('back');
        }
      }
    );
  } else {
    req.flash('Please login');
    res.redirect('/login');
  }
};
