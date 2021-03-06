
const { postLike } = require("../utils/constants");

const { forum: Forum, forum_like_track: ForumLike, 
    forum_answer: ForumAnswer, users: User, sequelize } = require("../models/index");

const postForumLike = async (req, res, next) => {

    const postId = req.body.postid;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    try {
        
        await sequelize.transaction(async function (t) {

            const likeStatus = await ForumLike.findOne({
                attributes: ["action"],
                raw: true,
                where: {
                    user_id: uid,
                    forum_id: postId
                }
            }, { transaction: t });
    
            if (likeStatus !== null && likeStatus.action === postLike.LIKE) {
    
                await ForumLike.update({
                    action: postLike.UNLIKE,
                }, {
                        where: {
                            user_id: uid,
                            forum_id: postId
                        }
                    }, { transaction: t });
    
                const post = await Forum.findOne({
                    where: {
                        f_post_id: postId,
                    }
                }, { transaction: t })
    
                post.like_count -= 1;
                await post.save({ transaction: t });
    
                return res.json({
                    loggedIn: true,
                    count: post.like_count,
                    liked: false
                });
    
            } else if (likeStatus !== null && likeStatus.action === postLike.UNLIKE) {
    
                await ForumLike.update({
                    action: postLike.LIKE,
                }, {
                        where: {
                            user_id: uid,
                            forum_id: postId
                        }
                    }, { transaction: t });
                            
    
                const post = await Forum.findOne({
                    where: {
                        f_post_id: postId,
                    }
                }, { transaction: t });
    
                post.like_count += 1;
                await post.save({ transaction: t });
    
                return res.json({
                    loggedIn: true,
                    count: post.like_count,
                    liked: true,
                });
    
            } else if (likeStatus === null) {
    
                await ForumLike.create({
                    user_id: uid,
                    forum_id: postId,
                    action: postLike.LIKE
                }, { transaction: t });
    
                const post = await Forum.findOne({
                    where: {
                        f_post_id: postId,
                    }
                }, { transaction: t });
    
                post.like_count += 1;
                await post.save({ transaction: t });
    
                return res.json({
                    loggedIn: true,
                    count: post.like_count,
                    liked: true,
                });
            }
        });

    } catch (err) {
        
        console.log(err);
    }
}

const forumPostAnswer = async (req, res, next) => {

    const formData = req.body;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    if (formData.answer_content.length === 0) {
        
        return res.redirect(`/forum-post/${formData.postId}`);

    } else if (formData.answer_content.includes("<img src=")) {

        formData.answer_content = formData.answer_content.replace("<img src=", "<img data-src=");
        // setup lazy loading tags
    }

    try {
        
        const answer = await ForumAnswer.create({
            forum_p_id: formData.postId,
            author_id: uid,
            answer_content: formData.answer_content
        });
            
        const ansCount = await ForumAnswer.count();
    
        const author = await User.findOne({
            attributes: ["user_name"],
            where: {
                u_id: uid,
            }
        });      
    
        return res.json({
            ansCount,
            u_id: uid,
            success: true,
            user_name: author.user_name,
            answer_content: answer.answer_content,
            createdAt: answer.createdAt
        });

    } catch (err) {
        
        console.log(err);
    }
}

module.exports = {
    postForumLike,
    forumPostAnswer
}