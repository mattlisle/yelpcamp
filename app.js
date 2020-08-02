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

// const campgrounds = [
//   { name: 'camp1', image: 'https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350' },
//   { name: 'camp2', image: 'https://images.pexels.com/photos/753603/pexels-photo-753603.jpeg?auto=compress&cs=tinysrgb&h=350' },
//   { name: 'camp3', image: 'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350' },
//   { name: 'camp1', image: 'https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350' },
//   { name: 'camp2', image: 'https://images.pexels.com/photos/753603/pexels-photo-753603.jpeg?auto=compress&cs=tinysrgb&h=350' },
//   { name: 'camp3', image: 'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350' },
// ];

// {
//   name: 'Yosemite Bridalveil Creek'
//   image: 'https://www.myyosemitepark.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_680/MTQ3OTg4NjE5MDk5MjUxODY3/yt-bridalveil-creek-campground_ordelheide_680.webp',
//   description: 'Reservation only campground in Yosemite National Park'
// }

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB!'))
  .catch(error => { throw error; });

const camgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const Campground = mongoose.model('Campground', camgroundSchema);

app.get('/', (req, res) => {
  res.render('landing');
});

// REST: index page
app.get('/campgrounds', (_, res) => {
  // eslint-disable-next-line array-callback-return
  Campground.find((err, campgrounds) => {
    if (err) throw err;
    res.render('index', { campgrounds });
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

// REST: new page
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// REST: show page
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id, (error, campground) => {
    if (error) throw error;
    res.render('show', { campground });
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGTERM', () => {
  console.info('Shutting down gracefully');
  process.exit(0);
});
