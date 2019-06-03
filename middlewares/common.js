
const { sequelize, Sequelize, tags: Tag } = require("../models/index");

const fetchCategories = (req, res, next) => {

    Tag.findAll({
        attributes: ["tag_name"],
        order: [
            ["tag_name", "ASC"]
        ]
    })
        .then(fetchedTag => {

            res.locals.tags = fetchedTag;
            return next();
        })
        .catch(err => console.log(err));
}

module.exports = {
    fetchCategories
}