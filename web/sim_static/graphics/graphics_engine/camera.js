
function Camera(){
	this.position = new Vec2();
	this.up = new Vec2(0,1); // Unit vector describing the upwards direction.
	this.viewPortWidth; // Pixels. "canvas.width".
	this.viewPortHeight; // Pixels. "canvas.height".
	this.width;
	// matrices
	this.projection;
	this.view;
}
Camera.prototype.setUp = function (up) {
	this.up = Vec2.unit(up);
}
Camera.prototype.calculateProjection = function () {
	// Width is Visible width in world distance units. WidthToHeightRatio is the width of the canvas divided by the height
	this.projection = Matrix3D.getOrthogonalProjection(this.width, this.viewPortWidth / this.viewPortHeight);
}
Camera.prototype.calculateView = function () {
	this.view = Matrix3D.getView(this.position, this.up);
	return this.view;
}
Camera.prototype.canvasToWorldCoordinates = function (canvasCoordinates) {
	// r = (coord - center/2) / viewWidthPxl * width.
	// r = rotate(r)
	var r = Vec2.sub( // Center the coordinates.
		canvasCoordinates,
		new Vec2(this.viewPortWidth * 0.5, this.viewPortHeight * 0.5)
	).mul( // Scale to world.
		this.width / this.viewPortWidth
	);
	r.rotateCosSin(this.up.y, -this.up.x); // Rotate to match camera orientation.
	r.add(this.position); // Place at camera location.
	
	return r;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.camera', true);