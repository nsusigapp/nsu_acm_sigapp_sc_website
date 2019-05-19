/* jshint indent: 1 */

/**
 * This is a joining table;
 * result of normalizing the database
 * It connects categories and forum post together
 * Many-To-Many Relation as blogs can have many categories;
 */

module.exports = function(sequelize, DataTypes) {

	const ForumTag = sequelize.define('forum_tag', {
		
	}, {
		tableName: 'forum_tag'
	});

	ForumTag.associate = models => {

		ForumTag.belongsTo(models.forum, {
			foreignKey: "f_post_id",
			onDelete: "CASCADE"
		});

		ForumTag.belongsTo(models.tags, {
			foreignKey: "tag_id",
			onDelete: "SET NULL"
		});
	}

	return ForumTag;
};
