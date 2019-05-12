/* jshint indent: 1 */

const jwt= require("jsonwebtoken");

const { blog: Blog, forum: Forum } = require("./index");

module.exports = function(sequelize, DataTypes) {

	const User= sequelize.define('users', {
		u_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		nsu_id: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		first_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		user_name: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		nsu_email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		alt_email: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		avatar_url: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: 'img/sunglasses.png'
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'users'
	});

	User.generateAuthToken= payload => {
		return jwt.sign(payload, process.env.JWT_SECRET,{ expiresIn: process.env.EXPIRY_TIME });
	}
	
	return User;
};
