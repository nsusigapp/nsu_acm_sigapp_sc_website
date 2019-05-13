/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const BlogLike =  sequelize.define('blog_like_track', {
		action: {
			type: DataTypes.INTEGER(4),
			allowNull: false
		}
	}, {
		tableName: 'blog_like_track'
	});

	BlogLike.associate = models => {

		BlogLike.belongsTo(models.users, {
			foreignKey: "user_id",
		});

		BlogLike.belongsTo(models.blog, {
			foreignKey: "blog_id",
		});
	}

	return BlogLike;
};
