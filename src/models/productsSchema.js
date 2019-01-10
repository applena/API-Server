'use strict';

const mongoose = require('mongoose');

const products = mongoose.Schema({
  name: {type: String, required:true },
  display_name: { type: String, required: true},
  description: { type: String, required: false },
  category: { type: String, required: true, enum:['book', 'person', 'computer']},
});

module.exports = mongoose.model('products', products);