const mongoose = require('mongoose');
const author = require('./author');

const camgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Campground', camgroundSchema);
