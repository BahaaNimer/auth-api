'use strict';
require('dotenv').config();

const POSTGRES_URI = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

const { Sequelize, DataTypes } = require('sequelize');

const userModel = require('../models/users');


let sequelizeOptions =
  process.env.NODE_ENV === "production"
    ?
    {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    } : {};

let sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);
let users = userModel(sequelize, DataTypes);


module.exports = {
  db: sequelize,
  Users: users,
};

