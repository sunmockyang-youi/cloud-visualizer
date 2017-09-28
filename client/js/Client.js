class Client {
  constructor(onUserLoggedIn, onUserLoggedOut, onUserEvent) {
    this.onUserLoggedIn = onUserLoggedIn;
    this.onUserLoggedOut = onUserLoggedOut;
    this.onUserEvent = onUserEvent;

    this.connections = [];
    this.lastEventTime = 0;

    this.requestInterval = 5 * 1000;

    const req = () => {
      let headers = {
        "Access-Control-Allow-Origin": "*"
      };
      let mode = "no-cors";
      let host = "";
      let options = { headers, mode };
      fetch(host + "/api/connections", options)
        .then(this.connectionsHandler.bind(this))
        .catch(this.errorHandler.bind(this));

      fetch(host + "/api/events", options)
        .then(this.eventsHandler.bind(this))
        .catch(this.errorHandler.bind(this));
    };
    req();

    setInterval(req, this.requestInterval);
  }

  connectionsHandler(response) {
    if (response.ok) {
      response.json().then(this.onClientDataReceived.bind(this));
    }
  }
  eventsHandler(response) {
    if (response.ok) {
      response.json().then(this.onEventDataReceived.bind(this));
    }
  }
  errorHandler(e) {
    console.error(e);
  }

  onClientDataReceived(newConnections) {
    var disconnects = this.connections.slice(0);
    for (var i = 0; i < this.connections.length; i++) {
      if (newConnections.includes(this.connections[i])) {
        disconnects.splice(disconnects.indexOf(this.connections[i]), 1);
        newConnections.splice(newConnections.indexOf(this.connections[i]), 1);
      }
    }

    for (var i = 0; i < newConnections.length; i++) {
    	  var index = i;
	      setTimeout((function() {
			  this.onUserLoggedIn(newConnections[index]);
	      }).bind(this), this.requestInterval * Math.random());
		  this.connections.push(newConnections[i]);
    }

    for (var i = 0; i < disconnects.length; i++) {
	      this.connections.splice(this.connections.indexOf(disconnects[i]), 1);
          var index = i;
	      setTimeout((function() {
		      this.onUserLoggedOut(disconnects[index]);
	      }).bind(this), this.requestInterval * Math.random());
    }
  }

  onEventDataReceived(events) {
    for (var i = 0; i < events.length; i++) {
      if (events[i]["time"] > this.lastEventTime) {
        if (this.lastEventTime < events[i]["time"]) {
          this.lastEventTime = events[i]["time"];
        }

        var index = i;

		setTimeout((function() {
			this.onUserEvent(events[index]["id"], events[index]);
		}).bind(this), this.requestInterval * Math.random());
      }
    }
  }
}
