module.exports = function(sequelize, DataTypes) {
	return sequelize.define('forum_answer_like', {
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'users',
				key: 'u_id'
			}
		},
		ans_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'forum_answer',
				key: 'answer_id'
			}
		},
		action: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		}
	}, {
		tableName: 'forum_answer_like'
	});
};
