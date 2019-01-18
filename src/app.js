'use strict';


// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const router = express.Router();


/** 
 * mongo schema that verifies the user input and formats it correctly
 * @param {Object} object user entered entry
*/

let productsSchema = mongoose.model('products', mongoose.Schema({
  name: {type: String, required:true },
  display_name: { type: String},
  description: { type: String, required: false },
  category: { type: String, enum:['book', 'person', 'computer']},
}));

/** 
 * Products class with methods for getting all db entries, getting an entry by id, posting a new entry, put changes and entry, and delete removes an entry by id
 * @param {Object} object user entered entry
 * @param {string} id the uuid of the product
*/
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

let categoriesSchema = {
  id: {requird:true},
  name: {required:true},
};

/** 
 * Products class with methods for getting all db entries, getting an entry by id, posting a new entry, put changes and entry, and delete removes an entry by id
 * @param {Object} object user entered entry
 * @param {string} id the uuid of the product
*/

class Categories {

  constructor() {
    this.database = [];
  }

  get(_id) {
    let response = _id ? this.database.filter(record => {
      return record.id === _id;
    })[0] : this.database; 
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

const categories = new Categories();
const products = new Products();


/** 
 * return all the entries in the product database
 *
*/


// ROUTES
router.get('/api/v1/products', (request,response,next) => {
  // expects an array of objects back
  products.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
});

/** 
 * returns an entry that the user enters to the database along the products path
 *
*/

router.post('/api/v1/products', (request,response,next)=> {
  // expects the record that was just added to the database
  console.log('post product', request.body);
  products.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

/** 
 * returns an entry by ID that the user enters to the database along the products path
 * @param {string} id the id of the record
*/

router.get('/api/v1/products/:id', (request,response,next) => {
  // expects an array with one object in it
  products.get(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

/** 
* updates a record in the products db 
* @param {string} id the id of the record
* @param {Object} json object to be updated
*/

router.put('/api/v1/products/:id', (request,response,next) => {
  // expects the record that was just updated in the database
  products.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

/** 
 * deletes an entry by ID that the user enters to the database along the products path
 * @param {string} id the id of the record
*/

router.delete('/api/v1/products/:id', (request,response,next)=> {
  // Expects no return value (the resource should be gone)
  products.delete(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
});

/** 
 * return all the entries in the categories database
 *
*/

router.get('/api/v1/categories', (request,response,next) => {
  // expects an array of object to be returned from the model
  response.status(200).json(categories.get());
});

/** 
 * returns an entry that the user enters to the database along the categories path
 *
*/

router.post('/api/v1/categories', (request,response,next)=> {
  // expects the record that was just added to the database
  response.status(200).json(categories.post(request.body));
});

/** 
 * returns an entry by ID that the user enters to the database along the categories path
 * @param {string} id the id of the record
*/

router.get('/api/v1/categories/:id', (request,response,next) => {
  // expects an array with the one matching record from the model
  response.status(200).json(categories.get(request.params.id));
});

/** 
* updates a record in the categories db 
* @param {string} id the id of the record
* @param {Object} json object to be updated
*/

router.put('/api/v1/categories/:id', (request,response,next)=> {
  // expects the record that was just updated in the database
  let category = categories.put(request.params.id, request.body);
  response.status(200).json(category);
});


/** 
 * deletes an entry by ID that the user enters to the database along the categories path
 * @param {string} id the id of the record
*/

router.delete('/api/v1/categories/:id', (request,response,next) =>{
  // Expects no return value (resource was deleted)
  let category = categories.delete(request.params.id);
  response.status(200).json(category);
});

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(router);
// Catchalls
app.use('*', notFound);
app.use(errorHandler);



/** 
* runs a function to make sure that the data entered matches the format of database 
* @param {Object} json the json object to be added to the db
*/

function sanitize (data) {
  let valid = true;
  let record = {};

  for(let key in categoriesSchema){
    //type check
    if(categoriesSchema[key].required){
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
}


/** 
* returns a not found messaage when the user goes to a path that is not supported
* 
*/

function notFound (req,res,next) {
  let error = { error: 'Resource Not Found' };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
}

/** 
* returns a server error messaage when a server error occurs
* 
*/

function errorHandler (err, req, res, next) {
  console.error(err);
  let error = { error: err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
}

let isRunning = false;

module.exports = {
  server: app,
  start: (port) => {
    if( ! isRunning ) {
      app.listen(port, () => {
        isRunning = true;
        console.log(`Server Up on ${port}`);
      });
    }
    else {
      console.log('Server is already running');
    }
  },
  Categories: Categories,
  Products: Products,
};
