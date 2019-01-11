'use strict';

const mongoose = require('mongoose');

const products = mongoose.Schema({
  name: {type: String, required:true },
  display_name: { type: String, required: true},
  description: { type: String, required: false },
  category: { type: String, required: false, enum:['book', 'person', 'computer']},
});

// //hook or middleware for mongoose
// products.pre('find', function() {
//   //when I call a .find, this will run before the querry
//   try {
//     this.populate('products');//this will populate the virtual products
//   }
//   catch(errors) { console.lgo('Find Error', errors);}
// });

module.exports = mongoose.model('products', products);