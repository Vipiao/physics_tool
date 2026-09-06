
RenderContext.WEBGL_2_NOT_SUPPORTED = "WEBGL_2_NOT_SUPPORTED";

function RenderContext(){
	this.isFailed = false;
	this.errorMessage;

	this.canvas;
	this.gl;
}
RenderContext.prototype.bindCanvas = function (canvasElement) {
	this.canvas = canvasElement;
	this.gl = this.canvas.getContext("webgl2");
	if (this.gl == null) {
		this.isFailed = true;
		this.errorMessage = RenderContext.WEBGL_2_NOT_SUPPORTED;
	}

	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.clearColor(
		0.65098039215,
		0.8862745098,
		0.99607843137,
		1.
	);
	this.gl.clearDepth(1.0);
	this.gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
}
RenderContext.prototype.resizeToCanvas = function(){
	this.gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
}
RenderContext.prototype.clear = function(){
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}
/*RenderContext.prototype.render = function(indicesLength){
	this.gl.drawElements(
		this.gl.TRIANGLES, indicesLength, this.gl.UNSIGNED_SHORT, 0);
}*/

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.render_context', true);
