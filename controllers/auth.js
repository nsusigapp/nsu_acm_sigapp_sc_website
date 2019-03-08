
const { users, email_queue: emailQueue } = require("../models/index");

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const saltRounds = 10;

const Op = require("sequelize").Op;

// -----------------------------------------------------------------------

// GET /register
const getRegisterPage = (req, res, next) => {

    res.render("registration", {
        pageTitle: "Registration Page",
        path: "/registration",
        error: req.flash("info"),
        regSuccess: req.flash("regInfo"),
    });
    
}


// POST /register
const postRegisterUser = (req, res, next) => {

    const { re_password, ...userDbData } = req.body;

    let isSuccess = false;

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

                            isSuccess = true;

                            req.flash("regInfo", isSuccess);

                            return res.redirect("/register");
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => {

                    const dbFetchErrorObj = {
                        userNameExists: false,
                        emailExists: false,
                        nsuIdExists: false,
                    }

                    const errorKey = err.errors[0].path;

                    if (errorKey === "nsu_id") {
                        dbFetchErrorObj["nsuIdExists"] = true;

                        req.flash("info", dbFetchErrorObj);

                        return res.redirect("/register");

                    } else if (errorKey === "nsu_email") {
                        dbFetchErrorObj["emailExists"] = true;

                        req.flash("info", dbFetchErrorObj);

                        return res.redirect("/register");

                    } else if (errorKey === "user_name") {
                        dbFetchErrorObj["userNameExists"] = true;

                        req.flash("info", dbFetchErrorObj);

                        return res.redirect("/register");
                    }

                });

        })
        .catch(err => console.log(err));
}

// GET /login
const getLoginPage = (req, res, next) => {

    res.render("login", {
        pageTitle: "Login Page",
        path: "/login",
        error: req.flash("loginErr"),
    });

}

// POST /login
const postLoginUser = (req, res, next) => {

    const {...loginFormData}= req.body;

    users.findOne({
        where: {
            nsu_id: loginFormData["nsu_id"],
        }
    })
        .then(fetchedUser => {

            if(!fetchedUser){ // user does not exists

                req.flash("loginErr",{
                    userDoesNotExist: true,
                });

                res.redirect("/login");

            }else{
                bcrypt.compare(loginFormData["password"],fetchedUser["password"])
                    .then(checkPass => {

                        if(!checkPass){

                            req.flash("loginErr",{
                                passwordMisMatch: true,
                            });
            
                            res.redirect("/login");
                        }else{

                            req.session.userData= {
                                uid: fetchedUser.u_id
                            }

                            res.cookie("_pass",fetchedUser.token,{httpOnly: true,maxAge: 30*24*60*60*1000});

                            res.redirect("/");
                        }
                    })
                    .catch(err =>  console.log(err));
            }
        })
        .catch(err => console.log("err"));

}

// POST /logout
const postLogout = (req, res, next) => {

}

module.exports = {
    getRegisterPage,
    postRegisterUser,
    getLoginPage,
    postLoginUser,
    postLogout,
}