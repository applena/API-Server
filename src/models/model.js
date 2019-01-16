'use strict';

class DataModel {

  constructor(schema) {
    this.schema = schema;
  }

  get(_id) {
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject);
  }
  
  post(entry) {
    let newRecord = new this.schema(entry);
    return newRecord.save();
  }

  put(_id, entry) {
    return this.schema.updateOne({_id}, entry);
  }

  delete(_id) {
    return this.schema.deleteOne({_id});
  }

}

module.exports = DataModel;
