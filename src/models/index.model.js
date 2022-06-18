'use strict';
require('dotenv').config();

const POSTGRES_URI = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

const { Sequelize, DataTypes } = require('sequelize');

const clothes = require('../models/clothes/model');
const food = require('../models/food/model');
const Collection = require('../models/class-collection');
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

const foodModel = food(sequelize, DataTypes);
const clothesModel = clothes(sequelize, DataTypes);
let users = userModel(sequelize, DataTypes);

const foodCollection = new Collection(foodModel);
const clothesCollection = new Collection(clothesModel);

module.exports = {
  db: sequelize,
  Food: foodCollection,
  Clothes: clothesCollection,
  Users: users,
};

