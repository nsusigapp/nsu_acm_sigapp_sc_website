
const { blog: Blog, blog_tag: BlogTag, sequelize } = require("../models/index");

const pageTitle = require("../utils/pageTitles");

const getBlogCreate = (req, res, next) => {

    return res.render("create_blog" ,{
        pageTitle: pageTitle.CREATE_BLOG
    });
}

const ajCreateBlogPost = async (req, res, next) => {

    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    const { tag, ...formData } = req.body;
    formData.author_id = uid;

    const messages = {
        emptyBody: false,
        emptyTags: false,
        success: false
    }

    if (formData.blog_description.length === 0) {

        messages.emptyBody = true;
        
        return res.json(messages);

    } else if (tag.length === 0) {

        messages.emptyTags = true;

        return res.json(messages);

    } else if (formData.blog_description.includes("<img src=")) {

        formData.blog_description = formData.blog_description.replace("<img src=", "<img data-src=");
        // setup lazy loading tags
    }

    try {
        
        await sequelize.transaction(async function(t) {
    
            const resCreate = await Blog.create(formData, { transaction: t });
                    
            const { blog_id } = resCreate;
    
            const bulkTag = tag.map(et => {
                return {
                    blog_id,
                    tag_id: parseInt(et)
                }
            });
        
            await BlogTag.bulkCreate(bulkTag, { transaction: t });                

            messages.success = true;
            messages.id = blog_id;
            
            return res.json(messages);
        });

    } catch (err) {
        
        console.log(err);
    }
}

const getBlogEditPage = (req, res, next) => {
    
    return res.render("edit_blog", {
        pageTitle: pageTitle.EDIT_BLOG,
    });
}

const postEditBlog = async (req, res, next) => {

    const errors = res.locals.error;
    const blogId = req.params.id;

    if (!(errors.blogExists)) {

        return res.redirect(`/edit-blog/${blogId}`);

    } else if (errors.unauthorized) {

        return res.redirect(`/edit-blog/${blogId}`);        
    }

    const { tag, ...formData } = req.body;

    const messages = {
        emptyBody: false,
        emptyTags: false,
        success: false
    }

    if (formData.blog_description.length === 0) {

        messages.emptyBody = true;
        
        return res.json(messages);

    } else if (tag.length === 0) {

        messages.emptyTags = true;

        return res.json(messages);

    } else if (formData.blog_description.includes("<img src=")) {

        formData.blog_description = formData.blog_description.replace("<img src=", "<img data-src=");
        // setup lazy loading tags
    }

    try {

        await sequelize.transaction(async function(t) {

            await Blog.update({
                blog_title: formData.blog_title,
                img_url: formData.img_url,
                blog_description: formData.blog_description
            }, {
                where: {
                    blog_id: blogId
                }
            }, { transaction: t });

            await BlogTag.destroy({
                where: {
                    blog_id: blogId
                }
            }, { transaction: t });

            const bulkTag = tag.map(et => {
                return {
                    blog_id: blogId,
                    tag_id: parseInt(et)
                }
            });

            await BlogTag.bulkCreate(bulkTag, { transaction: t });                

            messages.success = true;
            messages.id = blogId;
            
            return res.json(messages);
        });

        
    } catch (err) {
        
        console.log(err);
    }
}

const deleteBlogById = (req, res, next) => {

    const postId = req.params.id;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

}

module.exports = {
    getBlogCreate,
    ajCreateBlogPost,
    getBlogEditPage,
    postEditBlog,
    deleteBlogById,
}