'use strict';

module.exports = (req, res, next) => {
  let modelName = req.params.model;
  // console.log(`loading ../models/${modelName}.js`);
  req.model = require(`../models/${modelName}Model.js`);
  next();
};