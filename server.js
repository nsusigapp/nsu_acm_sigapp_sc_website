
const express= require("express");

const cookieParser= require("cookie-parser");
const helmet= require("helmet");
const csurf= require("csurf");
const bodyParser= require("body-parser");

const app= express();

app.set("view engine","ejs");
app.set("views","views");

app.use(express.static(process.cwd() + "/public"));

app.use(helmet());

app.use(bodyParser.urlencoded({extended: false}));

app.get("/",(req,res,next)=>{
    res.render("index");
});


app.listen(3000,()=>{
    console.log("server started on port: 3000");
});