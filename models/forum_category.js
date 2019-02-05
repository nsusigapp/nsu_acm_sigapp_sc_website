/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('forum_category', {
		f_post_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'forum',
				key: 'f_post_id'
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
		tableName: 'forum_category'
	});
};
