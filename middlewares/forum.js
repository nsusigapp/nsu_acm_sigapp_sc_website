const { sequelize, users: Users, tags: Tag, forum_tag: ForumTag, forum: Forum } = require("../models/index");
const { limitPost } = require("../utils/constants");

const fetchForumCategories = (req, res, next) => {

    Tag.findAll({
        attributes: ["tag_name"],
        order: [
            ["tag_name", "ASC"]
        ]
    })
        .then(fetchedTag => {

            res.locals.tags = fetchedTag;

            next();
        })
        .catch(err => console.log(err));
}

const loadForumDataInit = (req, res, next) => {

    User.findAll({
        attributes: ["user_name"],
        limit: 20,
        subQuery: false,

        include: [{
            attributes: ["createdAt"],
            model: Forum,
            required: true,
            
            include: [{
                model: ForumTag,
                required: true
            }]
        }],
    })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err));

}


module.exports = {
    fetchForumCategories,
    loadForumDataInit
}