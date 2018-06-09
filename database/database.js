const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let mongoPath = process.env.MONGODB_URI || "mongodb://ohzone:0hzone@ds253879.mlab.com:53879/teamtwit";
mongoose.connect(mongoPath);
let db = mongoose.connection;
let Schema = mongoose.Schema;
let sw = require("stopword");
let _ = require("underscore");
let bodyParser = require("body-parser");
let rp = require("remove-punctuation");
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connection Established.");
});

let tweetSchema = mongoose.Schema({}, { strict: false, versionKey: false });

const nationalTrends = mongoose.model("NationalTrend", new Schema({ trend: String, rank: Number, date: String }), "NationalTrends");
const stateTweet = mongoose.model("StateTweet", new Schema({ state: String, text: String }), "StateTweets");
const StateTopTenKeywords = mongoose.model("StateTopTenKeywords", tweetSchema);

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY"
];

let totalTweetArray = [];
let fiftyplusstates = [];
stateTweet.find()
  .exec()
  .then(res => {
    //Go through list of a state's tweets and format
    for (let doc of res) {
      let message = doc.text.split(" ");
      for (let state of states) {
        if (doc.state === state) {
          let obj = {};
          let message = doc.text.split(" ");
          let keywordCollection = sw.removeStopwords(message);
          let keyword = keywordCollection.map(word => {
            word = rp(word).toLowerCase();
            if (
              typeof word === "string" &&
              typeof word !== "undefined" &&
              word !== "" &&
              word !== " " &&
              word !== "-"
            ) {
              return word;
            }
          });
          let stateKeyWords = _.countBy(keyword);
          obj.state = state;
          obj.keywords = [stateKeyWords];
          totalTweetArray.push(obj);
        }
      }
    }

    for (let state of states) {
      //iterates through the list of 50 states (+DC)
      let stateObj = {};
      let stateName = {};
      let stateList = {};
      stateObj.trends = [];

      for (let tweet of totalTweetArray) {
        //each state has a list of tweets associated with it. This consolidates those into one list
        if (tweet.state === state) {
          tweet.keywords.forEach(list => {
            if (tweet.state === state) {
              let combinedStateKeywords = Object.assign(stateList, list);
              stateList = combinedStateKeywords;
            }
          });
        }
      }
      for (let key in stateList) {
        //formatting based on The Ohzone's Request, {word: "apple", count: 2}
        let word = "";
        let count = "";
        word = key;
        count = stateList[key];
        stateObj.trends.push({ word: word, count: count });
      }
      stateObj.trends.sort((a, b) => b.count - a.count); //after formatting, sort by count and slice the top 10
      stateObj.trends = stateObj.trends.slice(0, 10);

      let topKeywordsByState = { [state]: stateObj };
      fiftyplusstates.push(topKeywordsByState);
    }

    for (let state of fiftyplusstates) {
      //saves each as a document to mongodb, notice the schema for StateTopTenKeywords is a blank canvas with "strict: false", used this because mongodb does not allow dynamic keys in schema
      for (let key in state) {
        console.log(key);
        let data = new StateTopTenKeywords({ [key]: state[key] });
        data.save(function(err) {
          if (err) {
            console.log("error");
          }
          console.log("saved");
        });
      }
    }
  });

const getNationalTrends = async () => {
  let res = await nationalTrends.find({ rank: { $lte: 10 } }).select("trend");

  return res;
};

const getStatePercentages = async keyword => {
  let percents = await stateTweet.aggregate([
    {
      $group: {
        _id: "$state",
        state: { $first: "$state" },
        totalCount: { $sum: 1 },
        text: { $push: "$text" }
      }
    },
    {
      $unwind: "$text"
    },
    {
      $match: {
        text: { $regex: keyword.word, $options: "i" }
      }
    },
    {
      $group: {
        _id: "$state",
        state: { $first: "$state" },
        totalCount: { $first: "$totalCount" },
        matchCount: { $sum: 1 },
        text: { $push: "$text" }
      }
    },
    {
      $project: {
        _id: 0,
        state: 1,
        text: 1,
        percent: {
          $multiply: [{ $divide: ["$matchCount", "$totalCount"] }, 100]
        }
      }
    }
  ]);

  let percentsObj = {};
  let count = 0;
  for (let val of percents) {
    percentsObj[val.state] = {
      fillKey: Math.round(val.percent * 100) / 100,
      text: val.text.slice(0, 4)
    };
    count++;
  }

  return percentsObj;
};

module.exports.getNationalTrends = getNationalTrends;
module.exports.getStatePercentages = getStatePercentages;
