const axios = require('axios');
const request = require('request');
const sw = require('stopword');
const rp = require('remove-punctuation');

const getSentimentFromTweets = (tweetTextArray) => {
  // Clean up the text for processing
  let cleanedUpText = tweetTextArray.join(' ');
  cleanedUpText = rp(cleanedUpText);
  cleanedUpText = sw.removeStopwords(cleanedUpText);

  // Split the text into groups of 10K characters
  const tenKCharGroups = [];
  while (cleanedUpText.length > 10000) {
    tenKCharGroups.push(cleanedUpText.slice(0, 10000));
    cleanedUpText = cleanedUpText.slice(10000);
  }

  //
  // ─── IBM API ────────────────────────────────────────────────────────────────────
  //
  axios.all;
};

export default getSentimentFromTweets;
