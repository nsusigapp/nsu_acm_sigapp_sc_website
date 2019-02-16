/* jshint indent: 1 */

const jwt= require("jsonwebtoken");
const config= require("config");

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
			primaryKey: true
		},
		role_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'roles',
				key: 'role_id'
			}
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
			primaryKey: true
		},
		nsu_email: {
			type: DataTypes.STRING(255),
			allowNull: false
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
			allowNull: false
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'users'
	});

	User.generateAuthToken= function(payload){
		return jwt.sign(payload,config.get("auth")["jwtsecret"],{ expiresIn: config.get("auth")["expiresIn"] });
	}

	return User;
};
