const axios = require('axios');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const RateLimiter = require('request-rate-limiter');
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
  const tenKCharGroups = [];
  while (cleanedUpText.length > 10000) {
    tenKCharGroups.push(cleanedUpText.slice(0, 10000));
    cleanedUpText = cleanedUpText.slice(10000);
  }
  tenKCharGroups.push(cleanedUpText);

  //
  // ─── IBM API ────────────────────────────────────────────────────────────────────
  //
  const limiter = new RateLimiter();

  const promiseArr = [];
  tenKCharGroups.forEach((group) => {
    const parameters = {
      features: { sentiment: {} },
      text: group,
    };
    // Limit the rate of the API calls so as not to get a 429 code
    promiseArr.push(new Promise((resolve, reject) => {
      limiter.request((err, backoff) => {
        if (err) {
          reject(err);
        } else {
          natural_language_understanding.analyze(parameters, (err, response) => {
            if (err && err.code === 429) {
              backoff();
            } else if (err) {
              console.log(err);
            } else {
              resolve(JSON.stringify(response, null, 2));
            }
          });
        }
      });
    }));
  });

  return axios.all(promiseArr)
    .then(results => results)
    .catch(console.log);
};

module.exports = getSentimentFromTweets;
