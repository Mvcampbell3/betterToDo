const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../models");

passport.use(new LocalStrategy({ usernameField: "email" }, function(email, password, done) {
  db.User.findOne({ email })
    .then(user => {
      if (!user) {
        return done(null, false, { msg: "Email is not registered" })
      }

      const match = user.validatePassword(password);

      if (!match) {
        return done(null, false, { msg: "Password is incorrect" })
      }

      return done(null, { email: user.email, username: user.username, id: user._id, todos: user.todos })
    })
}))

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;