const express = require("express");
const app = express();
const cors = require("cors");
const mongo = require("mongodb");

app.use(cors());

const MongoClient = mongo.MongoClient;
const dbName = "Fibonacci";
const collection = "RequestedNumbers";
const url = `mongodb://localhost:27017/${dbName}`;

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);
  dbo.createCollection(collection, function (err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

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
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    dbo.collection(collection).insertOne(payload, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

async function returnFirst() {
  let client = await MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    await dbo.collection(collection).find().limit(-1).sort({ $natural: -1 });
  });
  console.log("G");
  console.log(client);
}

returnFirst();
app.get("/fibonacci/:number", async (req, res) => {
  await wait(400);
  const number = +req.params.number;
  if (number === 42) return res.status(400).send("42 is the meaning of life");
  if (number > 50)
    return res.status(400).send("number can't be bigger than 50");
  if (number < 0) return res.status(400).send("number can't be smaller than 0");
  const result = fibonacci(number);
  const obj = { number, result, createdDate: Date.now() };
  console.log(obj);
  writeToDB(obj);
  return res.status(200).send(obj);
});

app.get("/getFibonacciResults", async (req, res) => {
  await wait(600);
  let values;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo
      .collection(collection)
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        values = result;
        db.close();
      });
  });
  return res.status(200).send(values || 'HOLA');
});

app.get("/", (req, res) => {
  res.send("Hello coder... you have reached the fibonacci server 😈");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}. \nPress Ctrl+C to quit.`);
});
