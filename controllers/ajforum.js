
const { forumLike } = require("../utils/constants");

const { tags: Tag, forum: Forum, forum_like_track: ForumLike, sequelize } = require("../models/index");

const getTags = (req, res, next) => {

    Tag.findAll({
        attributes: ["tag_name"],
        raw: true
    })
        .then(fetchedTags => {
            
            const tagNames = fetchedTags.map(tag => tag.tag_name);
            return res.json({
                tagNames
            });
        })
        .catch(err => console.log(err));

}

const postForumLike = (req, res, next) => {

    const postId = req.body.postid;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    if (!loggedIn) {

        return res.json({
            loggedIn: false
        });

    } else {
        
        sequelize.transaction(function(t) {

            return ForumLike.findOne({
                attributes: ["action"],
                raw: true,
                where: {
                    user_id: uid,
                    forum_id: postId
                }
            }, { transaction: t })
                .then(likeStatus => {
    
                    if (likeStatus !== null && likeStatus.action === forumLike.LIKE) {
                        
                        return ForumLike.update({
                            action: forumLike.UNLIKE,
                        }, {
                            where: {
                                user_id: uid,
                                forum_id: postId
                            }
                        }, { transaction: t })
                        .then(likeResponse => {

                            return Forum.findOne({
                                where: {
                                    f_post_id: postId,
                                }
                            }, { transaction: t })
                                .then(post => {

                                    post.like_count -= 1;
                                    post.save();

                                    return res.json({
                                        loggedIn: true,
                                        count: post.like_count,
                                        liked: false
                                    });
                                })
                        })
                        
                    } else if (likeStatus !== null && likeStatus.action === forumLike.UNLIKE) {

                        return ForumLike.update({
                            action: forumLike.LIKE,
                        }, {
                            where: {
                                user_id: uid,
                                forum_id: postId
                            }
                        }, { transaction: t })
                        .then(likeResponse => {

                            return Forum.findOne({
                                where: {
                                    f_post_id: postId,
                                }
                            }, { transaction: t })
                                .then(post => {

                                    post.like_count += 1;
                                    post.save();

                                    return res.json({
                                        loggedIn: true,
                                        count: post.like_count,
                                        liked: true,
                                    });
                                })
                        })
                    } else if (likeStatus === null) {

                        return ForumLike.create({
                            user_id: uid,
                            forum_id: postId,
                            action: forumLike.LIKE
                        }, { transaction: t })
                            .then(likeCreate => {

                                return Forum.findOne({
                                    where: {
                                        f_post_id: postId,
                                    }
                                }, { transaction: t })
                                    .then(post => {
    
                                        post.like_count += 1;
                                        post.save();
    
                                        return res.json({
                                            loggedIn: true,
                                            count: post.like_count,
                                            liked: true,
                                        });
                                    })
                            })
                    }
                })
        })
        .catch(err => console.log(err));
        
    }
}

module.exports = {
    postForumLike,
    getTags
}