
const { sequelize, users: User,
    tags: Tag, blog_tag: BlogTag, blog: Blog, 
    blog_comments: BlogComm, blog_like_track: BlogLike } = require("../models/index");

const { limitPost, postLike } = require("../utils/constants");

const loadBlogDataInit = (req, res, next) => {

    const filter = req.query.tag_name;

    Blog.findAll({
        attributes: ["blog_id", "blog_title", "like_count", "img_url", "createdAt"],
        limit: limitPost.BLOG,
        subQuery: false,
        raw: true,
        order: [
            ["createdAt", "DESC"]
        ],
    
        include: [{
            attributes: ["user_name"],
            model: User,
            required: true, // returns everything in a clean single object format
                            // setting it to false, results in nested arrays
        }]
    })
        .then(fetchedBlog => {
    
            return Promise.all(fetchedBlog.map(post => {
    
                return BlogTag.findAll({
                    attributes: [],
                    raw: true,
    
                    where: {
                        blog_id: post.blog_id,
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

                        res.locals.blogPost = mergedPost;
                        return next();

                    } else {

                        const filteredPost = mergedPost.filter(post => {

                            for (let i = 0; i < post.tags.length; i++) {

                                if (post.tags[i] === filter) {
                                    return post;
                                }
                            }
                        });

                        res.locals.blogPost = filteredPost;
                        return next();
                    }

                })
                .catch(err => console.log(err));
    
        })
        .catch(err => console.log(err));
}

const getBlogById = async (req, res, next) => {

    const blogId = req.params.id;

    try {

        await sequelize.transaction(async function(t) {

            const fetchedBlog = await Blog.findOne({
                attributes: ["blog_title", "blog_description", "like_count", "img_url", "createdAt"],
                subQuery: false,
                raw: true,
                where: {
                    blog_id: blogId
                },
            
                include: [{
                    attributes: ["u_id", "user_name","first_name","last_name","avatar_url"],
                    model: User,
                    required: true,
                }]
            }, { transaction: t });
                
    
            if (fetchedBlog === null) {
    
                res.locals.blogExists = false;
                return next();
    
            }
    
            res.locals.blog = fetchedBlog;
            res.locals.blog.blog_id = blogId;
            res.locals.blogExists = true;
                        
            const fetchedTags = await BlogTag.findAll({
                attributes: [],
                raw: true,
                where: {
                    blog_id: blogId
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
    
            const likeStatus = await BlogLike.findOne({
                attributes: ["action"],
                raw: true,
                where: {
                    user_id: uid,
                    blog_id: blogId
                }
            }, { transaction: t })
            
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

const loadBlogComments = async (req, res, next) => {

    const blogId = req.params.id;

    try {
        
        const fetchedCom = await BlogComm.findAll({
            attributes: ["com_content", "createdAt"],
            raw: true,
            order: [
                ["createdAt", "DESC"]
            ],
    
            where: {
                blog_id: blogId
            },
    
            include: [{
                attributes: ["user_name"],
                model: User,
                required: true,
            }]
        })
                
        res.locals.comments = fetchedCom;
        return next();

    } catch (err) {

        console.log(err);
    }
}

const prepareBlogEditData = async (req, res, next) => {

    const errors = res.locals.error;

    if (!(errors.blogExists)) {

        return next();

    } else if (errors.unauthorized) {

        return next();
    }

    const { fetchedBlog } = req;
    const blogId = req.params.id;

    if (fetchedBlog.blog_description.includes("<img data-src=")) {

        fetchedBlog.blog_description = fetchedBlog.blog_description.replace("<img src=", "<img data-src=");
        // remove lazy loading tags
    }


    try {
        
        const fetchedTags = await BlogTag.findAll({
            attributes: [],
            raw: true,
            where: {
                blog_id: blogId
            },
            include: [{
                attributes: ["tag_name", "tag_id"],
                model: Tag,
                required: true,
            }]
        });
    
        res.locals.tags = fetchedTags;
        res.locals.tagsId = fetchedTags.map(tag => {
            return tag["tag.tag_id"];
        });

        res.locals.blog = fetchedBlog;

        return next();

    } catch (err) {
        
        console.log(err);
    }
}

module.exports = {
    loadBlogDataInit,
    getBlogById,
    loadBlogComments,
    prepareBlogEditData
}