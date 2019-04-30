/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('reports', {
		report_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		content_link: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false
		}
	}, {
		tableName: 'reports'
	});
};
