
const { sequelize, forum: Forum, blog: Blog, events: Event, Sequelize } = require("../models/index");

const Op = Sequelize.Op;

const searchBlog = (req, res, next) => {

    const searchKey = req.query.searchKey;

    if (req.query.active === "blog") {

        return Blog.findAll({
            attributes: ["blog_title"],
            raw: true,
            where: {
                blog_title: {
                    [Op.like]: `%${searchKey}%`
                } 
            }
        })
            .then(blogs => {
    
                res.locals.posts = blogs;
                res.locals.title = "blog_title";
    
                return next();
            })
            .catch(err => console.log(err));

    } else {

        return next();
    }

}

const searchForum = (req, res, next) => {

    const searchKey = req.query.searchKey;

    if (req.query.active === "forum") {

        return Forum.findAll({
            attributes: ["f_post_title"],
            raw: true,
            where: {
                f_post_title: {
                    [Op.like]: `%${searchKey}%`
                } 
            }
        })
            .then(forums => {
    
                res.locals.posts = forums;
                res.locals.title = "f_post_title";
    
                return next();
            })
            .catch(err => console.log(err));

    } else {
        
        return next();
    }

}

const searchEvent = (req, res, next) => {
    
    const searchKey = req.query.searchKey;

    if (req.query.active === "event") {

        return Event.findAll({
            attributes: ["event_name"],
            raw: true,
            where: {
                event_name: {
                    [Op.like]: `%${searchKey}%`
                } 
            }
        })
            .then(events => {
    
                res.locals.posts = events;
                res.locals.title = "event_name";
    
                return next();
            })
            .catch(err => console.log(err));

    } else {
        
        return next();
    }
}

module.exports = {
    searchBlog,
    searchForum,
    searchEvent
}