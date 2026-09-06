/*

*/

function Texture(gl){
	this.gl = gl;
	
	this.textureObject = this.gl.createTexture();
	//this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureObject);
}
Texture.prototype.loadFromImg = function(htmlImageElement){
	var level = 0;
	var internalFormat = this.gl.RGBA;
	var srcFormat = this.gl.RGBA;
	var srcType = this.gl.UNSIGNED_BYTE;
	this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, srcFormat,
		srcType, htmlImageElement);
	if(Tool.isPowerOf2(htmlImageElement.width) &&
			Tool.isPowerOf2(htmlImageElement.height)){
		this.gl.generateMipmap(this.gl.TEXTURE_2D);
	}else{
		// no mipmap );
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S,
			this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T,
			this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER,
			this.gl.LINEAR);
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.texture', true);




























