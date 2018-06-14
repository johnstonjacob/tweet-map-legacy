const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database');

const app = express();

app.use(express.static(`${__dirname}/../client/dist/`));
app.use(bodyParser.json());

app.get('/nationaltrends', async (req, res) => {
  console.log('GET request for national trends');
  const trends = await db.getNationalTrends();
  res.send(trends);
});

app.get('/keywords', async (req, res) => {
  console.log('GET request for state keywords');
  const keywords = await db.getStateKeywords();
  res.send(keywords);
});

app.post('/statepercentages', async (req, res) => {
  console.log('POST request for state percentages for', req.body.word);
  const percents = await db.getStatePercentages(req.body);
  res.send(percents);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}!`);
});
