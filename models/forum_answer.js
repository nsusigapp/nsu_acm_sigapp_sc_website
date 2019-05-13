/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const ForumAnswer =  sequelize.define('forum_answer', {
		answer_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		answer_content: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'forum_answer'
	});

	ForumAnswer.associate = models => {

		ForumAnswer.belongsTo(models.users, {
			foreignKey: "author_id",
		});

		ForumAnswer.belongsTo(models.forum, {
			foreignKey: "forum_p_id"
		});
	}

	return ForumAnswer;
};
