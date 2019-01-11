'use strict';

module.exports = (req, res, next) => {
  let modelName = req.params.model;
  req.model = require(`../models/${modelName}.js`);
  next();
};