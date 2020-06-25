const fs = require("fs");
const _ = require("lodash");

function loadCSV(filename, options) {
  const data = fs.readFileSync(filename, { encoding: "utf-8" });
  console.log(data);
  console.log(data.split("\n"));
  console.log(data.split("\n").map(row => row.trim().split(",")));
  data = data.map(row => _.dropRightWhile(row, val => val === ""));
}

loadCSV("data.csv");
