const { users: User, blog: Blog, forum: Forum,
    blog_comments: BlogCom, blog_like_track: BlogLike, forum_category: ForumCat,
    events: Event, event_registered_people: EventRegPeople,
    forum_answer: ForumAnswer, reports: Report, roles: Role, forum_like_track: ForumLike } = require("./models/index");

User.findAll({
    attributes: ["user_name"],
    include: [{
        attributes: ["f_post_title", "like_count", "createdAt"],
        model: Forum,
        required: true,
        include: [{
            model: ForumCat,
            required: true
        }]
    }],
})
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err));

// const sharp = require("sharp");
// const fs = require("fs");

// const imageStream = fs.createReadStream("login-img.jpg");

// sharp("abir-pp.jpg")
// .resize(300,300)
// .jpeg({quality: 80})
// .toFile("./new_img-2.jpg", {

// })
// .then(res => {
//     console.log(res)
// }).catch(err => console.log(err));