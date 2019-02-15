'use strict';

class DataModel {

  constructor(schema) {
    this.schema = schema;
  }

  get(_id) {
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject);
  }
  
  post(record){
    let newRecord = new this.schema(record);
    return newRecord.save()
      .then(savedRecord => {
        Q.publish('database','create', {action:'create', collections: this.schema.modelName, id:newRecord.id});
        return savedRecord;
      })
      .catch(console.error());
  }

  put(_id, record){
    Q.publish('database', 'update', {action:'update', collection:this.schema.modelName, id:_id});
    return this.schema.updateOne(_id, record, {new:true});
  }

  delete(_id) {
    return this.schema.deleteOne({_id});
  }

}

module.exports = DataModel;
