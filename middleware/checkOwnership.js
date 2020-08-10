const Campground = require('../models/campground');

module.exports = function checkOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(
      req.params.id,
      (error, campground) => {
        if (error) {
          throw error;
        } else if (campground.author.id.equals(req.user._id)) {
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
