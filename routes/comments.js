const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

const router = express.Router({ mergeParams: true });

// Comment: new page
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) throw error;
    res.render('comments/new', { campground });
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  Campground.findById(req.params.id, async (error, campground) => {
    if (error) throw error;
    const comment = await Comment.create(req.body.comment);
    campground.comments.push(comment);
    campground.save()
      .then(newCampground => console.log(newCampground));
    res.redirect(`/campgrounds/${campground._id}`);
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
  return undefined;
}

module.exports = router;