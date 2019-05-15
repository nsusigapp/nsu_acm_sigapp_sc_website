/* jshint indent: 1 */

/**
 * This is a joining table;
 * result of normalizing the database
 * It connects categories and forum post together
 * Many-To-Many Relation as blogs can have many categories;
 */

module.exports = function(sequelize, DataTypes) {

	const ForumCat = sequelize.define('forum_category', {
		
	}, {
		tableName: 'forum_category'
	});

	ForumCat.associate = models => {

		ForumCat.belongsTo(models.forum, {
			foreignKey: "f_post_id",
			onDelete: "CASCADE"
		});

		ForumCat.belongsTo(models.categories, {
			foreignKey: "cat_id",
			onDelete: "SET NULL"
		});
	}

	return ForumCat;
};
