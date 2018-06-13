//Run this file to stream tweets from Twitter, saved to tweets.json
//Time is set on the last line of the file

const Twit = require('twit');
const fs = require('fs');
const db = require('./database.js');

const twit = new Twit({
  consumer_key:         'm6kmS86SUUK2klF4bLTcOc6On',
  consumer_secret:      'b7wfrtKleDsfgtkF0L3m2j0bh8K4StlXVvZppgpF6Ij1hTDypA',
  access_token:         '1001852482828500992-7CpD2KafBQ6qqWpcMQWv4TyC9I22ad',
  access_token_secret:  'zljSTq0DcQo02x3ZXCVYDB8Y3wCsORMXZwpzDyRTGfCc9'
});

const US = ['-177', '18.0', '-65.0', '72.0'];

const acronyms = {
  "Alabama": "AL", 
  "Alaska": "AK", 
  "Arizona": "AZ", 
  "Arkansas": "AR", 
  "California": "CA", 
  "Colorado": "CO", 
  "Connecticut": "CT", 
  "Delaware": "DE", 
  "District Of Columbia": "DC", 
  "Florida": "FL", 
  "Georgia": "GA", 
  "Hawaii": "HI", 
  "Idaho": "ID", 
  "Illinois": "IL", 
  "Indiana": "IN", 
  "Iowa": "IA", 
  "Kansas": "KS", 
  "Kentucky": "KY", 
  "Louisiana": "LA", 
  "Maine": "ME", 
  "Maryland": "MD", 
  "Massachusetts": "MA", 
  "Michigan": "MI", 
  "Minnesota": "MN", 
  "Mississippi": "MS", 
  "Missouri": "MO", 
  "Montana": "MT", 
  "Nebraska": "NE", 
  "Nevada": "NV", 
  "New Hampshire": "NH", 
  "New Jersey": "NJ", 
  "New Mexico": "NM", 
  "New York": "NY", 
  "North Carolina": "NC", 
  "North Dakota": "ND", 
  "Ohio": "OH", 
  "Oklahoma": "OK", 
  "Oregon": "OR", 
  "Pennsylvania": "PA", 
  "Rhode Island": "RI", 
  "South Carolina": "SC", 
  "South Dakota": "SD", 
  "Tennessee": "TN", 
  "Texas": "TX", 
  "Utah": "UT", 
  "Vermont": "VT", 
  "Virginia": "VA", 
  "Washington": "WA", 
  "West Virginia": "WV", 
  "Wisconsin": "WI", 
  "Wyoming": "WY", 
};

const writeStream = fs.createWriteStream('./database/tweets.json');
let count = 0;
writeStream.write('[\n');
const stream = twit.stream('statuses/filter', {locations: US});

let stateObj = {};

stream.on('tweet', (tweet) => {

  if (tweet.place !== null && tweet.place.country_code === 'US' && (tweet.place.place_type === 'city' || tweet.place.place_type === 'admin')) {
    let state = undefined;

    if (tweet.place.place_type  === 'city') {
      state = tweet.place.full_name.slice(tweet.place.full_name.length - 2);
    } else if (tweet.placeType === 'admin' && Object.keys(acronyms).includes(tweet.placeName)){
      state = acronyms[tweet.placeName];
    }

    if (state !== undefined) {
      count++;
      let newText = tweet.text.replace(/,/gi, ' ');
      newText = newText.replace(/\n/gi, ' ');
    
    }
    console.log(state, tweet.text);

    let tweetText = tweet.text;

    // if (count > 1) {
    //   writeStream.write(',\n');
    // }
    if (tweet.retweeted_status !== undefined) {
      tweetText += " ~ " + tweet.retweeted_status.text;
    } 
    if (tweet.quoted_status !== undefined) {
      tweetText += " ~ " + tweet.quoted_status.text;
    }
    
    // writeStream.write(JSON.stringify({
      
      // db.saveStateTweet({
      //   'state': state,
      //   'text': tweet.text
      // })

    db.saveTweet({
      placeName: tweet.place.name,
      placeFull: tweet.place.full_name,
      country: tweet.place.country_code,
      text: tweetText
    });
      // placeType: tweet.place.place_type,
      // placeName: tweet.place.name,
      // placeFull: tweet.place.full_name,
      // country: tweet.place.country_code,
      // text: tweetText
    // }));

  }
});

setTimeout(() => {
  stream.stop();
  writeStream.write('\n]')
  writeStream.end();
  console.log(`Stored ${count} tweets!`);
}, 60 * 1000);//900000);