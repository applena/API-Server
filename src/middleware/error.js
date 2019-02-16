'use strict';

module.exports = (err, req, res, next) => {
  console.error(err);
  let error = { error: err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  throw err;
  //res.end();
};