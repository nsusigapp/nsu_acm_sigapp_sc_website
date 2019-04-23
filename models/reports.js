/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('reports', {
		report_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		reported_by: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'users',
				key: 'u_id',
			}
		},
		content_link: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false
		},
		resolved_by: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'users',
				key: 'u_id',
			}
		}
	}, {
		tableName: 'reports'
	});
};
