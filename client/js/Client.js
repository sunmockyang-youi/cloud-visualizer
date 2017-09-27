class Client {
	constructor(onUserLoggedIn, onUserLoggedOut) {
		this.onUserLoggedIn = onUserLoggedIn;
		this.onUserLoggedOut = onUserLoggedOut;

		this.fetch();
	}

	fetch() {
	}
}