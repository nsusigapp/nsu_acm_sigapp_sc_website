const { users: User, blog: Blog, forum: Forum,
    blog_comments: BlogCom, blog_like_track: BlogLike,
    events: Event, event_registered_people: EventRegPeople,
    forum_answer: ForumAnswer, reports: Report, roles: Role, forum_like_track: ForumLike } = require("./models/index");



User.findAll({
    include: [{
        model: Blog,
        as: "author",
        required: true,
    }],
})
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err));