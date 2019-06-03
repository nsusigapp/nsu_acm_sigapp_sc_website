
const { blog_comments: BlogComm, users: User, 
    blog_like_track: BlogLike, blog: Blog, sequelize } = require("../models/index");

const { postLike } = require("../utils/constants");

const blogPostComment = (req, res, next) => {

    const formData = req.body;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    if (formData.com_content.length === 0) {
        
        return res.redirect(`/blog-post/${formData.blog_id}`);
    }

    BlogComm.create({
        blog_id: formData.blog_id,
        user_id: uid,
        com_content: formData.com_content
    })
        .then(response => {

            BlogComm.count()
                .then(count => {

                    User.findOne({
                        attributes: ["user_name"],
                        where: {
                            u_id: uid
                        }
                    })
                        .then(userName => {

                            return res.json({
                                success: true,
                                user_name: userName.user_name,
                                com_content: response.com_content,
                                createdAt: response.createdAt,
                                comCount: count
                            });
                        })
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

const postBlogLike = (req, res, next) => {

    const blogId = req.body.blogId;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    sequelize.transaction(function (t) {

        return BlogLike.findOne({
            attributes: ["action"],
            raw: true,
            where: {
                user_id: uid,
                blog_id: blogId
            }
        }, { transaction: t })
            .then(likeStatus => {

                if (likeStatus !== null && likeStatus.action === postLike.LIKE) {

                    return BlogLike.update({
                        action: postLike.UNLIKE,
                    }, {
                            where: {
                                user_id: uid,
                                blog_id: blogId
                            }
                        }, { transaction: t })
                        .then(likeResponse => {

                            return Blog.findOne({
                                where: {
                                    blog_id: blogId,
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

                    return BlogLike.update({
                        action: postLike.LIKE,
                    }, {
                            where: {
                                user_id: uid,
                                blog_id: blogId
                            }
                        }, { transaction: t })
                        .then(likeResponse => {

                            return Blog.findOne({
                                where: {
                                    blog_id: blogId,
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

                    return BlogLike.create({
                        user_id: uid,
                        blog_id: blogId,
                        action: postLike.LIKE
                    }, { transaction: t })
                        .then(likeCreate => {

                            return Blog.findOne({
                                where: {
                                    blog_id: blogId,
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
    blogPostComment,
    postBlogLike
}