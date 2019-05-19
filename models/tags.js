/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {

	const Tag = sequelize.define('tags', {
		tag_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		tag_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		}
	}, {
		tableName: 'tags'
	});

	Tag.associate = models => {

		Tag.hasMany(models.blog_tag, {
			foreignKey: "tag_id",
			onDelete: "SET NULL"
		});

		Tag.hasMany(models.forum_tag, {
			foreignKey: "tag_id",
			onDelete: "SET NULL"
		});
	}

	return Tag;

};
