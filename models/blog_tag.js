/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('blog_tag', {
		blog_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'blog',
				key: 'blog_id'
			}
		},
		tag_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'tags',
				key: 'tag_id'
			}
		}
	}, {
		tableName: 'blog_tag'
	});
};
