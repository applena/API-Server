'use strict';

const uuid = require('uuid/v4');
const sanitize = require('../lib/sanitize');

class Categories {

  constructor() {
    this.database = [];
  }

  get(_id) {
    let response = _id ? this.database.filter(record => {
      return record.id === _id;
    }) : this.database; 
    return response;
  }
  
  post(record) {
    record.id = uuid();
    let entry = sanitize(record);
    if(entry.id) { this.database.push(entry);}
    return entry;
  }

  put(_id, record) {
    let entry = sanitize(record);
    entry.id = _id;
    this.database.filter(entry => {
      return entry.id !== _id;
    });
    this.database.push(entry);
    return entry;
  }

  delete(_id) {
    let response = this.database.filter(record => {
      return record.id !== _id;
    });
    return response;
  }

}

module.exports = Categories;
