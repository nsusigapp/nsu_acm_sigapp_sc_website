const SequelizeAuto = require('sequelize-auto'); // package to auto generate models from database;
const auto = new SequelizeAuto('nsu_sigapp_sc', 'root', '123456'); 
// ^^ set credentials; [dbName,Username,Password] ^^

/**
 * This part below creates model files from existing database;
 * Created by writing SQL in .sql files;
 * Use whenever necessary to make work faster; but make sure to create associations manually;
 * Auto generating models have issues; Such as ommiting foreignKey constraints;
 * Those needs to be manually added wth associations to be able to mae INNER JOIN and other types of queries;
 */

// auto.run(function (err) {
//   if(err) 
//       throw err;

//   console.log(auto.tables); // table list
//   console.log(auto.foreignKeys); // foreign key list
// });

// ^^ // ^^ // ^^ //

// This index file can be used to access all the model files together; Instead of manually requireing them;
const db = require("./models/index");
// ^^ this file reads all of the models from models folder and imports them in this global db variable;

// import all models for associations
const { users: User, blog: Blog, forum: Forum,
    blog_comments: BlogCom, blog_like_track: BlogLike,
    events: Event, event_registered_people: EventRegPeople,
    forum_answer: ForumAnswer, reports: Report, roles: Role, forum_like_track: ForumLike } = require("./models/index");

// All associations are defined here; Associations are foreignKeys joining tables;
// Associations allows you to run JOIN queries [INNER JOIN/OUTER JOIN] the sequelize way;
//  INSTEAD OF RUNNING RAW QUERIES; Raw queries should be avoided whenever possible;
//  Unless absolutely necessary; DO not run raw queries;


User.hasMany(Blog);
User.hasMany(Forum);
User.hasMany(BlogCom);
User.hasMany(ForumAnswer);
User.hasMany(BlogLike);
// User.hasMany(ForumLike);
User.hasMany(Event);
User.hasMany(EventRegPeople);

User.hasMany(Report, {
    as: "reporter",
    foreignKey: "reported_by",
});

User.hasMany(Report, {
    as: "resolver",
    foreignKey: "resolved_by",
});

// One-To-One Relation;
User.belongsTo(Role, {
    as: "userRole",
    foreignKey: "role_id",
});

Blog.hasMany(BlogCom);
Blog.hasMany(BlogLike);

Blog.belongsTo(User, {
    as: "author",
    foreignKey: "author_id"
});

Forum.hasMany(ForumAnswer);
// Forum.hasMany(ForumLike);

Forum.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
});

ForumAnswer.belongsTo(Forum, {
    as: "answer",
    foreignKey: "forum_p_id"
});

ForumAnswer.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
});

BlogCom.belongsTo(Blog, {
    as: "comment",
    foreignKey: "blog_id",
});

BlogCom.belongsTo(User, {
    as: "comment_author",
    foreignKey: "user_id",
});

BlogLike.belongsTo(User, {
    as: "blog_liker",
    foreignKey: "user_id",
});

BlogLike.belongsTo(Blog, {
    as: "blog_liked",
    foreignKey: "blog_id",
});

ForumLike.belongsTo(Forum, {
    as: "forum_liked",
    foreignKey: "forum_id",
});

ForumLike.belongsTo(User, {
    as: "forum_liker",
    foreignKey: "user_id",
});

Event.belongsTo(User);
Event.hasMany(EventRegPeople);

EventRegPeople.belongsTo(Event);
EventRegPeople.belongsTo(User);

Report.belongsTo(User, {
    as: "reporter",
    foreignKey: "reported_by",
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
});

Report.belongsTo(User, {
    as: "resolver",
    foreignKey: "resolved_by",
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
});

db.sequelize.sync({
    force: true
})
    .then(res => {

        Role.bulkCreate([
            { role_name: "USER" },
            { role_name: "ADMIN" }
        ]);

    })
    .catch(err => console.log(err));