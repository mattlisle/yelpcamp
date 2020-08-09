const mongoose = require('mongoose');
const author = require('./author');

const commentSchema = new mongoose.Schema({
  text: String,
  author,
});

module.exports = mongoose.model('Comment', commentSchema);
