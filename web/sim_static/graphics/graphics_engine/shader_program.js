
/*
Example:
	var sp = new ShaderProgram(gl, "somePath/vertex_shader.vert",
		"somePath/fragment_shader.frag");
	...
	if(sp.isFailed){
		console.log("ERROR: " + sp.failMessage);
	}else if(sp.isReady){
		console.log("ShaderProgram is done, and ready to use.");
		sp.setAttributeInt(someInteger, "integerAttribute");
	}
	...
Functions:
	Use:
		sp.use(); // Note: does not need to set before "setAttribute'Type'()".
	Set attributes of shaders:
		In code:
			...
			sp.setAttributeInt(3, "someAttribute");
			...
		In "somePath/vertex_shader.vert"
			...
			attribute int someAttribute;
			...
*/

// Errors
ShaderProgram.ERROR_LOADING_VERTEX_SHADER = "ERROR_LOADING_VERTEX_SHADER";
ShaderProgram.ERROR_LOADING_FRAGMENT_SHADER = "ERROR_LOADING_FRAGMENT_SHADER";

ShaderProgram.ERROR_COMPILING_VERTEX_SHADER = "ERROR_COMPILING_VERTEX_SHADER";
ShaderProgram.ERROR_COMPILING_FRAGMENT_SHADER =
	"ERROR_COMPILING_FRAGMENT_SHADER";
ShaderProgram.ERROR_LINKING_SHADERS = "ERROR_LINKING_SHADERS";

function ShaderProgram(gl){
	this.gl = gl;

	this.program;

	this.vertexShader;
	this.fragmentShader;

	this.vertexShaderDoneLoading = false;
	this.fragmentShaderDoneLoading = false;
	this.isReady = false;

	this.isFailed = false;
	this.failMessage;

	this.readyCallBackFunctions = [];

	this.printedWarnings = [];
}
ShaderProgram.prototype.addReadyCallBack = function (f) {
	if(this.isReady){
		f();
	}else{
		this.readyCallBackFunctions.push(f);
	}
}
ShaderProgram.prototype.loadShadersFromString = function(vertexCode,
		fragmentCode){

	this.vertexShader = this.compileShader(vertexCode,
		this.gl.VERTEX_SHADER);
	if(this.vertexShader == null){
		return null;
	}

	this.fragmentShader = this.compileShader(fragmentCode,
		this.gl.FRAGMENT_SHADER);
	if(this.fragmentShader == null){
		return null;
	}

	this.compileProgram();
}
ShaderProgram.prototype.loadShadersFromPath = function(vertexShaderPath,
		fragmentShaderPath){

	var compileProgramIfDone = (function(){
		if(this.vertexShaderDoneLoading && this.fragmentShaderDoneLoading){
			this.compileProgram();
		}
	}).bind(this);

	Tool.ajaxGet(vertexShaderPath, (function callback(vertCode){
		this.vertexShader = this.compileShader(vertCode,
			this.gl.VERTEX_SHADER);
		if(this.vertexShader == null){
			return null;
		}
		this.vertexShaderDoneLoading = true;
		compileProgramIfDone();
	}).bind(this), function callbackFail(){
		this.isFailed = true;
		this.failMessage = ShaderProgram.ERROR_LOADING_VERTEX_SHADER;
	});
	Tool.ajaxGet(fragmentShaderPath, (function callback(fragCode){
		this.fragmentShader = this.compileShader(fragCode,
			this.gl.FRAGMENT_SHADER);
		if(this.fragmentShader == null){
			return null;
		}
		this.fragmentShaderDoneLoading = true;
		compileProgramIfDone();
	}).bind(this), function callbackFail(){
		this.isFailed = true;
		this.failMessage = ShaderProgram.ERROR_LOADING_FRAGMENT_SHADER;
	});
}
ShaderProgram.prototype.compileProgram = function(){
	this.program = this.gl.createProgram();
	this.gl.attachShader(this.program, this.vertexShader);
	this.gl.attachShader(this.program, this.fragmentShader);
	this.gl.linkProgram(this.program);
	if(!this.gl.getProgramParameter(this.program,
			this.gl.LINK_STATUS)){
		this.isFailed = true;
		this.failMessage = ShaderProgram.ERROR_LINKING_SHADERS;
		Tool.printError(this.failMessage);
	}else{
		this.isReady = true;
	}
	// Event listeners
	while (this.readyCallBackFunctions.length > 0) {
		this.readyCallBackFunctions.pop()();
	}
}
ShaderProgram.prototype.compileShader = function(code, type){
	var shader = this.gl.createShader(type);
	this.gl.shaderSource(shader, code);
	this.gl.compileShader(shader);
	// check for errors
	if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
		this.isFailed = true;
		var typeName;
		if(type == this.gl.VERTEX_SHADER){
			this.failMessage = ShaderProgram.ERROR_COMPILING_VERTEX_SHADER;
			
			var typeName = "vertex";
		}else{ // type == this.gl.FRAGMENT_SHADER
			this.failMessage = ShaderProgram.ERROR_COMPILING_FRAGMENT_SHADER;
			var typeName = "fragment";
		}
		this.failMessage += "\nERROR::ShaderProgram: Compile error in " + typeName + " shader: \n\n" + this.gl.getShaderInfoLog(shader);
		Tool.printError(this.failMessage);
		return null;
	}

	return shader;
}
ShaderProgram.prototype.use = function(){
	this.gl.useProgram(this.program);
}
ShaderProgram.prototype.getAttributeLocation = function (name) {
	return this.gl.getAttribLocation(this.program, name);
}
ShaderProgram.prototype.setUniformPrepare = function(name){
	this.use();
	var loc = this.gl.getUniformLocation(this.program, name);
	if(loc == null){
		var message = "Could not find \"" + name + "\" uniform in shader.";
		if(this.printedWarnings.indexOf(message) == -1){
			this.printedWarnings.push(message);
			console.warn(message);
		}
	}
	return loc;
}
ShaderProgram.prototype.setUniformInt = function(name, integer){
	var loc = this.setUniformPrepare(name);
	this.gl.uniform1i(loc, integer);
}
ShaderProgram.prototype.setUniformFloat = function(name, value){
	var loc = this.setUniformPrepare(name);
	this.gl.uniform1fv(loc, [value]);
}
ShaderProgram.prototype.setUniformVec3 = function(name, vec3){
	var loc = this.setUniformPrepare(name);
	this.gl.uniform3fv(loc, [vec3.x, vec3.y, vec3.z]);
}
ShaderProgram.prototype.setUniformVec2 = function(name, vec2){
	var loc = this.setUniformPrepare(name);
	this.gl.uniform2fv(loc, [vec2.x, vec2.y]);
}
ShaderProgram.prototype.setUniformMat3 = function(name, mat3){
	var loc = this.setUniformPrepare(name);
	this.gl.uniformMatrix3fv(loc, false, mat3);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.shader_program', true);