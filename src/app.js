'use strict';


// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const router = express.Router();


let productsSchema = mongoose.model('products', mongoose.Schema({
  name: {type: String, required:true },
  display_name: { type: String, required: true},
  description: { type: String, required: false },
  category: { type: String, required: true, enum:['book', 'person', 'computer']},
}));

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

const categories = new Categories();
const products = new Products();





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

router.post('/api/v1/products', (request,response,next)=> {
  // expects the record that was just added to the database
  products.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

router.get('/api/v1/products/:id', (request,response,next) => {
  // expects an array with one object in it
  products.get(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

router.put('/api/v1/products/:id', (request,response,next) => {
  // expects the record that was just updated in the database
  products.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

router.delete('/api/v1/products/:id', (request,response,next)=> {
  // Expects no return value (the resource should be gone)
  products.delete(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
});

router.get('/api/v1/categories', (request,response,next) => {
  // expects an array of object to be returned from the model
  categories.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
});

router.post('/api/v1/categories', (request,response,next)=> {
  // expects the record that was just added to the database
  categories.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

router.get('/api/v1/categories/:id', (request,response,next) => {
  // expects an array with the one matching record from the model
  categories.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
});

router.put('/api/v1/categories/:id', (request,response,next)=> {
  // expects the record that was just updated in the database
  categories.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

router.delete('/api/v1/categories/:id', (request,response,next) =>{
  // Expects no return value (resource was deleted)
  categories.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
});

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Catchalls
app.use('*', notFound);
app.use(errorHandler);



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

function notFound (req,res,next) {
  let error = { error: 'Resource Not Found' };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
}

function errorHandler (err, req, res, next) {
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
