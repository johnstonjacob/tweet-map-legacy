// Commenting out the code below and running this
// file will populate the database with each state's top keywords
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ silent: true });

mongoose.Promise = global.Promise;
const mongoPath = process.env.MONGO_URL;
mongoose.connect(mongoPath);
const db = mongoose.connection;
const Schema = mongoose.Schema;
const sw = require('stopword');
const _ = require('underscore');
const bodyParser = require('body-parser');
const rp = require('remove-punctuation');

db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('Connection Established.');
});


//
// ─── MODELS ─────────────────────────────────────────────────────────────────────
//
const nationalTrend = mongoose.model(
  'NationalTrend',
  new Schema({ trend: String, rank: Number, date: String }), 'NationalTrends',
);

const globalTrend = mongoose.model(
  'GlobalTrend',
  new Schema({ trend: String, rank: Number, date: String }), 'GlobalTrends',
);

const stateTweet = mongoose.model(
  'StateTweet',
  new Schema({ state: String, text: String }), 'StateTweets',
);

const stateKeyword = mongoose.model(
  'StateKeyword',
  new Schema({}), 'statekeywords',
);

const Tweet = mongoose.model(
  'Tweet',
  new Schema({
    place: String,
    state: String,
    country: String,
    text: String,
    username: String,
    link: String,
    createdAt: Date,
    latitude: Number,
    longitude: Number,
  }), 'Tweets',
);


//
// ─── METHODS ────────────────────────────────────────────────────────────────────
//
const saveStateTweet = (data) => {
  stateTweet(data).save();
};

const saveTweet = (data) => {
  Tweet(data).save();
};

const saveNationalTrend = (data) => {
  nationalTrend(data).save();
};

const saveGlobalTrend = (data) => {
  globalTrend(data).save();
};

const getNationalTrends = async () => {
  const res = await nationalTrend.find({ rank: { $lte: 15 } }).select('trend');
  return res;
};

const getStateKeywords = async () => {
  const res = await stateKeyword.find({});
  return res;
};

const getStatePercentages = async (keyword) => {
  const percents = await stateTweet.aggregate([
    {
      $group: {
        _id: '$state',
        state: { $first: '$state' },
        totalCount: { $sum: 1 },
        text: { $push: '$text' },
      },
    },
    {
      $unwind: '$text',
    },
    {
      $match: {
        text: { $regex: keyword.word, $options: 'i' },
      },
    },
    {
      $group: {
        _id: '$state',
        state: { $first: '$state' },
        totalCount: { $first: '$totalCount' },
        matchCount: { $sum: 1 },
        text: { $push: '$text' },
      },
    },
    {
      $project: {
        _id: 0,
        state: 1,
        text: 1,
        percent: {
          $multiply: [{ $divide: ['$matchCount', '$totalCount'] }, 100],
        },
      },
    },
  ]);

  const percentsObj = {};
  for (const val of percents) {
    percentsObj[val.state] = {
      fillKey: Math.round(val.percent * 100) / 100,
      text: val.text.slice(0, 5),
    };
  }

  return percentsObj;
};
// ────────────────────────────────────────────────────────────────────────────────

module.exports = {
  saveTweet,
  saveStateTweet,
  saveNationalTrend,
  saveGlobalTrend,
  getNationalTrends,
  getStateKeywords,
  getStatePercentages,
};
