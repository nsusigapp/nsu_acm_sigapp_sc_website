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
    forum_reply: ForumReply, reports: Report } = require("./models/index");

User.hasMany(Blog);
User.hasMany(Forum);
User.hasMany(BlogCom);
User.hasMany(ForumReply);
User.hasMany(BlogLike);
User.hasMany(Event);
User.hasMany(EventRegPeople);
User.hasMany(Report);

Blog.hasMany(BlogCom);
Blog.hasMany(BlogLike);
Blog.belongsTo(User);

Forum.hasMany(ForumReply);
Forum.belongsTo(User);

ForumReply.belongsTo(Forum);
ForumReply.belongsTo(User);

BlogCom.belongsTo(Blog);
BlogCom.belongsTo(User);

BlogLike.belongsTo(User);
BlogLike.belongsTo(Blog);

Event.belongsTo(User);
Event.hasMany(EventRegPeople);

EventRegPeople.belongsTo(Event);
EventRegPeople.belongsTo(User);

Report.belongsTo(User);


db.sequelize.sync();