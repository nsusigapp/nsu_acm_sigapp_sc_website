/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('categories', {
		cat_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		cat_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		}
	}, {
		tableName: 'categories'
	});
};
