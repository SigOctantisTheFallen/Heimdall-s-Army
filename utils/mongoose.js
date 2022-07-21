require('dotenv').config();
const mongoose = require('mongoose');

module.exports = {
  init: () => {
    const dbOptions = {
      autoIndex: false,
      maxPoolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    };
    mongoose.connect(process.env.MONGO_URL, dbOptions);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
      console.log('Mongoose has sucessfully connected.');
    });

    mongoose.connection.on('err', err => {
      console.error(`Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose connection lost.');
    });
  }
}
