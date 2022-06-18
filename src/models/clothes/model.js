'use strict';

const clothesModel = (sequelize, DataTypes) => {
  const clothes = sequelize.define('clothes', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  return clothes;
}

module.exports = clothesModel;