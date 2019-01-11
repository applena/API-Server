'use strict';

const dataModel = require('./model');
const categoriesSchema = require('./categoriesSchema');

class Categories extends dataModel {
}

module.exports = new Categories(categoriesSchema);
