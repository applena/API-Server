'use strict';

const productsSchema = require('./productsSchema');

class Products {

  constructor() {
  }

  get(id) {
    let queryObject = id ? {id} : {};
    return productsSchema.find(queryObject);
  }
  
  post(entry) {
    let newRecord = new productsSchema(entry);
    return newRecord.save();
  }

  put(id, entry) {
    let query = productsSchema.find({id});
    productsSchema.deleteOne({query});
    let newRecord = new productsSchema(entry);
    newRecord.id = id;
    return newRecord.save();
  }

  delete(id) {
    let query = productsSchema.find({id});
    productsSchema.deleteOne({query});
    return {};
  }

}

module.exports = Products;
