/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('forum_like_track', {
		action: {
			type: DataTypes.INTEGER(4),
			allowNull: false
		}
	}, {
		tableName: 'forum_like_track'
	});
};
