'use strict';

const products = require('./productsSchema');
const mongoose = require('mongoose');

//allow virtual connection
const categories = mongoose.Schema({
  name: { type: String, required:true },
}, {toObject:{virtuals:true}, toJSON:{virtuals:true}});

// made a virtural field called players that adds a key of players to the team object
categories.virtual('products', {
  ref: 'products',
  localField: 'name', 
  foreignField: 'category', 
  justsOne: false,
});

//hook or middleware for mongoose
products.pre('find', function() {
  //when I call a .find, this will run before the querry
  try {
    this.populate('products');//this will populate the virtual products
  }
  catch(errors) { console.lgo('Find Error', errors);}
});

module.exports = mongoose.model('categories', categories);