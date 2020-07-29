'use strict';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  console.log('Received request');
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  const campgrounds = [
    {name: 'camp1', image: 'https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'camp2', image: 'https://images.pexels.com/photos/753603/pexels-photo-753603.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'camp3', image: 'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350'}
  ];
  res.render('campgrounds');
});

const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

process.on('SIGTERM', () => {
  console.info('Shutting down gracefully');
  process.exit(0);
});

// axios.get('https://jsonplaceholder.typicode.com/todos/1')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   })
//   .finally(_ => {
//     console.log('always executed');
//   });
