const express = require("express");
const path = require("path");
const app = express();

console.log("test");

app.use(express.static(path.join(__dirname, "/build")));

app.get("/test", (req, res) => {
  res.send("test");
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
})

app.listen(80, () => {
  console.log("listening");
})