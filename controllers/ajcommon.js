
const { tags: Tag } = require("../models/index");

const getTags = async (req, res, next) => {

    try {
        
        const fetchedTags = await Tag.findAll({
            attributes: ["tag_name", "tag_id"],
            order: [
                ["tag_name", "ASC"]
            ],
            raw: true,
        });
        
        return res.json({
            fetchedTags
        });

    } catch (err) {
        
        console.log(err);
    }
}

module.exports = {
    getTags
}