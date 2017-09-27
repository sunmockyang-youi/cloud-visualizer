class CEObject {
	constructor() {
		this.context = null;
		this.pos = new Vector();
		this.id = "random object";
		this.type = CEObject;

		// Only to be toggled by the destroy function.
		this.isToBeDestroyed = false;
	};

	setCamera(camera) {
		this.context = camera.context;
	};

	getID() {
		return this.id;
	};

	setPos(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	};

	update() {};

	draw() {
		console.error("IMPLEMENT A DRAW FUNCTION");
		console.log("Draw the object centered at 0,0");
	};

	postDraw () {};

	destroy() {
		this.isToBeDestroyed = true;
	};

	onDestroy() {
		// This will be run when the destroy function is called. Override this and do any clean up here before the object gets removed.
	};
};
