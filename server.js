
const express= require("express");

const cookieParser= require("cookie-parser");
const helmet= require("helmet");
const csurf= require("csurf");
const compression= require("compression");
const bodyParser= require("body-parser");
const axios= require("axios");

const authRoutes= require("./routes/auth");

const app= express();

app.set("view engine","ejs");

app.set("views","views");

app.use(express.static(__dirname + "/public"));

app.use(compression());

app.use(helmet());

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/",authRoutes.router);


app.listen(3000,()=>{
    console.log("server started on port: 3000");
});