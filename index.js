import env from "dotenv";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { Strategy } from "passport-local";
import express from "express";
import pg from "pg";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt, { hash } from "bcrypt";


const app = express(); 
const port = 3000;
const saltRounds= 10;
env.config();

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})

db.connect();

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res)=>{
    res.render("index.ejs")
})

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});


app.get("/register", (req, res)=>{
    res.render("register");
});

app.get("/expenses", (req, res)=>{
    if(req.isAuthenticated()){
        res.render("dashboard.ejs");
    }else{
        res.redirect("/login");
    } 
});

app.post("/register", async(req, res)=>{
    const newUser = req.body;
    try{
        const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [newUser.email]);
        if(checkUser.rows.length>0){
            res.redirect("/login")
        }else{
            
            bcrypt.hash(newUser.password, saltRounds, async (err, hash)=>{
                if(err){
                    console.log(err);
                }else{
                    const result = await db.query("INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *", [newUser.name, newUser.email, hash]);
                    const user = result.rows[0];
                    req.login(user, (err)=>{
                        console.log("Success");
                        res.redirect("/expenses")
                    });  
                }
            });
        }
    }catch(err){
        console.log(err)
    }   
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/expenses",
    failureRedirect: "/login"
}));

passport.use("local", new Strategy(async function verify(username, password, cb) {
    try{
        const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [username]);
        if(checkUser.rows.length>0){
           const user = checkUser.rows[0];
            bcrypt.compare(password, user.password, (err, valid)=>{
                if(err){
                    return cb(err);
                }else if(valid){
                    return cb(null, user);
                }else{
                    console.log("wrong password")
                    return cb(null, false)
                }
            })
        }else{
            return cb("User Don't exist");
        }
    }catch(err){
        return cb(err);
    }
}));

passport.use("google", new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbabckURL: process.env.CALLBACK_URL,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    }, async( accessToken, refreshToken, profile, cb) =>{
        try{
            console.log(profile);

        }catch(err){
            return cb(err)
        }
        return cb(null, profile);
    }
));

passport.serializeUser((user, cb)=>{
    cb(null, user);
});
passport.deserializeUser((user, cb)=>{
    cb(null, user);
});


app.listen(port, () =>{
    console.log(`app is running on port ${port}`);
})
