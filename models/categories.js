/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {

	const Category = sequelize.define('categories', {
		cat_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		cat_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		}
	}, {
		tableName: 'categories'
	});

	Category.associate = models => {

		Category.hasMany(models.blog_category, {
			foreignKey: "cat_id",
			onDelete: "SET NULL"
		});
	}

	return Category;

};
