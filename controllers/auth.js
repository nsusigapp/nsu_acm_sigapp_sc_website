
const { users, email_queue: emailQueue } = require("../models/index");
const { validateRegForm } = require("../validator/validate");
const { checkIfExistsAndCreateUser } = require("../validator/validate");
const { renderRegPage } = require("../utils/util");


const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const saltRounds = 10;

const Op = require("sequelize").Op;

// -----------------------------------------------------------------------

// GET /register
const getRegisterPage = (req, res, next) => {
    renderRegPage(req, res);
}

// POST /register
const postRegisterUser = (req, res, next) => {

    const { ...userFormData } = req.body;

    let isSuccess= false;
    // let error= false;

    const { re_password, ...userDbData } = userFormData;

    bcrypt.hash(userDbData.password, saltRounds)
        .then(hash => {

            userDbData.password = hash;

            userDbData.token = users.generateAuthToken({
                nsu_id: userDbData.nsu_id,
                user_name: userDbData.user_name,
                role_id: userDbData.role_id,
                status: userDbData.status,
            });

            users.create(userDbData)
                .then(resCreate => {

                    const headers = {
                        from: 'Sender Name <sender@example.com>',
                        to: 'Recipient <recipient@example.com>',
                        subject: 'Nodemailer is unicode friendly ✔',
                    }

                    emailQueue.create({
                        send_to: userDbData.nsu_email,
                        e_from: "sigapp@yoo.org",
                        email_headers: JSON.stringify(headers),
                        email_description: "<p><b>Hello</b> to myself!</p>",
                        send_progress: "Queued",
                        sent_at: Date.now(),
                    })
                        .then(resQueue => {
                            isSuccess= true;

                            req.flash("regInfo",isSuccess);
                            res.redirect("/register");
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => {

                    const dbFetchErrorObj= {
                        userNameExists: false,
                        emailExists: false,
                        nsuIdExists: false,
                    }

                    const errorKey= err.errors[0].path;

                    if(errorKey==="nsu_id"){
                        dbFetchErrorObj["nsuIdExists"]= true;
                        
                        req.flash("info",dbFetchErrorObj);

                        res.redirect("/register");

                    }else if(errorKey==="nsu_email"){
                        dbFetchErrorObj["emailExists"]= true;

                        req.flash("info",dbFetchErrorObj);

                        res.redirect("/register");

                    }else if(errorKey==="user_name"){
                        dbFetchErrorObj["userNameExists"]= true;

                        req.flash("info",dbFetchErrorObj);

                        res.redirect("/register");                    }

                });

        })
        .catch(err => console.log(err));
}

const getLoginPage= (req,res,next) => {

    res.render("login",{
        pageTitle: "Login Page",
        path: "/login",
    });

}

const postLoginUser= (req,res,next) => {

}

module.exports = {
    getRegisterPage,
    postRegisterUser,
    getLoginPage,
    postLoginUser,
}