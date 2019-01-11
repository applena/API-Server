'use strict';

// const products = require('./productsSchema');
const mongoose = require('mongoose');

//allow virtual connection
const categories = mongoose.Schema({
  name: { type: String, required:true },
}, {toObject:{virtuals:true}, toJSON:{virtuals:true}});

// made a virtural field called products that adds a key of products to the categories object
categories.virtual('products', {
  ref: 'products',
  localField: 'name', 
  foreignField: 'category', 
  justOne: false,
});

//hook or middleware for mongoose
categories.pre('find', function() {
  //when I call a .find, this will run before the querry
  try {
    this.populate('products');//this will populate the virtual products
  }
  catch(errors) { console.log('Find Error', errors);}
});

module.exports = mongoose.model('categories', categories);

// [options.ref] «string|function» if ref is not nullish, this becomes a populated virtual
// [options.localField] «string|function» the local field to populate on if this is a populated virtual.
// [options.foreignField] «string|function» the foreign field to populate on if this is a populated virtual.
// [options.justOne=false] «boolean» by default, a populated virtual is an array. If you set justOne, the populated virtual will be a single doc or null.
// [options.getters=false] «boolean» if you set this to true, Mongoose will call any custom getters you defined on this virtual