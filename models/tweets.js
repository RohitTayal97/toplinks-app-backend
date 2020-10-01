const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  tweet_id: { type: String, required: true },
  text: { type: String, required: true },
  author_name: { type: String, required: true },
  // extended_entities: { type: Object, required: true },
});

module.exports = mongoose.model("Tweet", tweetSchema);
