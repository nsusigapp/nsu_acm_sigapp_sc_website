const {users}= require("../models/index");
const {validateRegForm}= require("../validator/validate");
const {checkIfExistsAndCreateUser}= require("../validator/validate");
const {renderRegPage}= require("../utils/util");


const bcrypt = require('bcrypt');

const saltRounds= 10;

const Op = require("sequelize").Op;

// GET /register
const getRegisterPage= (req,res,next)=>{

    renderRegPage(res,false,null);
}

// POST /register
const postRegisterUser= (req,res,next)=>{

    const {...userFormData}= req.body;

    console.log(userFormData)

    let [error,formInputErrorObj]= validateRegForm(userFormData);

    if(error){
        return renderRegPage(res,error,formInputErrorObj);
    }else{
        checkIfExistsAndCreateUser(res,userFormData,()=>{

            const {re_password,...userDbData}= userFormData;
    
            userDbData.status= 1;

            userDbData.token= users.generateAuthToken({
                nsu_id: userDbData.nsu_id,
                user_name: userDbData.user_name,
                role_id: userDbData.role_id,
                status: userDbData.status,
            });

            users.create(userDbData)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        });
    }
    
}

module.exports= {
    getRegisterPage,
    postRegisterUser,
}