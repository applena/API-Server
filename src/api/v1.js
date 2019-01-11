'use strict';

const express = require('express');
const modelFinder = require('../middleware/model-finder.js');

const router = express.Router();
router.param('model', modelFinder);

// ROUTES
router.get('/api/v1/:model', handleGetAll);
router.post('/api/v1/:model', handlePost);

router.get('/api/v1/:model/:id', handleGetOne);
router.put('/api/v1/:model/:id', handlePut);
router.delete('/api/v1/:model/:id', handleDelete);

// FUNCTIONS
function handleGetAll(request,response,next) {
  // expects an array of objects back
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

function handleGetOne(request,response,next) {
  // expects an array with one object in it
  let id = request.params.id;
  let count;
  request.model.get(id)
    .then( result => {
      count = result.length;
      response.status(200).json({count, result});
    })
    .catch( next );
}

function handlePost(request,response,next) {
  // expects the record that was just added to the database
  request.model.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}


function handlePut(request,response,next) {
  // expects the record that was just updated in the database
  request.model.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function handleDelete(request,response,next) {
  // Expects no return value (the resource should be gone)
  request.model.delete(request.params.id)
    .then( result => response.status(200).json({status: 'success'}) )
    .catch( next );
}

module.exports = router;
