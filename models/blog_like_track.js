/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('blog_like_track', {
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'users',
				key: 'u_id'
			}
		},
		blog_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'blog',
				key: 'blog_id'
			}
		},
		action: {
			type: DataTypes.INTEGER(4),
			allowNull: false
		}
	}, {
		tableName: 'blog_like_track'
	});
};
