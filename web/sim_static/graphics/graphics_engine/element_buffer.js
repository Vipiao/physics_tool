function ElementBuffer(gl){
	this.gl = gl;

	this.bufferObject = this.gl.createBuffer();
}
ElementBuffer.prototype.delete = function () {
	this.gl.deleteBuffer(this.bufferObject);
}
ElementBuffer.prototype.setData = function(indices){
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferObject);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
		this.gl.STATIC_DRAW);
}
ElementBuffer.prototype.bind = function(){
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferObject);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.element_buffer', true);