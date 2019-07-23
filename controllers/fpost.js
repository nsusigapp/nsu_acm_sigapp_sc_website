
const { forum: Forum, forum_tag: ForumTag, sequelize } = require("../models/index");

const pageTitle = require("../utils/pageTitles");

const getForumCreate = (req, res, next) => {

    return res.render("create_forum" ,{
        pageTitle: pageTitle.CREATE_FORUM
    });
}

const createForumPost = async (req, res, next) => {

    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    const { tag, ...formData } = req.body;
    formData.author_id = uid;

    if (formData.f_post_description.length === 0) {

        return res.redirect("/create-forum-post");

    } else if (formData.f_post_description.includes("<img src=")) {

        formData.f_post_description = formData.f_post_description.replace("<img src=", "<img data-src=");
        // setup lazy loading tags
    }

    try {
        
        await sequelize.transaction(async function(t) {
    
            const resCreate = await Forum.create(formData, { transaction: t });
            
            const { f_post_id } = resCreate;
    
            if (tag.length > 0) {
    
                const bulkTag = tag.map(et => {
                    return {
                        f_post_id,
                        tag_id: parseInt(et)
                    }
                });
        
                await ForumTag.bulkCreate(bulkTag, { transaction: t });
    
                return res.redirect("/forum");               
            }
        });

    } catch (err) {
        
        console.log(err);
    }
}

const deletePostById = (req, res, next) => {

    const postId = req.params.id;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

}

module.exports = {
    createForumPost,
    deletePostById,
    getForumCreate,
}