/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('events', {
		event_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		event_type: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		event_name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		event_description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false
		},
		registered_count: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'events'
	});
};
