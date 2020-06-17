const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const Datastore = require("nedb");
const db = new Datastore({ filename: "./storage.db" });
db.loadDatabase();

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function fibonacci(n, memo) {
  memo = memo || {};
  if (n in memo) {
    return memo[n];
  }
  if (n <= 1) {
    return 1;
  }
  return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
}

function writeToDB(payload) {
  db.insert(payload, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(obj);
    }
  });
}

app.get("/fibonacci/:number", async (req, res) => {
  await wait(400);
  const number = +req.params.number;
  if (number === 42) return res.status(400).send("42 is the meaning of life");
  if (number > 50)
    return res.status(400).send("number can't be bigger than 50");
  if (number < 0) return res.status(400).send("number can't be smaller than 0");
  const result = fibonacci(number);
  const obj = { number, result, createdDate: Date.now() };
  writeToDB(obj);
});

app.get("/getFibonacciResults", async (req, res) => {
  await wait(600);
  db.find({}, (err, docs) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ results: docs });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello coder... you have reached the fibonacci server 😈");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}. \nPress Ctrl+C to quit.`);
});
