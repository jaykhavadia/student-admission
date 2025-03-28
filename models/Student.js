const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('StudentDB', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

const Student = sequelize.define('Student', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: false
  },
  work_Experience: {
    type: DataTypes.INTEGER
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Student;
