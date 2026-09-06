
MeshHandler.vertexShaderPath = "sim_static/graphics/shaders/mesh_shaders/mesh_vertex_shader.vert";
MeshHandler.fragmentShaderPath = "sim_static/graphics/shaders/mesh_shaders/mesh_fragment_shader.frag";

function MeshHandler(){
	this.gl;

	this.meshes = [];
	this.shaderProgram;
	this.viewIsSet = false;
	this.view;
	this.projectionIsSet = false;
	this.projection;
}
MeshHandler.prototype.bindGL = function (gl) {
	this.gl = gl;

	this.shaderProgram = new ShaderProgram(this.gl);
	this.shaderProgram.loadShadersFromPath(
		MeshHandler.vertexShaderPath,
		MeshHandler.fragmentShaderPath,
	);
}
MeshHandler.prototype.isReady = function () {
	return this.shaderProgram.isReady;
}
MeshHandler.prototype.setView = function(viewMatrix){
	this.viewIsSet = true;
	this.view = viewMatrix;
}
MeshHandler.prototype.setProjection = function(projectionMatrix){
	this.projectionIsSet = true;
	this.projection = projectionMatrix;
}
MeshHandler.prototype.createMesh = function () {
	var newMesh = new Mesh(this.gl, this.shaderProgram, this);
	newMesh.bindGL(this.gl, this.shaderProgram);
	this.meshes.push(newMesh);
	return newMesh;
}
MeshHandler.prototype.renderAll = function () {
	if(!this.viewIsSet || !this.projectionIsSet){
		this.printWarnign("Cannot render before view and projection is set using \"setView(viewMatrix)\" and \"setProjection(projectionMatrix)\".");
		return null;
	}
	if(!this.shaderProgram.isReady){
		if(this.shaderProgram.isFailed){
			throw "ERROR:\n" + this.shaderProgram.failMessage;
		}
	}
	for (var i = 0; i < this.meshes.length; i++) {
		var m = this.meshes[i];
		if(!m.isVisible){
			continue;
		}
		m.render(this.view, this.projection);
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.mesh_handler', true);