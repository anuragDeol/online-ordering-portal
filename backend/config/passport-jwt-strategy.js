const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require("../models/user");

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),   // bearer has the the 'jwt' token
    secretOrKey: process.env.JWT_SECRET     // encryption and decryption key
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done) {  // 'jwtPayLoad' contains the payload (which is inside the jwt token), and it contains User's info
    User.findById(jwtPayLoad._id, function(err, user) {
        if(err) {
            console.log(err);
            return done(err);
        }

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));


module.exports = passport;


