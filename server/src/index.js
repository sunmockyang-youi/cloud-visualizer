"use strict";

const AWS = require("aws-sdk");
const cloudWatchLogs = new AWS.CloudWatchLogs({
  apiVersion: "2014-03-28",
  region: "us-east-1"
});

console.log(process.env);
