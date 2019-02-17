// helper
const renderRegPage= (res,error,errorObj)=>{
    res.render("registration",{
        pageTitle: "Registration Page",
        path: "/registration",
        error: error,
        errorMsg: errorObj,
    });
}

module.exports= {
    renderRegPage,
}