'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tutor extends Model {
    static associate(models) {}
  }
  Tutor.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    bio: DataTypes.TEXT,
    hourlyRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
    }
  }, {
    sequelize,
    modelName: 'Tutor',
  });
  return Tutor;
};