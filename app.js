// Constants

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
} = process.env;

const PORT = 3000;
const HOST = '0.0.0.0';
const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;

const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const User = require('./models/user');

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDb = require('./seed');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('common'));

app.use(expressSession({
  secret: 'so so secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// must be placed after passport initialization to work
app.use((req, res, next) => {
  console.log(req.user);
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
  return undefined;
}

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
app.get('/campgrounds', (req, res) => {
  // eslint-disable-next-line array-callback-return
  Campground.find((err, campgrounds) => {
    if (err) throw err;
    res.render('campgrounds/index', { campgrounds });
  });
});

// REST: create page
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) throw error;
    res.render('comments/new', { campground });
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, async (req, res) => {
  Campground.findById(req.params.id, async (error, campground) => {
    if (error) throw error;
    const comment = await Comment.create(req.body.comment);
    campground.comments.push(comment);
    campground.save()
      .then(newCampground => console.log(newCampground));
    res.redirect(`/campgrounds/${campground._id}`);
  });
});

// Auth routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (error, _user) => {
    if (error) throw error;
    passport.authenticate('local')(
      req,
      res,
      () => { res.redirect('/campgrounds'); }
    );
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate(
    'local',
    {
      successRedirect: 'campgrounds',
      failureRedirect: 'login',
    }
  ),
  (req, res) => {}
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGTERM', () => {
  process.exit(0);
});
