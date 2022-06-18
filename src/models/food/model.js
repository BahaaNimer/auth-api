'use strict';

const foodModel = (sequelize, DataTypes) => {
  const food = sequelize.define('food', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('vegetable', 'fruit', 'meat', 'dairy'),
      allowNull: false,
    }
  });
  return food;
}

module.exports = foodModel;