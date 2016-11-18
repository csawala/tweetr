"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    saveTweet: function(newTweet, callback) {     // SAVE TO DB
      db.collection("tweets").insert(newTweet);
      callback(null, true);
    },

    getTweets: function(callback) {     // PULL FROM DB
      db.collection("tweets").find().toArray(callback)
    }

  };
}
