/* jshint indent: 1 */

/**
 * Global Site News Model;
 * Used to enter site news from the admin panel
 * If news exists, it'll be shown as sticky above navbar
 */

module.exports = function(sequelize, DataTypes) {

	const News = sequelize.define('news', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		news_text: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'news'
	});

	return News;
};
