// Constants

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DATABASE_NAME
} = process.env;

const PORT = 3000;
const HOST = '0.0.0.0';
const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDb = require('./seed');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('common'));

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    seedDb();
  })
  .catch(error => { throw error; });

app.get('/', (req, res) => {
  res.render('landing');
});

// REST: index page
app.get('/campgrounds', (_, res) => {
  // eslint-disable-next-line array-callback-return
  Campground.find((err, campgrounds) => {
    if (err) throw err;
    res.render('campgrounds/index', { campgrounds });
  });
});

// REST: create page
app.post('/campgrounds', (req, res) => {
  console.log('Received post request');
  Campground
    .create({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
    })
    .then(() => {
      console.log('Created a campground');
      res.redirect('campgrounds');
    })
    .catch(error => { throw error; });
});

// Campground: new page
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// Campground: show page
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((error, campground) => {
      if (error) throw error;
      res.render('campgrounds/show', { campground });
    });
});

// Comment: new page
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) throw error;
    res.render('comments/new', { campground });
  });
});

app.post('/campgrounds/:id/comments', async (req, res) => {
  console.log('Received post request');
  Campground.findById(req.params.id, async (error, campground) => {
    if (error) throw error;
    console.log(req.body.comment);
    const comment = await Comment.create(req.body.comment);
    console.log(comment);
    campground.comments.push(comment);
    campground.save()
      .then(newCampground => console.log(newCampground));
    res.redirect(`/campgrounds/${campground._id}`);
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGTERM', () => {
  console.info('Shutting down gracefully');
  process.exit(0);
});
