const { users: User, blog: Blog, forum: Forum,
    blog_comments: BlogCom, blog_like_track: BlogLike,
    forum_tag: ForumTag, events: Event, event_registered_people: EventRegPeople,
    forum_answer: ForumAnswer, reports: Report, roles: Role, 
    forum_like_track: ForumLike, tags: Tag, Sequelize } = require("./models/index");


Forum.findAll({
    attributes: ["f_post_id", "f_post_title", "like_count", "createdAt"],
    limit: 20,
    subQuery: false,
    raw: true,
    group: ['forum.f_post_title'],

    include: [{
        attributes: ["user_name"],
        model: User,
        required: true, // returns everything in a clean single object format
                        // setting it to false, results in nested arrays
    }, {
        attributes: [[Sequelize.fn("COUNT", Sequelize.col("forum_answers.answer_id")), "ansCount"]],
        model: ForumAnswer,
        required: true,
    }]
})
    .then(fetchedPost => {

        return Promise.all(fetchedPost.map(post => {

            return ForumTag.findAll({
                attributes: [],
                raw: true,

                where: {
                    f_post_id: post.f_post_id,
                },
                include: [{
                    attributes: ["tag_name"],
                    model: Tag,
                    required: true,
                }]
            })
                .then(postTags => {

                    post.tags = postTags.map(postTag => postTag["tag.tag_name"]);
                    return post;
                })

        }))
            .then(mergedPost => {
                console.log(mergedPost);
            })
            .catch(err => console.log(err));

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