const express = require('express');
const Campground = require('../models/campground');
const isLoggedIn = require('../middleware/isLoggedIn');

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

router.get('/:id/edit', (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) throw error;
    res.render('campgrounds/edit', { campground });
  });
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  Campground.findByIdAndRemove(
    req.params.id,
    error => {
      if (error) throw error;
      res.redirect('/campgrounds');
    }
  );
});

module.exports = router;
