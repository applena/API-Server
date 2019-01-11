'use strict';

const dataModel = require('./model');
const productsSchema = require('./productsSchema');

class Products extends dataModel {
}

module.exports = new Products(productsSchema);
