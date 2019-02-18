// helper
const renderRegPage= (res,error,isSuccess,errorObj)=>{
    res.render("registration",{
        pageTitle: "Registration Page",
        path: "/registration",
        error: error,
        regSuccess: isSuccess,
        errorMsg: errorObj,
    });
}

module.exports= {
    renderRegPage,
}