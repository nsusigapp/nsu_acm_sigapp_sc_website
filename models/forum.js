/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const Forum =  sequelize.define('forum', {
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

	Forum.associate = models => {

		Forum.belongsTo(models.users, {
			foreignKey: "author_id",
		});

		Forum.hasMany(models.forum_answer, {
			foreignKey: "forum_p_id"
		});

		Forum.hasMany(models.forum_like_track, {
			foreignKey: "forum_id",
		});

		Forum.hasMany(models.forum_category, {
			foreignKey: "f_post_id",
			onDelete: "CASCADE"
		});
	}

	return Forum;
};
