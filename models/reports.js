/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const Report = sequelize.define('reports', {
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


	Report.associate = models => {

		Report.belongsTo(models.users, {
			as: "reporter",
			foreignKey: "reported_by",
			onDelete: "SET NULL",
			onUpdate: "CASCADE"
		});
		
		Report.belongsTo(models.users, {
			as: "resolver",
			foreignKey: "resolved_by",
			onDelete: "SET NULL",
			onUpdate: "CASCADE"
		});
		
	}

	return Report;
};
