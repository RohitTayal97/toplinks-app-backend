const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;

const passportInit = () => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  const callback = (accessToken, tokenSecret, profile, cb) => {
    var Twit = require("twit");

    var T = new Twit({
      consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
      consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
      access_token: accessToken,
      access_token_secret: tokenSecret,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    });

    T.get(
      "search/tweets",
      { q: "has:links", count: 100, result_type: "recent" },
      function (err, data, response) {
        console.log("########tweets", data);
      }
    );

    return cb(null, profile);
  };

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
