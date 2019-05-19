/* jshint indent: 1 */

/**
 * This is a joining table;
 * result of normalizing the database
 * It connects categories and blog together
 * Many-To-Many Relation as blogs can have many categories;
 */

module.exports = function(sequelize, DataTypes) {
	
	const BlogTag =  sequelize.define('blog_tag', {

	}, {
		tableName: 'blog_tag'
	});

	BlogTag.associate = models => {

		BlogTag.belongsTo(models.blog, {
			foreignKey: "blog_id",
			onDelete: "CASCADE"
		});

		BlogTag.belongsTo(models.tags, {
			foreignKey: "tag_id",
			onDelete: "SET NULL"
		});
	}

	return BlogTag;

};
