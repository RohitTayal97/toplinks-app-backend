const express = require("express");
const router = express.Router();
const Twit = require("twit");
const Tweet = require("../models/tweets");

router.get("/", (req, res) => {
  var T = new Twit({
    consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
    consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
    access_token: req.session.accessToken,
    access_token_secret: req.session.tokenSecret,
  });
  const user = profile.username;
  let ids = [];
  let allids = [];
  let cursor = "-1";

  try {
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

      // ids = ids.map((id) => BigInt(id));

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

    const tweets = await Tweet.find();
    res.json();
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
