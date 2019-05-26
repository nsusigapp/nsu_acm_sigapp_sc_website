/* jshint indent: 1 */

const jwt= require("jsonwebtoken");

const { blog: Blog, forum: Forum } = require("./index");

module.exports = function(sequelize, DataTypes) {

	const User = sequelize.define('users', {
		u_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		nsu_id: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		first_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		user_name: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		nsu_email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		alt_email: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		avatar_url: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: 'img/sunglasses.png'
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false
		},
	}, {
		tableName: 'users'
	});

	User.associate = models => {

		User.belongsTo(models.roles, {
			foreignKey: {
				name: "role_id",
				allowNull: false,
			}
		});

		// id of who created the blog post;
		User.hasMany(models.blog, {
			foreignKey: "author_id",
		});

		// id of who created the forum post
		User.hasMany(models.forum, {
			foreignKey: "author_id",
		});

		// id of who made the blog comment;
		User.hasMany(models.blog_comments, {
			foreignKey: "user_id",
		});

		// id of who made the answer;
		User.hasMany(models.forum_answer, {
			foreignKey: "author_id",
		});

		// id of who liked the forum;
		User.hasMany(models.forum_like_track, {
			foreignKey: "user_id",
		});

		// who liked the post; id of liker
		User.hasMany(models.blog_like_track, {
			foreignKey: "user_id",
		});

		// user_id is who created the event; id of the creator;
		User.hasMany(models.events, {
			foreignKey: "user_id",
		});

		User.hasMany(models.reports, {
			as: "reporter",
			foreignKey: "reported_by",
		});
		
		User.hasMany(models.reports, {
			as: "resolver",
			foreignKey: "resolved_by",
		});

		User.hasMany(models.event_registered_people, {
			foreignKey: "event_id",
		});

		User.hasMany(models.session, {
			foreignKey: "u_id",
		});

	};

	User.generateAuthToken= payload => {
		return jwt.sign(payload, process.env.JWT_SECRET,{ expiresIn: process.env.EXPIRY_TIME });
	}
	
	return User;
};
