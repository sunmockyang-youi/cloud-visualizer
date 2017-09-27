"use strict";

const Promise = require("bluebird");
const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(Promise);
const apiVersion = "2014-03-28";
const startFromHead = true;

// hardcoded log groups/streams for filmstruck us-east-1
const eastLogGroup = "fs-v3-0-v802e1-NodeProxyECSCluster";
const eastLogStream = "youi/nodeproxy/8c31bb87-5807-4d75-b8af-f57ac8412cce";

// hardcoded log groups/streams for filmstruck us-west-2
const westLogGroup = "fs-v3-0-v802w2-NodeProxyECSCluster";
const westLogStream = "youi/nodeproxy/c3c37d5c-0a07-4074-81fd-adbbe8e5fb25";

function minutesAgo(n) {
  return Date.now() - n * 60 * 1000;
}

function createRegionConfig(region, logGroupName, logStreamName) {
  return {
    cloudWatchLogs: new AWS.CloudWatchLogs({ apiVersion, region }),
    params: {
      startFromHead,
      logGroupName,
      logStreamName
    },
    nextToken: ""
  };
}

let regions = {
  "us-east-1": createRegionConfig("us-east-1", eastLogGroup, eastLogStream),
  "us-west-2": createRegionConfig("us-west-2", westLogGroup, westLogStream)
};

let conns = {};
let evts = [];

function getLogs(region) {
  if (!!region.nextToken) {
    region.params.nextToken = region.nextToken;
  }
  region.params.startTime = minutesAgo(2);
  return region.cloudWatchLogs.getLogEvents(region.params).promise();
}

function parseLog(log) {
  if (!!log.id) {
    conns[log.id] = log.time;
    if (log.event === "clientMessage") {
      let clientMsg = JSON.parse(log.msg);
      let event = clientMsg.event || "";
      if (["selection", "focus", "key"].indexOf(event) >= 0) {
        evts.push({ id: log.id, time: log.time, event });
      }
    }
  }
}

function parseEvents(events) {
  for (let event of events) {
    let log = null;
    try {
      log = JSON.parse(event.message);
    } catch (e) {
      /*
        it appears some engine messages are so long they come in as multiple
        log events. this will cause a json parse error. Too lazy to stitch it
        back together so just skip the logs if they are fragmented
      */
    }
    if (!!log) parseLog(log);
  }
}

function poll(region) {
  return getLogs(region)
    .tap(r => (region.nextToken = r.nextForwardToken))
    .then(r => r.events)
    .tap(parseEvents)
    .then(events => {
      if (events.length === 0) return Promise.delay(5000);
    })
    .then(() => poll(region));
}

poll(regions["us-east-1"]).catch(e => console.error(e));
poll(regions["us-west-2"]).catch(e => console.error(e));

function pruneData() {
  // prune connection id list
  let nextConns = {};
  for (let id in conns) {
    if (conns[id] >= minutesAgo(2)) {
      nextConns[id] = conns[id];
    }
  }
  conns = nextConns;

  // prune event data
  let newEvts = [];
  for (let evt of evts) {
    if (evt.time >= minutesAgo(2)) {
      newEvts.push(evt);
    }
  }
  evts = newEvts;
}
setInterval(pruneData, 5000);

function connections() {
  return Object.keys(conns);
}

function events() {
  return evts;
}

module.exports = {
  connections,
  events
};
