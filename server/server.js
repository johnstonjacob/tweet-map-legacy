const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('../database/database');
const { cronJob } = require('../database/tweetsStream');

const app = express();


//
// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────────
//
app.use(express.static(`${__dirname}/../client/dist/`));
app.use(bodyParser.json());
app.use(morgan('dev'));

cronJob.start();


//
// ─── NATIVE ENDPOINTS ───────────────────────────────────────────────────────────
//
app.get('/nationaltrends', async (req, res) => {
  const trends = await db.getNationalTrends();
  res.send(trends);
});

app.get('/keywords', async (req, res) => {
  const keywords = await db.getStateKeywords();
  res.send(keywords);
});

app.post('/statepercentages', async (req, res) => {
  const percents = await db.getStatePercentages(req.body);
  res.send(percents);
});

app.post('/statesentiments', async (req, res) => {
  const sentiments = await db.getStateSentiments(req.body);
  res.send(sentiments);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}!`);
});

