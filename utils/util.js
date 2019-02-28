// helper
const renderRegPage= (req,res)=>{

    res.render("registration",{
        pageTitle: "Registration Page",
        path: "/registration",
        error: req.flash("info"),
        regSuccess: req.flash("regInfo"),
    });
}

module.exports= {
    renderRegPage,
}
