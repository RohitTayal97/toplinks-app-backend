const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;
const Tweet = require("./models/tweets");

const passportInit = () => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  const callback = async (accessToken, tokenSecret, profile, cb) => {
    var Twit = require("twit");

    var T = new Twit({
      consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
      consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
      access_token: accessToken,
      access_token_secret: tokenSecret,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    });
    console.log("########profile", profile);

    T.get(
      "search/tweets",
      { q: "filter:links -RT", count: 100, result_type: "recent" },
      async (err, data, response) => {
        // data.map((tweetObj) => {
        //   await new Tweet({
        //     tweet_id: tweetObj.id_str,
        //     text: tweetObj.text,
        //     author_name: tweetObj.user.screen_name,
        //   }).save();
        // });
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
