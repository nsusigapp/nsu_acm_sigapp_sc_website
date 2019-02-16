const {users}= require("../models/index");
const bcrypt = require('bcrypt');

const saltRounds= 10;

const Op = require("sequelize").Op;

// GET /register
const getRegisterPage= (req,res,next)=>{
    res.render("registration",{
        pageTitle: "Sign Up || Registration",
        path: "/register",
        error: false,
        errorMsg: null,
    });
}

// POST /register
const postRegisterUser= (req,res,next)=>{

    const userFormData= {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        nsu_id: req.body.nsu_id,
        nsu_email: req.body.nsu_email,
        alt_email: req.body.alt_email,
        password: req.body.password,
        re_password: req.body.re_password
    }

    const renderPage= (res,error,errorObj)=>{
        res.render("registration",{
            pageTitle: "Registration Page",
            path: "/registration",
            error: error,
            errorMsg: errorObj,
        });
    }

    const errorObj= {
        userNameExists: false,
        emailExists: false,
        nsuIdExists: false,
    }

    let error= false;
    
    users.findAll({
        attributes: ["u_id"],
        where: {
            user_name: userFormData.user_name,
        }
    })
    .then(userNameData => {
        if(userNameData.length > 1){
            errorObj["userNameExists"]= true;
            error= true;

            renderPage(res,error,errorObj);

        }else{
            users.findAll({
                attributes: ["u_id"],
                where: {
                    nsu_id: userFormData.nsu_id
                }
            })
            .then(userIdData => {
                if(userIdData.length > 1){
                    errorObj["nsuIdExists"]= true;
                    error= true;

                    renderPage(res,error,errorObj);
                    
                }else{
                    users.findAll({
                        attributes: ["u_id"],
                        where: {
                            nsu_email: userFormData.nsu_email
                        }
                    })
                    .then(userEmailData => {
                        if(userEmailData.length > 1){
                            errorObj["emailExists"]= true;
                            error= true;
        
                            renderPage(res,error,errorObj);
                        }
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));


}

module.exports= {
    getRegisterPage,
    postRegisterUser,
}