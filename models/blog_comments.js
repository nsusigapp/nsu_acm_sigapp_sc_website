/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('blog_comments', {
		com_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		author_id: {
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
		com_content: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'blog_comments'
	});
};
