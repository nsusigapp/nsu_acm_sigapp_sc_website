 const { users: User, blog: Blog, forum: Forum,
    blog_comments: BlogCom, blog_like_track: BlogLike, forum_tag: ForumTag,
    events: Event, event_registered_people: EventRegPeople,
    forum_answer: ForumAnswer, reports: Report, roles: Role, forum_like_track: ForumLike, tags: Tag, Sequelize } = require("./models/index");

    Forum.findAll({
        attributes: ["f_post_title", "like_count", "createdAt",[Sequelize.fn("COUNT", Sequelize.col("forum_answers.answer_id")), "ansCount"]],
        limit: 20,
        subQuery: false,
        raw: true,
        group: ['forum_answers.answer_id'],

        include: [{
            attributes: ["user_name"],
            model: User,
            required: true, // returns everything in a clean single object format
                            // setting it to false, results in nested arrays
        }, {
            model: ForumTag,
            required: true
        }, {
            attributes: [],
            model: ForumAnswer,
        }]
    })
        .then(res => {

            console.log(res);

        })
        .catch(err => console.log(err));

    // User.findAll({
    //     attributes: ["user_name"],
    //     limit: 20,
    //     subQuery: false,

    //     include: [{
    //         attributes: ["f_post_title", "like_count", "createdAt"],
    //         model: Forum,
    //         required: true,
            
    //         include: [{
    //             model: ForumTag,
    //             required: true,

    //             include: [{
    //                 model: Tag,
    //                 required: true,
    //             }]
    //         }]
    //     }],
    // })
    //     .then(res => {
    //         console.log(res[0].forums);
    //     })
    //     .catch(err => console.log(err));

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