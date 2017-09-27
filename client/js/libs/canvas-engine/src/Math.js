// Math.js by Sunmock Yang

function Vector(x, y){
	this.x = (typeof x !== "undefined") ? x : 0;
	this.y = (typeof y !== "undefined") ? y : 0;
}

Vector.prototype.set = function(x,y) {
	this.x = x; this.y = y;
};

Vector.prototype.add = function(vec){
	return new Vector((this.x + vec.x), (this.y + vec.y));
};

Vector.prototype.sub = function(vec){
	return new Vector((this.x - vec.x), (this.y - vec.y));
};

Vector.prototype.mag = function(){
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

Vector.prototype.sqr = function() {
	return new Vector(this.x);
};

Vector.prototype.multiply = function(scale){
	return new Vector((this.x * scale), (this.y * scale));
}

Vector.prototype.divide = function(scale){
	return new Vector((this.x / scale), (this.y / scale));
}

Vector.prototype.inverse = function() {
	return new Vector(1/this.x, 1/this.y);
};

Vector.prototype.clamp = function(max, min){
	min = (isNaN(min)) ? 0 : min;
	this.x = (this.x > max) ? max : ((this.x < min) ? min : this.x);
	this.y = (this.y > max) ? max : ((this.y < min) ? min : this.y);
};

Vector.prototype.clampMag = function(max, min) {
	min = (isNaN(min)) ? 0 : min;

	var mag = this.mag();
	if(mag > max){
		this.x *= (max/mag);
		this.y *= (max/mag);
	}
	else if(mag < min){
		this.x *= (min/mag);
		this.y *= (min/mag);
	}
};

Vector.prototype.normalize = function() {
	var mag = this.mag();
	return (mag !== 0) ? new Vector(this.x/mag, this.y/mag) : new Vector();
};

Vector.prototype.apply = function(func) {
	return new Vector(func(this.x), func(this.y));
};

Vector.prototype.zeroify = function() {
	this.x = this.y = 0;
};

Vector.prototype.clone = function() {
	return new Vector(this.x, this.y);
};

Vector.prototype.rotate = function(radians) {
	var rotated = new Vector();
	rotated.x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
	rotated.y = this.x * Math.sin(radians) + this.y * Math.cos(radians);
	return rotated;
};

Vector.prototype.rotateAround = function(radians, anchorPoint) {
	var rotated = this.sub(anchorPoint);
	rotated = rotated.rotate(radians);

	return rotated.add(anchorPoint);
};

Vector.prototype.equals = function(vec) {
	return this.x == vec.x && this.y == vec.y;
};

Vector.prototype.toString = function() {
	return "x: " + this.x + ", y: " + this.y;
};

Vector.Lerp = function(from, to, t) {
    return to.sub(from).multiply(t).add(from);
};

Vector.Zero = function() {
	return new Vector();
}

var Mathx = {};

Mathx.Lerp = function(from, to, t) {
    return (to - from) * t + from;
};

Mathx.LerpRotation = function(from, to, t) {
	var result;
    var diff = to - from;
    if (diff < -Math.PI)
    {
        // lerp upwards past PI_TIMES_TWO
        to += Math.PI * 2;
        result = Mathx.Lerp(from, to, t);
        if (result >= Math.PI * 2)
        {
            result -= Math.PI * 2;
        }
    }
    else if (diff > Math.PI)
    {
        // lerp downwards past 0
        to -= Math.PI * 2;
        result = Mathx.Lerp(from, to, t);
        if (result < 0)
        {
            result += Math.PI * 2;
        }
    }
    else
    {
        // straight lerp
        result = Mathx.Lerp(from, to, t);
    }

	return result;
};

Mathx.Deg2Rad = function(deg) {
	return Math.PI / 180 * deg;
};

Mathx.Rad2Deg = function(rad) {
	return rad * (180 / Math.PI);
};

Mathx.clamp = function(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
