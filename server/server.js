const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database');

var app = express();

app.use(express.static(__dirname + '/../client/dist/'));
app.use(bodyParser.json());

app.get('/nationaltrends', (req, res) => {
  console.log('GET request for national trends');
  let trends = db.getNationalTrends();
  res.send(trends);
});

app.post('/statepercentages', (req, res) => {
  console.log('POST request for state percentages for ', req.body.word);
  let percents = db.getStatePercentages(req.body);
  res.send(percents);
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000!');
});