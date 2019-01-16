'use strict';


const supergoose = require('./supergoose');
let categories = require('../models/categories');
let products = require('../models/products');

const rootDir = process.cwd();
const {server} = require(`${rootDir}/src/app.js`);
const mockRequest = supergoose.server(server);


beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('api server', () => {

  describe('categories', () => {

    let recordId;
    it('can post()', (done) => {
      let object = {name:'boo', display_name:'bob'};
      categories.post(object)
        .then((record) => {
          recordId = record.id;
          expect(record.name).toEqual(object.name);
          done();
        });
    });

    it('can get()', (done) => {
      categories.get()
        .then((record) => {
          expect(record.length).toEqual(1);
          done();
        });
    });

    it('can get(id)', (done) => {
      categories.get(recordId)
        .then((getRecords) => {
          expect(getRecords[0].name).toEqual('boo');
          done();
        });
    });

    it('can put(id, record)', (done) => {
      categories.put(recordId, {name:'billy'})
        .then(result => {
          expect(result.nModified).toEqual(1);
          categories.get(recordId).then((item1Changed)=>{
            console.log({item1Changed});
            expect(item1Changed.name).toEqual('billy');
            done();
          });
        });
    });

    it('can delete(id)', (done) => {
      categories.delete(recordId)
        .then(data => {
          console.log('delete', {data});
          expect(data.length).toEqual(1);
          done();
        });
    });
  });

  describe('products', (done) => {
    it('can get()', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};
      products.post(obj)
        .then(record => {
          products.get()
            .then(arr => {
              expect(arr[0].name).toEqual('Ilya');
              done();
            });
        });
    });

    it('can get(id)', (done) => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      let entry = products.post(obj)
        .then(record => {
          products.get(entry.id)
            .then(arr => {
              expect(arr[0].name).toEqual('Ilya');
              done();
            });
        });
    });

    it('can post(entry)', (done) => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      return products.post(obj)
        .then(record => {
          expect(record.name).toEqual('Ilya');
          done();
        });
    });

    it('can put(id, entry)', (done) => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};
      let nextObj = {name: 'Sue', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      let entry = products.post(obj)
        .then(record => {
          products.put(entry.id, nextObj)
            .then(newRecord => {
              expect(newRecord.name).toEqual('Sue');
              done();
            });
        });
    });

    it('delete(id)', (done) => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      let entry = products.post(obj)
        .then(record => {
          products.delete(entry.id)
            .then(data => {
              expect(data.length).toEqual(0);
              done();
            });
        });
    });

    it('should respond with a 404 on an invalid route', (done) => {

      return mockRequest
        .get('/foo')
        .then(results => {
          expect(results.status).toBe(404);
          done();
        });

    });

    it('should respond with a 404 on an invalid method', (done) => {

      return mockRequest
        .post('/api/v1/notes/12')
        .then(results => {
          expect(results.status).toBe(404);
          done();
        });

    });

    it('should respond properly on request to /api/v1/categories', (done) => {

      return mockRequest
        .get('/api/v1/categories')
        .then(results => {
          expect(results.status).toBe(200);
          done();
        });

    });

    it('should be able to post to /api/v1/categories', (done) => {

      let obj = {name:'test'};

      return mockRequest
        .post('/api/v1/categories')
        .send(obj)
        .then(results => {
          expect(results.status).toBe(200);
          expect(results.body.title).toEqual(obj.title);
          done();
        });

    });

    it('should be able to post to /api/v1/products', (done)  => {

      let obj = {name:'John', display_name:'R'};

      return mockRequest
        .post('/api/v1/products')
        .send(obj)
        .then(results => {
          expect(results.status).toBe(200);
          expect(results.body.team).toEqual(obj.team);
          done();
        });

    });


    it('following a post to products, should find a single record', (done) => {

      let obj = {name:'John', display_name:'R'};

      return mockRequest
        .post('/api/v1/products')
        .send(obj)
        .then(results => {
          return mockRequest.get(`/api/v1/products/${results.body._id}`)
            .then(list => {
              expect(list.status).toBe(200);
              expect(list.body.categroies).toEqual(obj.categroies);
              done();
            });
        });

    });
  });
});
