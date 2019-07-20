
const { blog_comments: BlogComm, users: User, 
    blog_like_track: BlogLike, blog: Blog, sequelize } = require("../models/index");

const { postLike } = require("../utils/constants");

const blogPostComment = async (req, res, next) => {

    const formData = req.body;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    if (formData.com_content.length === 0) {
        
        return res.redirect(`/blog-post/${formData.blog_id}`);
    }

    try {
        
        const response = await BlogComm.create({
            blog_id: formData.blog_id,
            user_id: uid,
            com_content: formData.com_content
        });
    
        const count = await BlogComm.count();
    
        const userName = await User.findOne({
            attributes: ["user_name"],
            where: {
                u_id: uid
            }
        });
                        
        return res.json({
            success: true,
            user_id: uid,
            user_name: userName.user_name,
            com_content: response.com_content,
            createdAt: response.createdAt,
            comCount: count
        });

    } catch (err) {

        console.log(err);
    }

}

const postBlogLike = async (req, res, next) => {

    const blogId = req.body.blogId;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    try {

        await sequelize.transaction(async function (t) {

            const likeStatus = await BlogLike.findOne({
                attributes: ["action"],
                raw: true,
                where: {
                    user_id: uid,
                    blog_id: blogId
                }
            }, { transaction: t });
    
            if (likeStatus !== null && likeStatus.action === postLike.LIKE) {
    
                await BlogLike.update({
                    action: postLike.UNLIKE,
                }, {
                        where: {
                            user_id: uid,
                            blog_id: blogId
                        }
                    }, { transaction: t })
        
    
                const post = await Blog.findOne({
                    where: {
                        blog_id: blogId,
                    }
                }, { transaction: t });
    
    
                post.like_count -= 1;
                await post.save({ transaction: t });
    
                return res.json({
                    loggedIn: true,
                    count: post.like_count,
                    liked: false
                });
    
            } else if (likeStatus !== null && likeStatus.action === postLike.UNLIKE) {
    
                await BlogLike.update({
                    action: postLike.LIKE,
                }, {
                        where: {
                            user_id: uid,
                            blog_id: blogId
                        }
                    }, { transaction: t })
    
                const post = await Blog.findOne({
                    where: {
                        blog_id: blogId,
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
    
                await BlogLike.create({
                    user_id: uid,
                    blog_id: blogId,
                    action: postLike.LIKE
                }, { transaction: t })
                            
    
                const post = await Blog.findOne({
                    where: {
                        blog_id: blogId,
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

module.exports = {
    blogPostComment,
    postBlogLike
}