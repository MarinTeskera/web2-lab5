const express = require("express");
const path = require("path");
const httpPort = 80;

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  res.sendFile("index.html");
});

app.get("/gallery", function (req, res) {
  res.sendFile("gallery.html");
});

app.listen(httpPort, function () {
  console.log(`HTTP listening on port: ${httpPort}`);
});
