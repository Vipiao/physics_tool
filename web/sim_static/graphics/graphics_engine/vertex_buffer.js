
/*
Example:

	var gl = document.getElementById("some_canvas").getContext("webgl");
	var data = [1,2,3,4,5];
	var vb = new VertexBuffer(gl, data);
	// If stride and offset are set to 0, or undefined, they are automatically
		// calculated.
	vb.addAttributePointer(someLocation, 1, gl.FLOAT, 4, 0);
*/

function VertexBuffer(gl){
	this.attributePointers = [];

	this.gl = gl;
	this.bufferObject = this.gl.createBuffer();
}
VertexBuffer.prototype.delete = function () {
	this.gl.deleteBuffer(this.bufferObject);
}
VertexBuffer.prototype.setDataFloat = function(data, isDynamic = false){
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferObject);
	var mode;
	if(isDynamic){
		mode = this.gl.DYNAMIC_DRAW;
	}else{
		mode = this.gl.STATIC_DRAW;
	}
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), mode);
}
VertexBuffer.prototype.reserveBytes = function(nrOfBytes, isDynamic = false){
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferObject);
	var mode;
	if(isDynamic){
		mode = this.gl.DYNAMIC_DRAW;
	}else{
		mode = this.gl.STATIC_DRAW;
	}
	this.gl.bufferData(this.gl.ARRAY_BUFFER, nrOfBytes, mode);
}
VertexBuffer.prototype.setSubDataFloat = function(data, offset){
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferObject);
	this.gl.bufferSubData(this.gl.ARRAY_BUFFER, offset, new Float32Array(data));
}
VertexBuffer.prototype.addAttributePointer = function(location, size, type, stride = 0, offset = 0){
	// Stride and offset are given in bytes.
	this.attributePointers.push({
		"location": location,
		"size": size,
		"type": type,
		"stride": stride,
		"offset": offset,
	});
}
VertexBuffer.prototype.bind = function(){
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferObject);
	for(var i=0; i<this.attributePointers.length; i++){
		var p = this.attributePointers[i];
		this.gl.vertexAttribPointer(p.location, p.size, p.type, false, p.stride,
			p.offset);
		this.gl.enableVertexAttribArray(p.location);
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.vertex_buffer', true);