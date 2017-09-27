class CEImage extends CEObject{
	constructor(url) {
		super();
		this.readyToDraw = false;
		this.image = new Image();
		this.image.onload = (function() {this.setSize(); this.readyToDraw = true; this.onload()}).bind(this);
		this.image.src = url;
		this.width = 0;
		this.height = 0;
	};

	onload() {
		// Override this if you want
	};

	getSize() {
		return {
			width: this.width || this.image.naturalWidth,
			height: this.height || this.image.naturalHeight
		}
	};

	// Will maintain aspect ratio if either width/height are missing
	setSize(size) {
		var imageSize = this.getSize()
		if (size === undefined) { // Reset to original size
			this.width = imageSize.width;
			this.height = imageSize.height;
		}
		else if (size.width !== undefined && size.height !== undefined) {
			this.width = size.width;
			this.height = size.height;
		}
		else if (size.width !== undefined) {
			this.height = size.width / imageSize.width * imageSize.height;
			this.width = size.width;
		}
		else if (size.height !== undefined) {
			this.width = size.height / imageSize.height * imageSize.width;
			this.height = size.height;
		}
	};

	// Fit the image within the specified bounds (size-wise, not position)
	fitMaxBounds(bounds) {
		if (bounds.width/this.image.width > bounds.height/this.image.height){
			// Limit by height
			this.setSize({height:bounds.height})
		}
		else {
			// Limit by width
			this.setSize({width:bounds.width})
		}
	};

	draw() {
		if (this.readyToDraw){
			if (this.width > 0 && this.height > 0) {
				this.context.drawImage(this.image, 0, 0, this.width, this.height);
			}
		}
	};
};
