class DemoApp extends CanvasEngine{
	constructor(canvas) {
		super(canvas);

		window.onresize = this.onResize;
		this.onResize();

		this.camera.setBackgroundColor("#000");
	};

	init() {
		// Create and add all the boids
		this.boids = [];
		var numBoids = 2000;
		for (var i = 0; i < numBoids; i++) {
			var boid = new Boid();
			this.boids.push(boid);
			this.addObject(boid);
		}

		// Set the first boid as the one that the camera follows
		this.boids[0].colour = "#00FFFF";
		this.boids[0].size = 20;
		this.camera.setFollowObject(this.boids[0]);
		this.camera.setFollowStrength(0.05);

		// Create the image object, and add it to the top of the draw stack so it's drawn first
		this.image = new CenteredImage("img.jpg");
		this.addObject(this.image, true);
	};

	update() {
		for (var i = 0; i < this.boids.length; i++) {
			this.boids[i].update();
		}

		// Uncomment to toggle camera rotation. Looks a little crazy though.
		// this.camera.setRotation(this.camera.getFollowObject().rotate - Math.PI);
	};

	postDraw() {
	};

	onResize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
};

class Boid extends CEObject {
	constructor() {
		super();
		this.size = 15;
		this.speed = new Vector();
		this.rotate = 0;

		this.colour = "rgb(255, " + Math.random() * 255 + ", 100)";
	};

	update() {
		var vecToOrigin = (new Vector(0,0)).sub(this.pos);

		var randomX = (Math.random() - 0.5) / 2;
		var randomY = (Math.random() - 0.5) / 2;
		var accel = new Vector(randomX, randomY);

		if (vecToOrigin.mag() > 300) {
			accel = accel.add(vecToOrigin.divide(1000));
		}

		this.speed = this.speed.add(accel);
		this.speed.clampMag(5);
		this.speed.multiply(0.9);

		this.pos = this.pos.add(this.speed);

		this.rotate = Mathx.Lerp(this.rotate, Math.atan2(-this.speed.y, -this.speed.x) + Math.PI/2, 0.05);
	};

	draw() {
		this.context.fillStyle = this.colour;

		// Draw as a circle
		// this.context.beginPath();
		// this.context.arc(0, 0, this.size/2, 0, 2 * Math.PI, false);
		// this.context.fill();
		// this.context.closePath();

		// Draw as a triangle
		this.context.beginPath();
		this.context.rotate(this.rotate);
		this.context.lineTo(-this.size/3, 0);
		this.context.lineTo(0, this.size);
		this.context.lineTo(this.size/3, 0);
		this.context.fill();
		this.context.closePath();
	};
};

class CenteredImage extends CEImage {
	// Center the image on load.
	onload() {
		this.setSize({height: 1500})
		this.pos.x = -this.width / 2;
		this.pos.y = -this.height / 2;
	}
}
