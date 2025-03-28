const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('StudentDB', 'admin', 'n4qh7mXTPn2656mR03m8', {
  host: 'student-admission-prod.cboje8x81jqo.us-east-1.rds.amazonaws.com',
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
