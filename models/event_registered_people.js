/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('event_registered_people', {
		event_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'events',
				key: 'event_id'
			}
		},
		registered_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'users',
				key: 'u_id'
			}
		}
	}, {
		tableName: 'event_registered_people'
	});
};
