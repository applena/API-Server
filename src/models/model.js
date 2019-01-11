'use strict';

const productsSchema = require('./productsSchema');

class DataModel {

  constructor() {
    this.schema = productsSchema;
  }

  get(id) {
    let queryObject = id ? {id} : {};
    return this.schema.find(queryObject);
  }
  
  post(entry) {
    let newRecord = new this.schema(entry);
    return newRecord.save();
  }

  put(id, entry) {
    let query = this.schema.find({id});
    this.schema.deleteOne({query});
    let newRecord = new this.schema(entry);
    newRecord.id = id;
    return newRecord.save();
  }

  delete(id) {
    let query = this.schema.find({id});
    this.schema.deleteOne({query});
    return {};
  }

}

module.exports = DataModel;
