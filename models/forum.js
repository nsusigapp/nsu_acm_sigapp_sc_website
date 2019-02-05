/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('forum', {
		f_post_id: {
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
		f_post_title: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		f_post_description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'forum'
	});
};
