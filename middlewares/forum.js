const { sequelize, Sequelize, users: User,
        tags: Tag, forum_tag: ForumTag, forum: Forum, 
        forum_answer: ForumAnswer, forum_like_track: ForumLike  } = require("../models/index");

const { limitPost, forumLike } = require("../utils/constants");

const fetchForumCategories = (req, res, next) => {

    Tag.findAll({
        attributes: ["tag_name"],
        order: [
            ["tag_name", "ASC"]
        ]
    })
        .then(fetchedTag => {

            res.locals.tags = fetchedTag;
            next();
        })
        .catch(err => console.log(err));
}

const loadForumDataInit = (req, res, next) => {

    Forum.findAll({
        attributes: ["f_post_id", "f_post_title", "like_count", "createdAt"],
        limit: limitPost.FORUM,
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
                    .catch(err => console.log(err));
            }))
                .then(mergedPost => {
                    
                    res.locals.forumPost = mergedPost;
                    next();

                })
                .catch(err => console.log(err));
    
        })
        .catch(err => console.log(err));

}

const getForumById = (req, res, next) => {

    const postId = parseInt(req.params.id);

    sequelize.transaction(function(t) {

        return Forum.findOne({
            attributes: ["f_post_title", "f_post_description", "like_count", "createdAt"],
            subQuery: false,
            raw: true,
            where: {
                f_post_id: postId
            },
        
            include: [{
                attributes: ["user_name","first_name","last_name"],
                model: User,
                required: true,
            }]
        }, { transaction: t })
            .then(fetchedPost => {

                res.locals.post = fetchedPost;
                res.locals.post.f_post_id = postId;

                console.log(res.locals.post);
                
                return ForumTag.findAll({
                    attributes: [],
                    raw: true,

                    where: {
                        f_post_id: postId
                    },

                    include: [{
                        attributes: ["tag_name"],
                        model: Tag,
                        required: true,
                    }]
                }, { transaction: t })
                    .then(fetchedTags => {

                        res.locals.tags = fetchedTags.map(fetchedTag => fetchedTag["tag.tag_name"]);

                        if (!(req.session.userData)) {

                            res.locals.isLiked = false;
                            next();

                        } else{


                        }

                    })
            })            
    })
    .catch(err => console.log(err));

}

const loadForumReplies = (req, res, next) => {
    
    const postId = req.params.id;

    ForumAnswer.findAll({
        attributes: ["answer_content", "createdAt"],
        raw: true,

        where: {
            forum_p_id: postId
        },

        include: [{
            attributes: ["user_name"],
            model: User,
            required: true,
        }]
    })
        .then(fetchedAnswers => {
            
            res.locals.answers = fetchedAnswers;

            next();
        })
        .catch(err => console.log(err));
}



module.exports = {
    fetchForumCategories,
    loadForumDataInit,
    getForumById,
    loadForumReplies
}