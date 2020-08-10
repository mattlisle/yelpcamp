const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const isLoggedIn = require('../middleware/isLoggedIn');

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
    comment.author = {
      id: req.user._id,
      username: req.user.username,
    };
    comment.save();
    campground.comments.push(comment);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  });
});

router.get('/:commentId/edit', (req, res) => {
  Comment.findById(req.params.commentId, (error, comment) => {
    if (error) throw error;
    res.render('comments/edit', {
      campgroundId: req.params.id,
      comment,
    });
  });
});

router.put('/:commentId', (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body.comment,
    (error, _comment) => {
      if (error) throw error;
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  );
});

module.exports = router;
