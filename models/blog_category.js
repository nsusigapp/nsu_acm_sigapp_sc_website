/* jshint indent: 1 */

/**
 * This is a joining table;
 * result of normalizing the database
 * It connects categories and blog together
 * Many-To-Many Relation as blogs can have many categories;
 */

module.exports = function(sequelize, DataTypes) {
	
	const BlogCat =  sequelize.define('blog_category', {

	}, {
		tableName: 'blog_category'
	});

	BlogCat.associate = models => {

		BlogCat.belongsTo(models.blog, {
			foreignKey: "blog_id",
			onDelete: "CASCADE"
		});

		BlogCat.belongsTo(models.categories, {
			foreignKey: "cat_id",
			onDelete: "SET NULL"
		});
	}

	return BlogCat;

};
