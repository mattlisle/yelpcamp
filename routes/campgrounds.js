const express = require('express');
const Campground = require('../models/campground');

const router = express.Router();

// REST: index page
router.get('/', (req, res) => {
  // eslint-disable-next-line array-callback-return
  Campground.find((err, campgrounds) => {
    if (err) throw err;
    res.render('campgrounds/index', { campgrounds });
  });
});

// REST: create page
router.post('/', (req, res) => {
  Campground
    .create({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
    })
    .then(() => {
      res.redirect('campgrounds');
    })
    .catch(error => { throw error; });
});

// Campground: new page
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

// Campground: show page
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((error, campground) => {
      if (error) throw error;
      res.render('campgrounds/show', { campground });
    });
});

module.exports = router;
