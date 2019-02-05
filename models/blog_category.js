/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('blog_category', {
		blog_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'blog',
				key: 'blog_id'
			}
		},
		cat_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'categories',
				key: 'cat_id'
			}
		}
	}, {
		tableName: 'blog_category'
	});
};
