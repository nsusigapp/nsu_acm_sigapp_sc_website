const { sequelize, Sequelize, users: User,
        tags: Tag, forum_tag: ForumTag, forum: Forum, 
        forum_answer: ForumAnswer, forum_like_track: ForumLike } = require("../models/index");

const { limitPost, postLike } = require("../utils/constants");

const loadForumDataInit = (req, res, next) => {

    const filter = req.query.tag_name;

    Forum.findAll({
        attributes: ["f_post_id", "f_post_title", "like_count", "createdAt"],
        limit: limitPost.FORUM,
        subQuery: false,
        raw: true,
        group: ['forum.f_post_title'],
        order: [
            ["createdAt", "DESC"]
        ],
    
        include: [{
            attributes: ["user_name"],
            model: User,
            required: true, // returns everything in a clean single object format
                            // setting it to false, results in nested arrays
        }, {
            attributes: [[Sequelize.fn("COUNT", Sequelize.col("forum_answers.answer_id")), "ansCount"]],
            model: ForumAnswer,
            // required: true,
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
                    
                    if (!filter) {

                        res.locals.forumPost = mergedPost;
                        return next();

                    } else {

                        const filteredPost = mergedPost.filter(post => {

                            for (let i = 0; i < post.tags.length; i++) {

                                if (post.tags[i] === filter) {
                                    return post;
                                }
                            }
                        });

                        res.locals.forumPost = filteredPost;
                        return next();
                    }

                })
                .catch(err => console.log(err));
    
        })
        .catch(err => console.log(err));
}

const setupPagintion = (req, res, next) => {

    Forum.count()
        .then(postCount => {

            res.locals.postCount = postCount;
            return next();
            
        })
        .catch(err => console.log(err));
}

const getForumById = (req, res, next) => {

    const postId = req.params.id;

    sequelize.transaction(function(t) {

        return Forum.findOne({
            attributes: ["f_post_title", "f_post_description", "like_count", "createdAt"],
            subQuery: false,
            raw: true,
            where: {
                f_post_id: postId
            },
        
            include: [{
                attributes: ["u_id", "user_name","first_name","last_name","avatar_url"],
                model: User,
                required: true,
            }]
        }, { transaction: t })
            .then(fetchedPost => {

                if (fetchedPost === null) {

                    res.locals.postExists = false;
                    return next();

                } else {

                    res.locals.post = fetchedPost;
                    res.locals.post.f_post_id = postId;
                    res.locals.postExists = true;
                    
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
    
                            const { loggedIn } = res.locals.userInfo;
                            const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

                            if (!loggedIn) {
                                
                                res.locals.isLiked = false;
                                return next();

                            } else {

                                return ForumLike.findOne({
                                    attributes: ["action"],
                                    raw: true,
                                    where: {
                                        user_id: uid,
                                        forum_id: postId
                                    }
                                }, { transaction: t })
                                    .then(likeStatus => {
        
                                        if (likeStatus === null) {
        
                                            res.locals.isLiked = false;
                                            return next();
        
                                        } else if (likeStatus.action === postLike.LIKE) {
        
                                            res.locals.isLiked = true;
                                            return next();
        
                                        } else if (likeStatus.action === postLike.UNLIKE) {
        
                                            res.locals.isLiked = false;
                                            return next();
                                        }
                                    })
                            }
    
                        })
                }

            })            
    })
    .catch(err => console.log(err));

}

const loadForumReplies = (req, res, next) => {
    
    const postId = req.params.id;

    ForumAnswer.findAll({
        attributes: ["answer_content", "createdAt"],
        raw: true,
        order: [
            ["createdAt", "DESC"]
        ],

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

            return next();
        })
        .catch(err => console.log(err));
}


module.exports = {
    loadForumDataInit,
    setupPagintion,
    getForumById,
    loadForumReplies
}