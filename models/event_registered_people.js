/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const EventRegPeople = sequelize.define('event_registered_people', {

	}, {
		tableName: 'event_registered_people'
	});

	EventRegPeople.associate = models => {

		EventRegPeople.belongsTo(models.events), {
			foreignKey: "event_id",
		};

		EventRegPeople.belongsTo(models.users, {
			foreignKey: "registered_id",
		});
	}


	return EventRegPeople;
};
