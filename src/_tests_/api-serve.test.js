'use strict';

const supergoose = require('./supergoose');
let categories = require('../models/categoriesModel');
let products = require('../models/productsModel');

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('api server', () => {
  describe('categories', () => {

    it('can post()', (done) => {
      let object = {name:'boo', display_name:'bob'};
      categories.post(object)
        .then((record) => {
          expect(record.name).toEqual(object.name);
          done();
        });
    });

    it('can get()', (done) => {
      let object = {name:'boo', display_name:'bob'};
      let nextObj = {name:'JoJo', display_name:'sue'};
      categories.post(object);
      categories.get()
        .then((record) => {
          expect(record.length).toEqual(1);
          done();
        });
    });

    it('can get(id)', (done) => {
      let object = {name:'boo', display_name:'bob'};
      let nextObj = {name:'JoJo', display_name:'sue'};
      let item1 = categories.post(object)
        .then(record => {
          categories.get(item1.id)
            .then((records) => {
              expect(records[0].name).toEqual('boo');
              done();
            });
          

        });
    });

    it('can put(id, record)', () => {
      let object = {name:'boo', display_name:'bob'};
      let nextObj = {name:'JoJo', display_name:'sue'};
      let item1 = categories.post(object)
        .then(record => {
          categories.post(nextObj)
            .then(records => {
              categories.put(item1.id, {name:'billy'})
                .then(record => {

                  expect(records.name).toEqual('billy');
                });

            });

        });
    });

    it('can delete(id)', () => {
      let object = {name:'boo', display_name:'bob'};
      let nextObj = {name:'JoJo', display_name:'sue'};
      categories.post(nextObj)
        .then(record => {
          let item = categories.post(object)
            .then(rec => {
              categories.delete(item.id)
                .then(data => {
                  expect(record.length).toEqual(1);

                });
            });
        });
    });
  });

  describe('products', () => {
    it('can get()', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};
      products.post(obj)
        .then(record => {
          products.get()
            .then(arr => {
              expect(arr[0].name).toEqual('Ilya');
            });
        });
    });

    it('can get(id)', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      let entry = products.post(obj)
        .then(record => {
          products.get(entry.id)
            .then(arr => {
              expect(arr[0].name).toEqual('Ilya');
            });
        });
    });

    it('can post(entry)', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      return products.post(obj)
        .then(record => {
          expect(record.name).toEqual('Ilya');
        });
    });

    it('can put(id, entry)', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};
      let nextObj = {name: 'Sue', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      let entry = products.post(obj)
        .then(record => {
          products.put(entry.id, nextObj)
            .then(newRecord => {
              expect(newRecord.name).toEqual('Sue');
            });
        });
    });

    it('delete(id)', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};

      let entry = products.post(obj)
        .then(record => {
          products.delete(entry.id)
            .then(data => {
              expect(data.length).toEqual(0);
            });
        });
    });
  });
});