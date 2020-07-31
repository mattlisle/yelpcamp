// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  const campgrounds = [
    { name: 'camp1', image: 'https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350' },
    { name: 'camp2', image: 'https://images.pexels.com/photos/753603/pexels-photo-753603.jpeg?auto=compress&cs=tinysrgb&h=350' },
    { name: 'camp3', image: 'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350' },
  ];
  res.render('campgrounds', { campgrounds });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGTERM', () => {
  console.info('Shutting down gracefully');
  process.exit(0);
});
