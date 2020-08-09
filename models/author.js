const mongoose = require('mongoose');

const author = {
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  username: String,
};

module.exports = author;
