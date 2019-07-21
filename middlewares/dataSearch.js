
const { forum: Forum, blog: Blog, events: Event, Sequelize } = require("../models/index");

const Op = Sequelize.Op;

const searchBlog = async (req, res, next) => {

    const searchKey = req.query.searchKey;

    if (req.query.active === "blog") {

        try {
            
            const blogs = await Blog.findAll({
                attributes: ["blog_title", "blog_id"],
                raw: true,
                where: {
                    blog_title: {
                        [Op.like]: `%${searchKey}%`
                    } 
                }
            });
        
            res.locals.posts = blogs;
            res.locals.title = "blog_title";
        
            return next();

        } catch (err) {
            
            console.log(err);
        }

    } else {

        return next();
    }
}

const searchForum = async (req, res, next) => {

    const searchKey = req.query.searchKey;

    if (req.query.active === "forum") {

        try {
            
            const forums = await Forum.findAll({
                attributes: ["f_post_title", "f_post_id"],
                raw: true,
                where: {
                    f_post_title: {
                        [Op.like]: `%${searchKey}%`
                    } 
                }
            });
        
            res.locals.posts = forums;
            res.locals.title = "f_post_title";
        
            return next();

        } catch (err) {

            console.log(err);
        }

    } else {
        
        return next();
    }

}

const searchEvent = async (req, res, next) => {
    
    const searchKey = req.query.searchKey;

    if (req.query.active === "event") {

        try {
            
            const events = await Event.findAll({
                attributes: ["event_name", "event_id"],
                raw: true,
                where: {
                    event_name: {
                        [Op.like]: `%${searchKey}%`
                    } 
                }
            });
        
            res.locals.posts = events;
            res.locals.title = "event_name";
        
            return next();

        } catch (err) {

            console.log(err);
        }

    } else {
        
        return next();
    }
}

module.exports = {
    searchBlog,
    searchForum,
    searchEvent
}