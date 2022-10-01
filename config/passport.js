require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/user');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTSECRETKEY;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            let user = await User.findById(jwt_payload.id)?.select("-password").populate("roleId", "-deleted");
            if (user) {
                return done(null, user)
            }
            return done(null, false);
            
        } catch (error) {
            console.log(error)
        }
    }))
}