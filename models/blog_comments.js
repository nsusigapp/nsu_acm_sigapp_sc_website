/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {

	const BlogCom =  sequelize.define('blog_comments', {
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

	BlogCom.associate = models => {

		BlogCom.belongsTo(models.users, {
			foreignKey: "user_id",
		});

		BlogCom.belongsTo(models.blog, {
			foreignKey: "blog_id",
		});
	}

	return BlogCom;
};
