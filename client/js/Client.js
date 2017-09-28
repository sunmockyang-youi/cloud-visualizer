class Client {
	constructor(onUserLoggedIn, onUserLoggedOut, onUserEvent) {
		this.onUserLoggedIn = onUserLoggedIn;
		this.onUserLoggedOut = onUserLoggedOut;
		this.onUserEvent = onUserEvent;

		this.connections = [];
		this.lastEventTime = 0;

		this.requestInterval = 10 * 1000;

		const req = () => {
			let headers = {
				"Access-Control-Allow-Origin": "*"
			};
			let mode = "no-cors";
			let host = "http://ec2-52-91-154-219.compute-1.amazonaws.com";
			let options = { headers, mode };
			fetch(host + "/api/connections", options)
				.then(this.connectionsHandler.bind(this))
				.catch(this.errorHandler.bind(this));

			fetch(host + "/api/events", options)
				.then(this.eventsHandler.bind(this))
				.catch(this.errorHandler);
		};
		req();

		setInterval(req, this.requestInterval);
	}

	connectionsHandler(response) {
		if (response.body) {
			this.onClientDataReceived(JSON.parse(response.body));			
		}
	}
	eventsHandler(response) {
		if (response.body) {
			this.onEventDataReceived(JSON.parse(response.body));
		}
	}
	errorHandler(e) {
		console.error(e);
	}

	onClientDataReceived(connections) {
		var disconnects = this.connections.slice(0);
		for (var i = 0; i < this.connections.length; i++) {
			if (connections.includes(this.connections[i]))
			{
				disconnects.splice(disconnects.indexOf(this.connections[i]), 1);
				connections.splice(disconnects.indexOf(this.connections[i]), 1);
			}
		}

		for (var i = 0; i < connections.length; i++) {
			this.onUserLoggedIn(connections[i]);
			this.connections.push(connections[i]);
		}

		for (var i = 0; i < disconnects.length; i++) {
			// setTimeout(this.requestInterval * Math.random(), function() {});
			this.onUserLoggedOut(disconnects[i]);
		}
	}

	onEventDataReceived(events) {
		for (var i = 0; i < events.length; i++) {
			if (events[i]["time"] > this.lastEventTime) {
				if (this.lastEventTime < events[i]["time"]) {
					this.lastEventTime = events[i]["time"];
				}

				this.onUserEvent(events[i]["id"], events[i]["event"]);
			}
		}
	}
}
