'use strict';

const supergoose = require('./supergoose');
let app = require ('../app');

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('api server', () => {
  describe('categories', () => {

    it('can post()', () => {
      let categories = new app.Categories();
      let object = {name:'boo'};
      let record = categories.post(object);
      expect(record.name).toEqual(object.name);
    });

    it('can get()', () => {
      let categories = new app.Categories();
      let object = {name:'boo'};
      let nextObj = {name:'JoJo'};
      categories.post(object);
      categories.post(nextObj);
      let record = categories.get();
      expect(record.length).toEqual(2);
    });

    it('can get(id)', () => {
      let categories = new app.Categories();
      let object = {name:'boo'};
      let nextObj = {name:'JoJo'};
      let item1 = categories.post(object);
      categories.post(nextObj);
      let records = categories.get(item1.id);
      console.log(records, item1, item1.id);
      expect(records[0].name).toEqual('boo');
    });

    it('can put(id, record)', () => {
      let categories = new app.Categories();
      let object = {name:'boo'};
      let nextObj = {name:'JoJo'};
      let item1 = categories.post(object);
      categories.post(nextObj);
      let records = categories.put(item1.id, {name:'billy'});
      expect(records.name).toEqual('billy');
    });

    it('can delete(id)', () => {
      let categories = new app.Categories();
      let object = {name:'boo'};
      let nextObj = {name:'JoJo'};
      categories.post(nextObj);
      let item = categories.post(object);
      let record = categories.delete(item.id);
      expect(record.length).toEqual(1);
    });
  });

  describe('products', () => {
    it('can get()', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};
      let products = new app.Products();
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
      let products = new app.Products();
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
      let products = new app.Products();
      return products.post(obj)
        .then(record => {
          expect(record.name).toEqual('Ilya');
        });
    });

    it('can put(id, entry)', () => {
      let obj = {name: 'Ilya', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};
      let nextObj = {name: 'Sue', display_name: 'Ily boo', description: 'boo boo bee boo', category: 'person'};
      let products = new app.Products();
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
      let products = new app.Products();
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