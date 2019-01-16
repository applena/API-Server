![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Project Name

### Author: Student/Group Name

### Links and Resources
* [repo](https://github.com/applena/API-Server)
* [travis](https://travis-ci.com/applena/API-Server.svg?branch=master)
* [heroku - pretty code](https://eivy-lab-13-pretty.herokuapp.com) (when applicable)
* [heroku - ulgy code](https://eivy-lab-13-ulgy.herokuapp.com/) (when applicable)
* [travis - lab 14](https://travis-ci.com/applena/API-Server.svg?branch=master)
* [heroku - master](https://eivy-lab-14.herokuapp.com/)

#### Documentation
* [swagger](./docs/swagger.json) (API assignments only)
* [jsdoc](./docs/jsdoc.md) (All assignments)

### Modules
#### `app.js`
##### Exported Values and Methods
* app.js runs an api server that can GET, POST, PUT, and DELETE to two paths: /categories and /products. It sores the entries in both a local database and a mongo database

### Setup
#### `.env` requirements
* `PORT` - 8080
* `MONGODB_URI` - `mongodb://localhost:27017`

#### Running the app
* run `npm start` - this will strat the index file which will run the app.js
* in a separate terminal, run a mongo DB on port 27017 
* Endpoint: `/api/v1/categories`
  * Returns a JSON object with categories in it.
* Endpoint: `/api/v1/products`
  * Returns a JSON object with products in it
  
#### Tests
* to test, run `npm test` or click on the travis link at the top of the page
* I asserted that all paths and functions work with both the ulgy and pretty code

