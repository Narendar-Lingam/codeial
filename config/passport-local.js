const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
// Authentication using passposrt
passport.use(new LocalStrategy({
    usernameField:'email'
    },
    function(email,password,done){
        // find a user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){console.log('error in finding user ---> Passposrt');
            return done(err)
        }
        if(!user || user.password !=password){
            console.log('Invalid username/password')
            return done(null,false);

        }
        return done(null,user);
        })
    }

));

// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
})

// deserializing the user from the key in the cookie

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user ---> Passposrt');
            return done(err)
        }
        return done(null,user);
    })
})

passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user

    }
    next()
}

module.exports=passport;