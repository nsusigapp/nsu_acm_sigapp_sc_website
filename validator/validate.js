
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

const validateRegForm= (req,res,next) => {

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

    let error= false;
    let errorKey= null;

    const isValid= joi.validate(userFormData,userSchema);

    if(isValid.error !== null){
        errorKey= isValid.error.details[0].context.key;
    }else{
        next();
    }

    if(errorKey === "first_name" || errorKey === "last_name"){
        formInputErrorObj["invalidName"]= true;
        error= true;

        return renderRegPage(res,error,false,formInputErrorObj);

    }else if(errorKey === "user_name"){
        formInputErrorObj["invalidUserName"]= true;
        error= true;

        return renderRegPage(res,error,false,formInputErrorObj);

    }else if(errorKey === "nsu_id"){
        formInputErrorObj["invalidNsuId"]= true;
        error= true;

        return renderRegPage(res,error,false,formInputErrorObj);

    }else if(errorKey === "nsu_email"){
        formInputErrorObj["invalidNsuEmail"]= true;
        error= true;

        return renderRegPage(res,error,false,formInputErrorObj);

    }else if(errorKey === "alt_email"){
        formInputErrorObj["invalidAltEmail"]= true;
        error= true;

        return renderRegPage(res,error,false,formInputErrorObj);

    }else if(errorKey === "password"){
        formInputErrorObj["invalidPasswd"]= true;
        error= true;

        return renderRegPage(res,error,false,formInputErrorObj);

    }else if(userFormData.password !== userFormData.re_password){
        formInputErrorObj["passwdMisMatch"]= true;
        error= true;

        return renderRegPage(res,error,false,formInputErrorObj);
    }
}

// const checkIfExistsAndCreateUser= (res,userFormData,registerUser)=>{

//     const dbFetchErrorObj= {
//         userNameExists: false,
//         emailExists: false,
//         nsuIdExists: false,
//     }

//     let errorDb= false;

//     users.findAll({
//         attributes: ["u_id"],
//         where: {
//             user_name: userFormData.user_name,
//         }
//     })
//     .then(userNameData => {
//         if(userNameData.length > 1){
//             dbFetchErrorObj["userNameExists"]= true;
//             errorDb= true;

//             return renderRegPage(res,errorDb,dbFetchErrorObj);

//         }else{
//             users.findAll({
//                 attributes: ["u_id"],
//                 where: {
//                     nsu_id: userFormData.nsu_id
//                 }
//             })
//             .then(userIdData => {
//                 if(userIdData.length > 1){
//                     dbFetchErrorObj["nsuIdExists"]= true;
//                     errorDb= true;

//                     return renderRegPage(res,errorDb,dbFetchErrorObj);
                    
//                 }else{
//                     users.findAll({
//                         attributes: ["u_id"],
//                         where: {
//                             nsu_email: userFormData.nsu_email
//                         }
//                     })
//                     .then(userEmailData => {
//                         if(userEmailData.length > 1){
//                             dbFetchErrorObj["emailExists"]= true;
//                             errorDb= true;
        
//                             return renderRegPage(res,errorDb,dbFetchErrorObj);
//                         }else{

//                             return registerUser();
//                         }
//                     })
//                     .catch(err => console.log(err));
//                 }
//             })
//             .catch(err => console.log(err));
//         }
//     })
//     .catch(err => console.log(err));
// }


module.exports= {
    userSchema,
    validateRegForm,
    // checkIfExistsAndCreateUser,
}