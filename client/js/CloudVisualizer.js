function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getNoise(offset, frequency) {
	offset = offset || 0;
	frequency = frequency || 0;
	return noise.simplex2(0, (new Date()).getTime() / 10000 * frequency + offset);
}

class CloudVisualizer extends CanvasEngine{
	constructor(canvas) {
		super(canvas);

		window.onresize = this.onResize;
		this.onResize();

		this.camera.setBackgroundColor("#000");
	};

	init() {
		this.cloudMaxDistance = 4000;

		var objects = [];

		// Create and add all the boids
		this.boids = [];
		var numBoids = 50;
		for (var i = 0; i < numBoids; i++) {
			var boid = new Boid(this.boids);
			this.boids.push(boid);
			objects.push(boid);
		}

		this.clouds = [];
		var numClouds = 50;
		for (var i = 0; i < numClouds; i++) {
			var cloud = new Cloud();
			cloud.setPos((Math.random() * this.cloudMaxDistance * 2 - this.cloudMaxDistance) + this.camera.center.x, (Math.random() * this.cloudMaxDistance * 2 - this.cloudMaxDistance) + this.camera.center.y)
			this.clouds.push(cloud);
			objects.push(cloud);
		}

		shuffle(objects);
		for (var i = 0; i < objects.length; i++) {
			this.addObject(objects[i]);
		}

		// Create the image object, and add it to the top of the draw stack so it's drawn first
		this.image = new CenteredImage("js/libs/canvas-engine/demo/img.jpg");
		this.addObject(this.image, true);
	};

	update() {
		for (var i = 0; i < this.boids.length; i++) {
			this.boids[i].update();
		}

		for (var i = 0; i < this.clouds.length; i++) {
			if (this.clouds[i].pos.sub(this.camera.center).mag() > this.cloudMaxDistance) {
				this.resetCloudPos(this.clouds[i]);
			}
		}

		this.camera.lookAt(Boid.getNucleus(this.boids));

		// Uncomment to toggle camera rotation. Looks a little crazy though.
		// this.camera.setRotation(this.camera.getFollowObject().rotate - Math.PI);
	};

	resetCloudPos(cloud) {
		var pos = new Vector(Math.random() - 0.5, Math.random() - 0.5);
		pos = pos.normalize().multiply(1500);
		pos = pos.add(this.camera.center);
		cloud.setPos(pos.x , pos.y);
	}

	postDraw() {
	};

	onResize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
};

class Boid extends CEObject {
	constructor(boidFamily) {
		super();
		this.pos = new Vector(Math.random() * 55, Math.random() * 25);
		this.speed = new Vector(Math.random() * 55, Math.random() * 25);
		this.size = 10;
		this.rotate = 0;

		this.family = boidFamily;
		this.avoidDistance = 40;
		this.attractMinimumDistancePerSibling = 5;

		Boid.randomJitter = new Vector();

		this.colour = "rgb(255, " + Math.random() * 255 + ", 100)";
	};

	static getNucleus(allBoids) {
		var nucleus = new Vector();

		for (var i = 0; i < allBoids.length; i++) {
			nucleus = nucleus.add(allBoids[i].pos);
		}

		return nucleus.divide(allBoids.length);
	}

	static getRandomJitter() {
		// var nucleus = Boid.getNucleus(allBoids);
		return new Vector(getNoise(3451341423, 1.5), getNoise(9587434, 1.5));
	}

	update() {
		var attraction = new Vector();
		var avoidance = new Vector();
		var averageSpeed = new Vector();
		var randomJitter = Boid.getRandomJitter().add((new Vector(Math.random() - 0.5, Math.random() - 0.5).divide(5)));
		// var randomJitter = (new Vector(Math.random(), Math.random())).normalize();
		// var randomJitter = new Vector(noise.perlin2(this.pos.x, 0), noise.perlin2(0, this.pos.y));
		// console.log(randomJitter.normalize());

		for (var i = 0; i < this.family.length; i++) {
			if (this.family[i] === this) {
				continue;
			}

			var sibling = this.family[i]; 

			var delta = this.pos.sub(sibling.pos);

			// Avoid if too close
			if (delta.mag() < this.avoidDistance) {
				var strength = 1 - (delta.mag() / this.avoidDistance);
				avoidance = avoidance.add(delta.multiply(strength).multiply(1));
			}

			averageSpeed = averageSpeed.add(sibling.speed);
		}

		averageSpeed = averageSpeed.divide(this.family.length).multiply(0.3);

		var nucleus = Boid.getNucleus(this.family);
		var delta = this.pos.sub(nucleus);
		if (delta.mag() > this.attractMinimumDistancePerSibling * this.family.length){ // Attract each other
			attraction = attraction.sub(delta.normalize().multiply(0.1));
		}

		var stamina = 1 - getNoise() / 2;
		// console.log(stamina);

		var vecToOrigin = (new Vector(0,0)).sub(this.pos);

		var accel = new Vector();
		accel = accel.add(avoidance);
		accel = accel.add(attraction);
		accel = accel.add(averageSpeed);
		accel = accel.add(randomJitter.multiply(5));
		// accel = accel.multiply(stamina);
		accel = accel.multiply(0.3);

		this.accel = accel;
		this.speed = this.speed.add(this.accel);
		this.speed.clampMag(10 * stamina);
		this.speed = this.speed.multiply(0.95);
		this.pos = this.pos.add(this.speed);

		this.rotate = Mathx.LerpRotation(this.rotate, Math.atan2(-this.speed.y, -this.speed.x) + Math.PI/2, 0.1);
	};

	draw() {
		this.context.fillStyle = this.colour;

		// Draw as a circle
		// this.context.beginPath();
		// this.context.arc(0, 0, this.size/2, 0, 2 * Math.PI, false);
		// this.context.fill();
		// this.context.closePath();

		// Draw as a triangle
		this.context.save();
		this.context.beginPath();
		this.context.rotate(this.rotate);
		this.context.lineTo(-this.size/3, 0);
		this.context.lineTo(0, this.size);
		this.context.lineTo(this.size/3, 0);
		this.context.fill();
		this.context.closePath();
		this.context.restore();

		// // Draw a line for acceleration
		// this.context.strokeStyle = "#F00";
		// this.context.beginPath()
		// this.context.moveTo(0, 0);
		// this.context.lineTo(this.accel.x * 10, this.accel.y * 10);
		// this.context.stroke();
		// this.context.closePath();

		// // Draw a line for speed
		// this.context.strokeStyle = "#0F0";
		// this.context.beginPath()
		// this.context.moveTo(0, 0);
		// this.context.lineTo(this.speed.x * 10, this.speed.y * 10);
		// this.context.stroke();
		// this.context.closePath();

		// console.log(this.accel);
	};
};

class Cloud extends CEObject {
	constructor() {
		super();
		this.generate();
	}
	generate() {
		this.balls = [];
		var numBalls = Math.random() * 15 + 35;
		for (var i = 0; i < numBalls; i++) {
			var y = (1 - (Math.pow(Math.random(), 3)) * numBalls * 4) - numBalls * 2;
			var x = ((Math.random() * numBalls) - numBalls / 2) / (y / 600);
			var size = Math.random() * 20 + 20;

			var random = Math.floor((Math.random() * 20 + 230)).toString(16);
			this.balls.push({
				x: x,
				y: y,
				size: size,
				colour: "#" + random + random + random
			});
		}
	}
	draw() {
		for (var i = 0; i < this.balls.length; i++) {
			this.context.fillStyle = this.balls[i].colour;
			this.context.beginPath();
			this.context.arc(this.balls[i].x, this.balls[i].y, this.balls[i].size, 0, 2 * Math.PI, false);
			this.context.fill();
			this.context.closePath();
		}
	}
}

class CenteredImage extends CEImage {
	// Center the image on load.
	onload() {
		this.setSize({height: 15000})
		this.pos.x = -this.width / 2;
		this.pos.y = -this.height / 2;
	}
}
