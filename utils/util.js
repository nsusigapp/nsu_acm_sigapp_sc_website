// helper
const renderRegPage= (req,res,isSuccess)=>{
    res.render("registration",{
        pageTitle: "Registration Page",
        path: "/registration",
        error: req.flash("info"),
        regSuccess: isSuccess,
    });
}

module.exports= {
    renderRegPage,
}
