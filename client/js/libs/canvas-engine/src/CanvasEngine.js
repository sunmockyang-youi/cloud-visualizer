class CanvasEngine {
	constructor(canvas) {
		// Set up canvas
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		this.ceObjectList = [];
		this.camera = new CECamera(this.context, this.getObjectList.bind(this));

		// Mouse input
		this.mouse = new LibraryMouse(this.canvas);
		this.mouse.addEventListener("mousemove", this.onMouseMove.bind(this));
		this.mouse.addEventListener("mouseover", function(){});
		this.mouse.addEventListener("mouseout", this.onMouseOut.bind(this));
		this.mouse.addEventListener("mousedown", function(){});
		this.mouse.addEventListener("mouseup", function(){});
		this.mouse.addEventListener("click", this.onMouseClick.bind(this));
		this.mouse.addEventListener("doubleclick", function(){});

		document.onkeypress = this.keyPress.bind(this);

		this.init();
	};

	//Main framework functions
	init() {
		console.log("Runs once at the start of initialization of the class. Initialize all app specific entities here.");
	};

	run(){
		this.update();
		this.draw();
		this.postDraw();
		this.cleanUp();
		window.requestAnimationFrame(this.run.bind(this));
	};

	update() {
		console.log("Main update. Runs each frame before draw. Should be overriden and call update() on all elements in ceObjectList");
	};
	 
	draw() {
		this.camera.draw();
	};

	postDraw() {
		console.log("Post draw update. Runs each frame after the draw. Should be overriden and call postDraw() on all elements in ceObjectList");
	};

	cleanUp() {
		// Cleaning up any destroyed objects
		var objectsToDestroy = [];
		for (var i = 0; i < this.ceObjectList.length; i++) {
			if (this.ceObjectList[i].isToBeDestroyed) {
				objectsToDestroy.push(this.ceObjectList[i]);
			}
		}

		for (var i = 0; i < objectsToDestroy.length; i++) {
			objectsToDestroy[i].onDestroy();
			this.removeObject(objectsToDestroy[i]);
		}
	};

	// Engine object functions
	// Objects will be drawn in the same order as they are in the stack
	// if addToTopOfDrawStack is set to true, add the object to the top of the stack
	// if addToTopOfDrawStack is not set, it will by default be added to the bottom of the stack
	addObject(obj, index) {
		index = !isNaN(index) ? index : this.ceObjectList.length;
		obj.setCamera(this);
		this.ceObjectList.splice(index, 0, obj);
	};

	removeObject(obj) {
		var removeList = [];
		for (var i = 0; i < this.ceObjectList.length; i++) {
			if (this.ceObjectList[i] == obj) {
				removeList.push(i);
				break;
			}
		};
		for (var i = 0; i < removeList.length; i++) {
			this.ceObjectList.splice(removeList, 1);
		};
	};

	getObjectList(){
		return this.ceObjectList;
	};

	// Event handlers
	onMouseMove() {};
	onMouseClick() {};
	onMouseOut() {}
	keyPress(e) {};
};
