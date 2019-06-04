
const { blog: Blog, blog_tag: BlogTag, sequelize } = require("../models/index");

const pageTitle = require("../utils/pageTitles");

const getBlogCreate = (req, res, next) => {

    return res.render("create_blog" ,{
        pageTitle: pageTitle.CREATE_BLOG
    });
}

const createBlogPost = (req, res, next) => {

    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    const { tag, ...formData } = req.body;
    formData.author_id = uid;

    if (formData.blog_description.length === 0) {

        return res.redirect("/create-blog-post");

    } else if (formData.blog_description.includes("<img src=")) {

        formData.blog_description = formData.blog_description.replace("<img src=", "<img data-src=");
        // setup lazy loading tags
    }

    sequelize.transaction(function(t) {

        return Blog.create(formData, { transaction: t })
            .then(resCreate => {
                
                const { blog_id } = resCreate;

                if (tag.length > 0) {

                    const bulkTag = tag.map(et => {
                        return {
                            blog_id,
                            tag_id: parseInt(et)
                        }
                    });
    
                    return BlogTag.bulkCreate(bulkTag, { transaction: t })
                        .then(resBulk => {

                            return res.redirect("/blog");
                        })
                }

            })
    })
    .catch(err => console.log(err));

}

const getBlogEditPage = (req, res, next) => {
    
    return res.render("edit_blog", {
        pageTitle: pageTitle.EDIT_BLOG,
        blog: req.preparedBlog
    });
}

const deleteBlogById = (req, res, next) => {

    const postId = req.params.id;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

}

module.exports = {
    getBlogCreate,
    createBlogPost,
    getBlogEditPage,
    deleteBlogById,
}