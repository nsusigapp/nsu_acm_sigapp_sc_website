/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('forum', {
		f_post_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		f_post_title: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		f_post_description: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'forum'
	});
};
