
const express = require("express");

const redis = require("redis").createClient();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const flash = require("connect-flash");
const helmet = require("helmet");
const dotenv = require("dotenv");
const csurf = require("csurf");
const compression = require("compression");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");
const searchRoutes = require("./routes/search");
const forumPostRoutes = require("./routes/fpost");
const blogPostRoutes = require("./routes/blog");
const profileRoutes = require("./routes/profile");
const frontendValidationRoutes = require("./routes/frontendValidation");
const ajForumRoutes = require("./routes/ajforum");
const ajBlogRoutes = require("./routes/ajblog");
const ajCommonRoutes = require("./routes/ajcommon");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const errorRoutes = require("./routes/errors");

const userDataMiddleware = require("./middlewares/userData");
const authMiddleWare = require("./middlewares/auth");

const app = express();

dotenv.config();

app.set("view engine", "ejs");

app.set("views", "views");

app.use(express.static(__dirname + "/public"));

app.use(compression());

app.use(helmet());

app.use(cookieParser(process.env.SCOOK_SECRET));

app.use(session({
    name: "_sid",
    secret: process.env.SCOOK_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
        host: "localhost",
        port: 6378,
        client: redis,
    }),
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(flash());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next)=>{

//     if(req.sessionID)
//         console.log(req.sessionID);
//         console.log(req.session.id);
//         console.log(req.session);
//         console.log(req.headers["x-forwarded-for"] || req.connection.remoteAddress);
//         console.log(req.ip);
//         console.log(req.ips);

//     next();
// });

// check if user is logged in

// app.use(function(req, res, next) {
    
//     const start = process.hrtime();

//     res.on("finish", () => {

//         const elapsed = process.hrtime(start);
//         const elapsedTimeInMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
//         console.log("%s : %fms", req.path, elapsedTimeInMs);

//     });

//     next();

// });

app.use(authMiddleWare.isLoggedIn);

app.use(userDataMiddleware.fetchNavBarInfo);

app.use(userRoutes.router);

app.use(profileRoutes.router);

app.use(forumPostRoutes.router);

app.use(blogPostRoutes.router);

app.use(ajForumRoutes.router);

app.use(ajBlogRoutes.router);

app.use(ajCommonRoutes.router);

app.use(searchRoutes.router);

app.use(frontendValidationRoutes.router);

app.use(authRoutes.router);

app.use(adminRoutes.router);

app.use(errorRoutes.router);

app.listen(3000, "192.168.0.106", () => {
    console.log("Server started on port: 3000");
});

