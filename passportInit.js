const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;

const passportInit = () => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  const callback = (accessToken, refreshToken, profile, cb) =>
    cb(null, profile);

  passport.use(
    new Strategy(
      {
        consumerKey: `${process.env.TWITTER_CONSUMER_KEY}`,
        consumerSecret: `${process.env.TWITTER_CONSUMER_SECRET}`,
        callbackURL: `${process.env.CALLBACK_URL}`,
      },
      callback
    )
  );
};

module.exports = passportInit;
