const express = require("express");
const { rateLimit } = require('express-rate-limit');
const { slowDown } = require('express-slow-down');
const port = 3000;

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

const rateLimitHandler = rateLimit({
  windowMs: FIVE_MINUTES_IN_MS,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Vai com calma prc!' },
});

const MS_PER_REQUEST = 200;
const MAX_MS_PER_REQUEST = 5000;

const slowDownHandler = slowDown({
  windowMs: FIVE_MINUTES_IN_MS,
  delayAfter: 10,
  delayMs: (hits) => hits * MS_PER_REQUEST,
  maxDelayMs: MAX_MS_PER_REQUEST,
})

const app = express();

app.use(express.json());

app.get("/limit", rateLimitHandler, (req, res) => {
  res.status(200).json({ message: 'hello world' });
});

app.get("/slow", slowDownHandler, (req, res) => {
  res.status(200).json({ message: 'hello world' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
