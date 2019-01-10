'use strict';

const schema = require('../models/categoriesSchema'); 

module.exports = (data) => {
  let valid = true;
  let record = {};

  for(let key in schema){
    //type check
    if(schema[key].required){
      if(data[key]){
        record[key] = data[key];
      } else {
        valid = false;
      }
    } else {
      record[key] = data[key];
    }
  }
  return valid ? record: undefined;
};