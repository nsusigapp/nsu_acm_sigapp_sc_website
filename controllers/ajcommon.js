
const { tags: Tag } = require("../models/index");

const getTags = (req, res, next) => {

    Tag.findAll({
        attributes: ["tag_name", "tag_id"],
        order: [
            ["tag_name", "ASC"]
        ],
        raw: true,
    })
        .then(fetchedTags => {

            return res.json({
                fetchedTags
            });
        })
        .catch(err => console.log(err));
}

module.exports = {
    getTags
}