/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
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
			allowNull: false
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
		join_date: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'users'
	});
};
