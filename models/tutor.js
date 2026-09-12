'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tutor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
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