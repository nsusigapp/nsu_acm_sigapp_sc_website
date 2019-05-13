/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {

	const ForumLike =  sequelize.define('forum_like_track', {
		action: {
			type: DataTypes.INTEGER(4),
			allowNull: false
		}
	}, {
		tableName: 'forum_like_track'
	});

	ForumLike.associate = models => {

		ForumLike.belongsTo(models.users, {
			foreignKey: "user_id",
		});

		ForumLike.belongsTo(models.forum, {
			foreignKey: "forum_id",
		});
	}

	return ForumLike;
};
