const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('StudentDB', 'admin', 'g6MwPe%s', {
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
