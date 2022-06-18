'use strict';

require('dotenv').config();
const { db } = require('./src/models/index.model');
const server = require('./src/server');

let PORT = process.env.PORT || 3050;

db.sync().then(() => {
  server.start(PORT);
});