/*
 	Define the authentification system and the user model.

	***Password are stored encrypted using Bcrypt algorithm.
*/
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize('StudentDB', 'admin', 'g6MwPe%s', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// define the model User to be added in the database
module.exports = User;

/*
	CREATE ADMIN ACCOUNT
*/
// async function createAdminUser() {
//     try {
//         var adminUser = {
//             username: 'admin',
//             password: 'admin'
//         };
//         await createUser(adminUser);
//     } catch (error) {
//         console.error("Error creating admin user:", error);
//     }
// }

// createAdminUser();


/*
	Create new User in the system
*/
// hash the password when creating a new user in the database
async function createUser(newUser) {
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  return await User.create(newUser);
}
module.exports.createUser = createUser;

module.exports.getUserByUsername = async function (username) {
  return await User.findOne({ where: { username } });
}

module.exports.getUserById = async function (id) {
  return await User.findByPk(id);
}

module.exports.comparePassword = async function (candidatePassword, hash) {
  return await bcrypt.compare(candidatePassword, hash);
};
