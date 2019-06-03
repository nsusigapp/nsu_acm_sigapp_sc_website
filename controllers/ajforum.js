
const { postLike } = require("../utils/constants");

const { forum: Forum, forum_like_track: ForumLike, sequelize } = require("../models/index");

const postForumLike = (req, res, next) => {

    const postId = req.body.postid;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    sequelize.transaction(function (t) {

        return ForumLike.findOne({
            attributes: ["action"],
            raw: true,
            where: {
                user_id: uid,
                forum_id: postId
            }
        }, { transaction: t })
            .then(likeStatus => {

                if (likeStatus !== null && likeStatus.action === postLike.LIKE) {

                    return ForumLike.update({
                        action: postLike.UNLIKE,
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

                } else if (likeStatus !== null && likeStatus.action === postLike.UNLIKE) {

                    return ForumLike.update({
                        action: postLike.LIKE,
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
                        action: postLike.LIKE
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

module.exports = {
    postForumLike,
}