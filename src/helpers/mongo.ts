import mongoose = require('mongoose');
import config = require('../config');

function connect(): Promise<void> {
  mongoose.Promise = global.Promise;
  return mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Successfully connected to the database");
  }).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });
}

export = {
  connect
}