const Twit = require('twit');
const fs = require('fs');

const twit = new Twit({
  consumer_key:         'm6kmS86SUUK2klF4bLTcOc6On',
  consumer_secret:      'b7wfrtKleDsfgtkF0L3m2j0bh8K4StlXVvZppgpF6Ij1hTDypA',
  access_token:         '1001852482828500992-7CpD2KafBQ6qqWpcMQWv4TyC9I22ad',
  access_token_secret:  'zljSTq0DcQo02x3ZXCVYDB8Y3wCsORMXZwpzDyRTGfCc9'
});

const US = ['-177', '18.0', '-65.0', '72.0'];

const writeStream = fs.createWriteStream('./database/tweets.json');
let count = 0;
writeStream.write('[\n');
const stream = twit.stream('statuses/filter', {locations: US});

let stateObj = {};

stream.on('tweet', (tweet) => {
  if (tweet.place !== null && tweet.place.country_code === 'US' && (tweet.place.place_type === 'city' || tweet.place.place_type === 'admin')) {

    count++;
    let tweetText = tweet.text;

    if (count > 1) {
      writeStream.write(',\n');
    }

    if (tweet.retweeted_status !== undefined) {
      tweetText += " ~ " + tweet.retweeted_status.text;
    } 
    if (tweet.quoted_status !== undefined) {
      tweetText += " ~ " + tweet.quoted_status.text;
    }

    writeStream.write(JSON.stringify({
      placeType: tweet.place.place_type,
      placeName: tweet.place.name,
      placeFull: tweet.place.full_name,
      country: tweet.place.country_code,
      text: tweetText
    }));

  }
});

setTimeout(() => {
  stream.stop();
  writeStream.write('\n]')
  writeStream.end();
  console.log(`Stored ${count} tweets!`);
}, 900000);