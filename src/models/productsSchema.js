'use strict';

const mongoose = require('mongoose');

const products = mongoose.Schema({
  name: {type: String, required:true },
  display_name: { type: String, required: true},
  description: { type: String, required: false },
  updatedAt: { type: Date, required: false },
  category: { type: String, required: false, enum:['book', 'person', 'computer']},
});

//hook or middleware for mongoose
products.pre('updateOne', function() {
  this.updateOne({},{ $set: { updatedAt: new Date() } });
  
});

module.exports = mongoose.model('products', products);