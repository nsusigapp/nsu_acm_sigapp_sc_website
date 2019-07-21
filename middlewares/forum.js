const { sequelize, Sequelize, users: User,
        tags: Tag, forum_tag: ForumTag, forum: Forum, 
        forum_answer: ForumAnswer, forum_like_track: ForumLike } = require("../models/index");

const { limitPost, postLike } = require("../utils/constants");

const loadForumDataInit = async (req, res, next) => {

    const filter = req.query.tag_name;

    try {
        
        const fetchedPost = await Forum.findAll({
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
        });
        
        const mergedPost = await Promise.all(fetchedPost.map(async post => {
        
            const postTags = await ForumTag.findAll({
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
            });
        
            post.tags = postTags.map(postTag => postTag["tag.tag_name"]);
            return post;
        }));
    
                        
        if (!filter) {
    
            res.locals.forumPost = mergedPost;
            return next();
        }
    
        const filteredPost = mergedPost.filter(post => {
    
            for (let i = 0; i < post.tags.length; i++) {
    
                if (post.tags[i] === filter) {
                    return post;
                }
            }
        });
    
        res.locals.forumPost = filteredPost;
        return next();

    } catch (err) {
        
        console.log(err);
    }
}

const setupPagintion = (req, res, next) => {

    Forum.count()
        .then(postCount => {

            res.locals.postCount = postCount;
            return next();
            
        })
        .catch(err => console.log(err));
}

const getForumById = async (req, res, next) => {

    const postId = req.params.id;

    try {

        await sequelize.transaction(async function(t) {
    
            const fetchedPost = await Forum.findOne({
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
    
            if (fetchedPost === null) {
    
                res.locals.postExists = false;
                return next();
            }
            
            res.locals.post = fetchedPost;
            res.locals.post.f_post_id = postId;
            res.locals.postExists = true;
                        
            const fetchedTags = await ForumTag.findAll({
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
            }, { transaction: t });
        
            res.locals.tags = fetchedTags.map(fetchedTag => fetchedTag["tag.tag_name"]);
        
            const { loggedIn } = res.locals.userInfo;
            const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;
    
            if (!loggedIn) {
                                    
                res.locals.isLiked = false;
                return next();
            }
    
            const likeStatus = await ForumLike.findOne({
                attributes: ["action"],
                raw: true,
                where: {
                    user_id: uid,
                    forum_id: postId
                }
            }, { transaction: t });
            
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
        });
        
    } catch (err) {
        
        console.log(err);
    }

}

const loadForumReplies = async (req, res, next) => {
    
    const postId = req.params.id;

    try {

        const fetchedAnswers = await ForumAnswer.findAll({
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
        });
            
        res.locals.answers = fetchedAnswers;
    
        return next();
        
    } catch (err) {

        console.log(err);
    }
}

module.exports = {
    loadForumDataInit,
    setupPagintion,
    getForumById,
    loadForumReplies
}