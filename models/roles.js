/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const Role = sequelize.define('roles', {
		role_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		role_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		}
	}, {
		tableName: 'roles'
	});

	Role.associate = models => {
		
		Role.hasMany(models.users, {
			foreignKey: "role_id",
		})
	}

	return Role;
};
