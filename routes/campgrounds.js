const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const isLoggedIn = require('../middleware/isLoggedIn');
const checkOwnership = require('../middleware/checkOwnership');

const router = express.Router();

router.get('/', (_req, res) => {
  // eslint-disable-next-line array-callback-return
  Campground.find((err, campgrounds) => {
    if (err) throw err;
    res.render('campgrounds/index', { campgrounds });
  });
});

router.post('/', isLoggedIn, (req, res) => {
  Campground
    .create({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    })
    .then(() => {
      res.redirect('campgrounds');
    })
    .catch(error => { throw error; });
});

router.get('/:id/edit', checkOwnership, (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) throw error;
    res.render('campgrounds/edit', { campground });
  });
});

router.put('/:id', checkOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (error, _campground) => {
      if (error) throw error;
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  );
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((error, campground) => {
      if (error) throw error;
      res.render('campgrounds/show', { campground });
    });
});

router.delete('/:id', checkOwnership, (req, res) => {
  Campground.findByIdAndDelete(
    req.params.id,
    (error, campground) => {
      if (error) throw error;
      campground.comments.forEach(comment => {
        Comment.findByIdAndDelete(
          comment._id,
          (ex, _) => {
            if (ex) throw ex;
          }
        );
      });
      res.redirect('/campgrounds');
    }
  );
});

module.exports = router;
