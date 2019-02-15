'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const q = require('./src/lib/publisher.js');

const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
global.Q = new q();

require('./src/app.js').start(process.env.PORT);

