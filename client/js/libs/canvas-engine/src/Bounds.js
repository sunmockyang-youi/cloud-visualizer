function Bounds(top, left, width, height){
	this.top = (top) ? top : 0;
	this.left = (left) ? left : 0;
	this.width = (width) ? width : 0;
	this.height = (height) ? height : 0;

	this.right = this.left + this.width;
	this.bottom = this.top + this.height;
};

Bounds.prototype.move = function(left, top) {
	this.top = top;
	this.left = left;
	this.right = this.left + this.width;
	this.bottom = this.top + this.height;
};

Bounds.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;
	this.right = this.left + this.width;
	this.bottom = this.top + this.height;
};

Bounds.prototype.getCenter = function() {
	return {
		x: this.left + this.width/2,
		y: this.top + this.height/2
	}
};

Bounds.prototype.inBounds = function(x, y) {
	return (x > this.left &&
		x < this.left + this.width &&
		y > this.top &&
		y < this.top + this.height);
};

Bounds.prototype.isVectorInBounds = function(vec) {
	return this.inBounds(vec.x, vec.y);
};

// Give a point in global space, return point in bound space
Bounds.prototype.relativePoint = function(x, y) {
	return {
		x: x - this.left,
		y: y - this.top
	};
};
