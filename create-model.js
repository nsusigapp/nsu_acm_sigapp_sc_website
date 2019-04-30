const SequelizeAuto = require('sequelize-auto')
const auto = new SequelizeAuto('nsu_sigapp_sc', 'root', '123456');

// auto.run(function (err) {
//   if(err) 
//       throw err;

//   console.log(auto.tables); // table list
//   console.log(auto.foreignKeys); // foreign key list
// });

const db = require("./models/index");

const { users: User, blog: Blog, forum: Forum,
    blog_comments: BlogCom, blog_like_track: BlogLike,
    events: Event, event_registered_people: EventRegPeople,
    forum_reply: ForumReply, reports: Report, roles: Role } = require("./models/index");

User.hasMany(Blog);
User.hasMany(Forum);
User.hasMany(BlogCom);
User.hasMany(ForumReply);
User.hasMany(BlogLike);
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

Blog.hasMany(BlogCom);
Blog.hasMany(BlogLike);

Blog.belongsTo(User, {
    as: "author",
    foreignKey: "author_id"
});

Forum.hasMany(ForumReply);

Forum.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
});

ForumReply.belongsTo(Forum, {
    as: "reply",
    foreignKey: "forum_p_id"
});

ForumReply.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
});

BlogCom.belongsTo(Blog);
BlogCom.belongsTo(User);

BlogLike.belongsTo(User);
BlogLike.belongsTo(Blog);

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
            { role_name: "User" },
            { role_name: "Admin" }
        ]);

    })
    .catch(err => console.log(err));