/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {

	const Quotes = sequelize.define('quotes', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true

		},
		quote_text: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'quotes'
	});

	return Quotes;
};
