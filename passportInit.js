const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;
const Tweet = require("./models/tweets");

const passportInit = () => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  const callback = async (accessToken, tokenSecret, profile, cb) => {
    try {
      var Twit = require("twit");
      var T = new Twit({
        consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
        consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
        access_token: accessToken,
        access_token_secret: tokenSecret,
        // timeout_ms: 60 * 1000,
      });
      const user = profile.username;
      let ids = [];
      let allids = [];
      let cursor = "-1";

      while (cursor !== "0") {
        T.get(
          "friends/ids",
          {
            screen_name: user,
            cursor: cursor,
            stringify_ids: true,
            count: 100,
          },
          (err, data, response) => {
            ids = data.ids;
            cursor = data.next_cursor_str;
          }
        );

        ids = ids.map((id) => BigInt(id));

        T.get(
          "users/lookup",
          {
            user_id: ids,
          },
          (err, data, response) => {
            ids = data.map((userObj) => {
              return userObj.screen_name;
            });
          }
        );
      }
      allids = [...allids, ...ids];
      allids.push(user);

      allids.forEach((username) => {
        T.get(
          "search/tweets",
          {
            q: `from:${username} filter:links -RT`,
            count: 100,
            result_type: "recent",
          },
          (err, data, response) => {
            console.log("####tweets", data);
            data.map(async (tweetObj) => {
              await new Tweet({
                tweet_id: tweetObj.id_str,
                text: tweetObj.text,
                author_name: tweetObj.user.screen_name,
              }).save();
            });
          }
        );
      });
    } catch (error) {
      console.log(error);
    }

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
