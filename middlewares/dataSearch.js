const { sequelize, users: Users, forum: Forum, blog: Blog, events: Event } = require("../models/index");


const searchUser = (req, res, next) => {
    
    const searchKey = req.query.searchKey;
}

const searchBlog = (req, res, next) => {

    const searchKey = req.query.searchKey;
}

const searchForum = (req, res, next) => {

    const searchKey = req.query.searchKey;
}

const searchEvent = (req, res, next) => {
    
    const searchKey = req.query.searchKey;
}

module.exports = {
    searchUser,
    searchBlog,
    searchForum,
    searchEvent
}