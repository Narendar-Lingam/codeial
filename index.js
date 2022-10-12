const express=require('express');
const cookieParser=require('cookie-parser')
const port=8000;
const app=express();
const expresslayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local')
// because we need to store the session information
const MongoStore=require('connect-mongo')(session);
// const cookieParser = require('cookie-parser');   
const { mongo } = require('mongoose');
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'))
app.use(expresslayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true); 
app.set('layout extractScripts',true);



// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');
// mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
    // Todo change before  deployment in production mode                                                                                        
    secret:'blahsomething',
    saveUninitialized:false,
    resave: false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
        {
        mongooseConnection:db,
        autoRemove:'disabled'
        },
    function(err){
        console.log(err || 'connect-mongo set up ok')
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err){
        // console.log("error");
        console.log(`Error in running the server:${err}`)
    }
    console.log(`server is running on port:${port}`);
})


