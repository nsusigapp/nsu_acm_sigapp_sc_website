/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('forum_reply', {
		reply_id: {
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
		forum_p_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'forum',
				key: 'f_post_id'
			}
		},
		reply_content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'forum_reply'
	});
};
