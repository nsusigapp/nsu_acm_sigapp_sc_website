
const { forum_answer: ForumAnswer } = require("../models/index");

const getForumCreate = (req, res, next) => {

    return res.render("create_forum" ,{
        pageTitle: pageTitle.CREATE_FORUM
    });
}

const createPost = (req, res, next) => {

}

const deletePostById = (req, res, next) => {

    const postId = req.params.id;
}

const forumPostAnswer = (req, res, next) => {

    const formData = req.body;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    if (!loggedIn) {

        return res.json({
            error: "Not Logged In"
        });

    } else {

        ForumAnswer.create({
            forum_p_id: formData.postId,
            author_id: uid,
            answer_content: formData.answer_content
        })
            .then(response => {
    
                return res.redirect("/forum-post/1");
            })
            .catch(err => console.log(err));
    }

}


module.exports = {
    createPost,
    deletePostById,
    getForumCreate,
    forumPostAnswer
}