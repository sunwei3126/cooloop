var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
        var conditions = {};
        if (username.indexOf('@') === -1) {
          conditions.username = username;
        }
        else {
          conditions.email = username.toLowerCase();
        }
      
      User.findOne(conditions, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);
      });
    }
  ));
};