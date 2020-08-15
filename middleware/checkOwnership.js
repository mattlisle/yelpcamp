const Campground = require('../models/campground');

module.exports = function checkOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(
      req.params.id,
      (error, campground) => {
        if (error) {
          req.flash('error', 'Campground not found');
          res.redirect('back');
        } else if (campground.author.id.equals(req.user._id)) {
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
