
const express= require("express");

const redis= require("redis").createClient();
const cookieParser= require("cookie-parser");
const session= require("express-session");
const RedisStore = require("connect-redis")(session);
const flash = require("connect-flash");
const helmet= require("helmet");
const csurf= require("csurf");
const compression= require("compression");
const bodyParser= require("body-parser");
const config= require("config");

const authRoutes= require("./routes/auth");

const app= express();

app.set("view engine","ejs");

app.set("views","views");

app.use(express.static(__dirname + "/public"));

app.use(compression());

app.use(helmet());

app.use(cookieParser(config.get("auth")["cookiesecret"]));

app.use(session({
    name: "_sid",
    secret: config.get("auth")["sessionsecret"],
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
        host: "localhost",
        port: 6378,
        client: redis,
    }),
    cookie: {maxAge: 6000000}
}));

app.use(flash());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

// user routes

app.get("/",(req,res,next)=>{
    res.send("<h1>Hello There!</h1>");
});

app.use("/",authRoutes.router);

app.listen(3000,()=>{
    console.log("server started on port: 3000");
});