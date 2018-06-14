const axios = require('axios');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const request = require('request');
const sw = require('stopword');
const rp = require('remove-punctuation');

const natural_language_understanding = new NaturalLanguageUnderstandingV1({
  username: '56c564c4-803c-4426-b197-055f3a2d6789',
  password: 'PyUJmDQ3C3uN',
  version: '2018-03-16',
});

const getSentimentFromTweets = (tweetTextArray) => {
  // Clean up the text for processing
  let cleanedUpText = tweetTextArray.join(' ');
  cleanedUpText = rp(cleanedUpText).split(' ');
  cleanedUpText = sw.removeStopwords(cleanedUpText).join(' ');

  // Split the text into groups of 10K characters
  let tenKCharGroups = [];
  while (cleanedUpText.length > 10000) {
    tenKCharGroups.push(cleanedUpText.slice(0, 10000));
    cleanedUpText = cleanedUpText.slice(10000);
  }
  tenKCharGroups = tenKCharGroups.slice(0, 1);

  //
  // ─── IBM API ────────────────────────────────────────────────────────────────────
  //
  const promiseArr = [];
  tenKCharGroups.forEach((group) => {
    const parameters = {
      features: { sentiment: {} },
      text: group,
    };
    promiseArr.push(new Promise((resolve, reject) => {
      natural_language_understanding.analyze(parameters, (err, response) => {
        if (err) { reject(err); } else { resolve(JSON.stringify(response, null, 2)); }
      });
    }));
  });

  return axios.all(promiseArr)
    .then(results => results)
    .catch(console.log);
};

module.exports = getSentimentFromTweets;
