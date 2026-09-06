/*
Example:
	mesh = new Mesh(gl); // webgl2 context
	mesh.loadOutline([
		Tool.listToVec2([
			4,5,7,3,11,5,11,8,8,6,7,8,3,5 // Outer circumference. Counter clockwise.
		]),
		Tool.listToVec2([
			6,6,7,6,8,4,5,5 // A hole. Clockwise.
		])
	]);
	mesh.orientation = someOrientation; // a number
	mesh.position = somePosition; // a Vec2
	mesh.setProjection(projection); // a Matrix3D
	mesh.setView(someView); // a Matrix3D
	mesh.render();
*/

Mesh.FILL = "FILL";
Mesh.OUTLINE = "OUTLINE";

function Mesh(gl, shaderProgram, meshHandler){
	this.gl;
	this.shaderProgram;
	this.meshHandler = meshHandler;
	this.vertexBuffer;
	this.elementBuffer;
	this.nrOfIndices;

	this.position = new Vec2();
	this.orientation = 0;
	this.color = new Vec3(1,0,0);
	this.drawMode = Mesh.FILL;

	this.isVisible = true;
	this.depth = 0;
	this.scale = new Vec2(1,1);
}
Mesh.prototype.bindGL = function (gl, shaderProgram) {
	this.gl = gl;

	this.shaderProgram = shaderProgram;

	this.vertexBuffer = new VertexBuffer(this.gl);
	this.elementBuffer = new ElementBuffer(this.gl);

	this.shaderProgram.addReadyCallBack((function(){
		var loc = this.shaderProgram.getAttributeLocation("position");
		this.vertexBuffer.addAttributePointer(0, 2, this.gl.FLOAT);
	}).bind(this));
}
Mesh.prototype.delete = function () {
	var index = this.meshHandler.meshes.indexOf(this);

	this.meshHandler.meshes.splice(index, 1);
	this.vertexBuffer.delete();
	this.elementBuffer.delete();
}
Mesh.prototype.loadOutline = function (circumferences, doLoop = true) {

	this.drawMode = Mesh.OUTLINE;

	var vertices = [];
	var indices = [];
	var nextIndex = 0;
	for (let i = 0; i < circumferences.length; i++) {
		const c = circumferences[i];
		var firstVertexIndex = nextIndex;
		for (let j = 0; j < c.length; j++) {
			const v = c[j];
			
			vertices.push(v.x);
			vertices.push(v.y);

			indices.push(nextIndex);
			if (j>0) {
				indices.push(nextIndex);
			}
			nextIndex++;
		}
		if(c.length == 0){
			continue;
		}
		if(doLoop){
			if(c.length > 0){
				indices.push(firstVertexIndex);
			}
		}else{
			indices.pop();
		}
	}

	this.loadShape(vertices, indices);
}
Mesh.prototype.loadOutlineToTriangles = function (circumferences) {
	
	this.drawMode = Mesh.FILL;

	// Circumferences is a 2d array of Vec2s that describe the corners of a polygon with holes in it. Innwards is to the left as you move forward through the second dimension of the list. Example ("(a,b)" is a vector): [[(0,0), (3,0), (3,3), (0,3)], [(1,1),(1,2),(2,2),(2,1)]] is a box with a box shaped hole in it.
	var triangles = Tool.triangulatePolygon(circumferences);

	/*var triangles2 = [];
	for (let i = 0; i < triangles.length; i++) {
		const t = triangles[i];
		triangles2.push(t);
		if ((i%3) > 0) {
			triangles2.push(t);
		}
		if ((i%3) == 2) {
			triangles2.push(triangles[i-2]);
		}
	}
	triangles = triangles2;*/
	
	/*var triangles2 = [];
	for (var i = 0; i < triangles.length; i ++) {
		triangles2.push(triangles[i].clone());
	}
	triangles = triangles2;
	for (var i = 0; i < triangles.length; i += 3) {
		var t0 = triangles[i];
		var t1 = triangles[i+1];
		var t2 = triangles[i+2];
		var center = Vec2.addMany(t0, t1, t2).div(3);
		t0.lerp(center, 0.1);
		t1.lerp(center, 0.1);
		t2.lerp(center, 0.1);
	}*/
	this.loadTriangles(triangles);
}
Mesh.prototype.loadTriangles = function (triangles) {

	var vertices = [];
	var indices = [];

	var nextIndex = -1;
	var vertexLog = [];
	var indexLog = [];
	for (var i = 0; i < triangles.length; i++) {
		var t = triangles[i];
		
		var index = vertexLog.indexOf(t);
		if(index != -1){
			indices.push(indexLog[index]);
			continue;
		}

		vertices.push(t.x);
		vertices.push(t.y);
		indices.push(++nextIndex);

		vertexLog.push(t);
		indexLog.push(nextIndex);
	}
	this.loadShape(vertices, indices);
}
Mesh.prototype.loadShape = function(vertices, indices){
	this.nrOfIndices = indices.length;

	this.vertexBuffer.setDataFloat(vertices);
	this.elementBuffer.setData(indices);
}
Mesh.prototype.render = function(view, projection){
	
	this.shaderProgram.use();
	// Model matrix.
	var modelMatrix = Matrix3D.getScaleXY(this.scale.x, this.scale.y);
	modelMatrix = Matrix3D.rotate(modelMatrix, this.orientation);
	modelMatrix = Matrix3D.translate(modelMatrix, this.position);
	this.shaderProgram.setUniformMat3("model", modelMatrix);
	// View matrix.
	this.shaderProgram.setUniformMat3("view", view);
	// Projection matrix.
	this.shaderProgram.setUniformMat3("projection", projection);
	// Color.
	this.shaderProgram.setUniformVec3("color", this.color);
	// Depth.
	this.shaderProgram.setUniformFloat("depth", this.depth);
	// Render.
	this.elementBuffer.bind();
	this.vertexBuffer.bind();
	if (this.drawMode == Mesh.FILL) {
		this.gl.drawElements(this.gl.TRIANGLES, this.nrOfIndices, this.gl.UNSIGNED_SHORT, 0);
		//this.gl.drawElements(this.gl.LINES, this.nrOfIndices, this.gl.UNSIGNED_SHORT, 0);
	} else if (this.drawMode = Mesh.OUTLINE) {
		this.gl.drawElements(this.gl.LINES, this.nrOfIndices, this.gl.UNSIGNED_SHORT, 0);
	}
	return true;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.mesh', true);