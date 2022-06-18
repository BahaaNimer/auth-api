'use strict';
require('dotenv').config();
const express = require('express');

const notFoundHandler = require('./error/404');
const errorHandler = require('./error/500');
const logger = require('./middleware/logger');

const userRoutes = require('./routes/crud.route');
const authRouter = require('./routes/auth.route');

const app = express();
app.use(express.json());

app.use(logger);

app.use('/api/v1', userRoutes);
app.use('/api/v2', authRouter);

app.use('*', notFoundHandler);
app.use(errorHandler);

function start(PORT) {
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
}

module.exports = {
  app: app,
  start: start
};