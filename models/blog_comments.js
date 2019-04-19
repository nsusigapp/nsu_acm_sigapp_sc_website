/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('blog_comments', {
		com_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		com_content: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'blog_comments'
	});
};
