
const { forum_answer: ForumAnswer, forum: Forum, forum_tag: ForumTag, sequelize } = require("../models/index");

const pageTitle = require("../utils/pageTitles");

const getForumCreate = (req, res, next) => {

    return res.render("create_forum" ,{
        pageTitle: pageTitle.CREATE_FORUM
    });
}

const createForumPost = (req, res, next) => {

    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    const { tag, ...formData } = req.body;
    formData.author_id = uid;

    // setup lazy loading tags
    if (formData.f_post_description.includes("<img src=")) {
        formData.f_post_description = formData.f_post_description.replace("<img src=", "<img data-src=");
    }

    sequelize.transaction(function(t) {

        return Forum.create(formData, { transaction: t })
            .then(resCreate => {
                
                const { f_post_id } = resCreate;

                if (bulkTag.length > 0) {

                    const bulkTag = tag.map(et => {
                        return {
                            f_post_id,
                            tag_id: parseInt(et)
                        }
                    });
    
                    return ForumTag.bulkCreate(bulkTag, { transaction: t });
                }

            })
    })
    .catch(err => console.log(err));



}

const deletePostById = (req, res, next) => {

    const postId = req.params.id;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

}

const forumPostAnswer = (req, res, next) => {

    const formData = req.body;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    // setup lazy loading tags
    if (formData.answer_content.includes("<img src=")) {
        formData.answer_content = formData.answer_content.replace("<img src=", "<img data-src=");
    }

    ForumAnswer.create({
        forum_p_id: formData.postId,
        author_id: uid,
        answer_content: formData.answer_content
    })
        .then(response => {

            return res.redirect(`/forum-post/${formData.postId}`);
        })
        .catch(err => console.log(err));
}

module.exports = {
    createForumPost,
    deletePostById,
    getForumCreate,
    forumPostAnswer
}