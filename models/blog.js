/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	
	const Blog =  sequelize.define('blog', {
		blog_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		blog_title: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		blog_description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		like_count: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		img_url: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'blog'
	});

	Blog.associate = models => {
		
		Blog.belongsTo(models.users, {
			foreignKey: "author_id",
		});

		Blog.hasMany(models.blog_comments, {
			foreignKey: "blog_id",
		});

		Blog.hasMany(models.blog_like_track, {
			foreignKey: "blog_id",
		});

	}

	return Blog;
};
