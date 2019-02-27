
const joi= require("joi");

const {renderRegPage}= require("../utils/util");
const {users}= require("../models/index");

const userSchema= joi.object().keys({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    user_name: joi.string().alphanum().min(3).max(30).required(),
    nsu_id: joi.string().regex(/^[01][0-9][0-3]\d{4}(\d{3})?$/).required(),
    nsu_email: joi.string().email({ tldWhitelist: ["edu"] }).regex(/northsouth/).required(),
    alt_email: joi.string().email().required(),
    password: joi.string().alphanum().min(6).required(),
    re_password: joi.string().alphanum().min(6).required(),
});

const loginSchema= joi.object().keys({
	

});

const validateRegForm= (req,res,next) => {

    const error= [];

    const formInputErrorObj= {
        invalidName: false,
        invalidUserName: false,
        invalidNsuId: false,
        invalidNsuEmail: false,
        invalidAltEmail: false,
        invalidPasswd: false,
        passwdMisMatch: false,
    }

    const {...userFormData}= req.body;

    let isError= false;
    let errorKey= null;

    const isValid= joi.validate(userFormData,userSchema);

    if(isValid.error !== null){
        errorKey= isValid.error.details[0].context.key;
    }else{
        next();
    }

    if(errorKey === "first_name" || errorKey === "last_name"){
        formInputErrorObj["invalidName"]= true;
        isError= true;

        error.push(isError);
        error.push(formInputErrorObj);

        req.flash("info",error);

        res.redirect("/register");

    }else if(errorKey === "user_name"){
        formInputErrorObj["invalidUserName"]= true;
        isError= true;

        error.push(isError);
        error.push(formInputErrorObj);

        req.flash("info",error);

        res.redirect("/register");

    }else if(errorKey === "nsu_id"){
        formInputErrorObj["invalidNsuId"]= true;
        isError= true;

        error.push(isError);
        error.push(formInputErrorObj);

        req.flash("info",error);

        res.redirect("/register");

    }else if(errorKey === "nsu_email"){
        formInputErrorObj["invalidNsuEmail"]= true;
        isError= true;

        error.push(isError);
        error.push(formInputErrorObj);

        req.flash("info",error);

        res.redirect("/register");

    }else if(errorKey === "alt_email"){
        formInputErrorObj["invalidAltEmail"]= true;
        isError= true;

        error.push(isError);
        error.push(formInputErrorObj);

        req.flash("info",error);

        res.redirect("/register");

    }else if(errorKey === "password"){
        formInputErrorObj["invalidPasswd"]= true;
        isError= true;

        error.push(isError);
        error.push(formInputErrorObj);

        req.flash("info",error);

        res.redirect("/register");

    }else if(userFormData.password !== userFormData.re_password){
        formInputErrorObj["passwdMisMatch"]= true;
        isError= true;

        error.push(isError);
        error.push(formInputErrorObj);

        req.flash("info",error);

        res.redirect("/register");

    }
}

const validateLogInForm= (req,res,next) => {
    
    const {...loginFormData}= req.body;

}


module.exports= {
    userSchema,
    validateRegForm,
    validateLogInForm,
}