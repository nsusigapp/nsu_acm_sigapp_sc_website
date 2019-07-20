
const { tags: Tag } = require("../models/index");

const fetchCategories = async (req, res, next) => {

    try {
        
        const fetchedTag = await Tag.findAll({
            attributes: ["tag_name"],
            order: [
                ["tag_name", "ASC"]
            ]
        });
           
    
        res.locals.tags = fetchedTag;
        return next();

    } catch (err) {

        console.log(err);
    }
}

module.exports = {
    fetchCategories
}