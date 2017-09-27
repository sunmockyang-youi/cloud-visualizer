class Client {
  constructor(onUserLoggedIn, onUserLoggedOut) {
    this.onUserLoggedIn = onUserLoggedIn;
    this.onUserLoggedOut = onUserLoggedOut;

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

    setInterval(req, 60 * 1000);
  }
  connectionsHandler(response) {
    console.log(response);
  }
  eventsHandler(response) {}
  errorHandler(e) {
    console.error(e);
  }
}
