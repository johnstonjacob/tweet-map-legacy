const fs = require('fs');

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
}

let tweetArr = fs.readFileSync('./database/tweets.json');
tweetArr = JSON.parse(tweetArr);

const writeStream = fs.createWriteStream('./database/tweets-state.json');
let count = 0;

for (tweet of tweetArr) {
  let state = undefined;

  if (tweet.placeType === 'city') {
    state = tweet.placeFull.slice(tweet.placeFull.length - 2);
  } else if (tweet.placeType === 'admin' && Object.keys(acronyms).includes(tweet.placeName)){
    state = acronyms[tweet.placeName];
  }

  if (state !== undefined) {
    count++;
    let newText = tweet.text.replace(/,/gi, ' ');
    newText = newText.replace(/\n/gi, ' ');
  
    if (count > 1) {
      writeStream.write('\n');
    }

    writeStream.write(JSON.stringify({
      state: state,
      text: newText
    }));
  }
}

writeStream.write('\n')
writeStream.end();
console.log(`Converted ${count} tweets!`);