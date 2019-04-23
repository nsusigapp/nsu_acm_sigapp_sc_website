
const { users: User, email_queue: EmailQueue, sequelize } = require("../models/index");

const bcrypt = require('bcrypt');

const saltRounds = 10;

const Op = require("sequelize").Op;

const userStatus = {
    ACTIVE: 1,
    IN_ACTIVE: 0
}

const roleID = {
    USER: 1,
}

// -----------------------------------------------------------------------

// GET /register
const getRegisterPage = (req, res, next) => {

    return res.render("registration", {
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

            userDbData.token = User.generateAuthToken({
                nsu_id: userDbData.nsu_id,
                role_id: roleID.USER,
                status: userStatus.IN_ACTIVE,
            });

            sequelize.transaction(function (t) {

                return User.create(userDbData, { transaction: t })
                    .then(resCreate => {

                        const headers = {
                            from: 'Sender Name <sender@example.com>',
                            to: 'Recipient <recipient@example.com>',
                            subject: 'Nodemailer is unicode friendly ✔',
                        }

                        return EmailQueue.create({
                            send_to: userDbData.nsu_email,
                            e_from: "sigapp@yoo.org",
                            email_headers: JSON.stringify(headers),
                            email_description: "<p><b>Hello</b> to myself!</p>",
                            send_progress: "Queued",
                            sent_at: Date.now(),
                        }, { transaction: t })
                            .then(resQueue => {

                                isSuccess = true;

                                req.flash("regInfo", isSuccess);

                                return res.redirect("/register");
                            })
                            .catch(err => console.log(err));
                    })
            })
                .catch(err => {

                    // roll back if error occurs
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

    return res.render("login", {
        pageTitle: "Login Page",
        path: "/login",
        error: req.flash("loginErr"),
    });

}

// POST /login
const postLoginUser = (req, res, next) => {

    const { ...loginFormData } = req.body;

    User.findOne({
        where: {
            nsu_id: loginFormData["nsu_id"],
        }
    })
        .then(fetchedUser => {

            if (!fetchedUser) { // user does not exists

                req.flash("loginErr", {
                    userDoesNotExist: true,
                });

                return res.redirect("/login");

            } else if (fetchedUser.status === 0) {

                req.flash("loginErr", {
                    bannedUser: true,
                });

                return res.redirect("/login");

            } else {

                bcrypt.compare(loginFormData["password"], fetchedUser["password"])
                    .then(checkPass => {

                        if (!checkPass) {

                            req.flash("loginErr", {
                                passwordMisMatch: true,
                            });

                            return res.redirect("/login");

                        } else {

                            req.session.userData = {
                                uid: fetchedUser.u_id,
                                user_name: fetchedUser.user_name,
                                nsu_id: fetchedUser
                            }

                            res.cookie("_pass", fetchedUser.token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

                            return res.redirect("/");
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log("err"));
}

// POST /logout
const postLogout = (req, res, next) => {

    req.session.destroy(err => {
        res.clearCookie("_pass");
        return res.redirect('/');
    });

}

module.exports = {
    getRegisterPage,
    postRegisterUser,
    getLoginPage,
    postLoginUser,
    postLogout,
}