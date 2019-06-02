
const { blog_comments: BlogComm, users: User, sequelize } = require("../models/index");

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

module.exports = {
    blogPostComment
}