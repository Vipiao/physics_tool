/*
Example:
	debugRender = new DebugRender(gl); // webgl2 context
	debugRender.setProjection(projection); // a Matrix3D
	debugRender.setView(someView); // a Matrix3D
	debugRender.addCross(new Vec2(2,3), 3.); // Multiple crosses can be added.
	mesh.render();
	debugRender.clear(); // Clears added crosses.
*/

function DebugRender() {
	this.gl;

	this.isActive = true;

	this.view;
	this.viewIsSet = false;
	this.projection;
	this.projectionIsSet = false;

	// Cross.
	// Shader program.
	this.crossShaderProgram;
	// Vertex buffer.
	this.crossVertexBuffer;
	// Array of {Vec2 position, float size, Vec3 color} where the crosses should be drawn.
	this.crossPositions = [];

	// Boxes.
	// Shader program.
	this.boxShaderProgram;
	// Vertex buffer.
	this.boxVertexBuffer;
	// Array of {Vec2 lowerLeftCorner, Vec2 upperRightCorner, Vec3 color}.
	this.boxesData = [];

	// MultiLines.
	this.hasWarnedMaxMultilines = false;
	this.numberOfMultiLinesLines = 0;
	// Shader program.
	this.multiLinesShaderProgram;
	
	// Vertex buffer.
	this.multiLinesVertexBuffer;
	this.maxMultiLines = 8192;
	// Array of {Array corners[Vec2 corner], bool isClosed, Vec3 color}.
	this.multiLinesData = [];

	// Ruler.
	// Shader program.
	this.rulerShaderProgram;
	// Vertex buffer.
	this.rulerVertexBuffer;
}
DebugRender.prototype.bindGL = function (gl) {
	this.gl = gl;

	// Cross.
	// Shader program.
	this.crossShaderProgram = new ShaderProgram(this.gl);
	this.crossShaderProgram.loadShadersFromPath(
		"sim_static/graphics/shaders/debug_render_shaders/cross_vertex_shader.vert",
		"sim_static/graphics/shaders/debug_render_shaders/cross_fragment_shader.frag",
	);
	// Vertex buffer.
	this.crossVertexBuffer = new VertexBuffer(this.gl);
	this.crossVertexBuffer.setDataFloat([
		-1,-1, 1, 1,
		 1,-1,-1, 1,
	]);
	this.crossVertexBuffer.addAttributePointer(0, 2, this.gl.FLOAT);

	// Boxes.
	// Shader program.
	this.boxShaderProgram = new ShaderProgram(this.gl);
	this.boxShaderProgram.loadShadersFromPath(
		"sim_static/graphics/shaders/debug_render_shaders/box_vertex_shader.vert",
		"sim_static/graphics/shaders/debug_render_shaders/box_fragment_shader.frag",
	);
	// Vertex buffer.
	this.boxVertexBuffer = new VertexBuffer(this.gl);
	this.boxVertexBuffer.setDataFloat([
		-1,-1,
		 1,-1,
		 1, 1,
		-1, 1,
	]);
	this.boxVertexBuffer.addAttributePointer(0, 2, this.gl.FLOAT);

	// MultiLines.
	// Shader program.
	this.multiLinesShaderProgram = new ShaderProgram(this.gl);
	this.multiLinesShaderProgram.loadShadersFromPath(
		"sim_static/graphics/shaders/debug_render_shaders/multi_line_vertex_shader.vert",
		"sim_static/graphics/shaders/debug_render_shaders/multi_line_fragment_shader.frag",
	);
	// Vertex buffer.
	this.multiLinesVertexBuffer = new VertexBuffer(this.gl);
	this.multiLinesVertexBuffer.reserveBytes(4 * (2+3) * 2 * this.maxMultiLines, true); // 4 bytes per float * (2 floats per vector coordinate + 3 floats per color value) * 2 vertices per (vector coordinate + color) * this.maxMultiLines vector coordinates. "true" means the buffer is dynamic.
	this.multiLinesVertexBuffer.addAttributePointer(0, 2, this.gl.FLOAT, 4 * 2 + 4 * 3, 0); // Coordinates.
	this.multiLinesVertexBuffer.addAttributePointer(1, 3, this.gl.FLOAT, 4 * 2 + 4 * 3, 4 * 2); // Colors

	// Ruler.
	// Shader program.
	this.rulerShaderProgram = new ShaderProgram(this.gl);
	this.rulerShaderProgram.loadShadersFromPath(
		"sim_static/graphics/shaders/debug_render_shaders/ruler_vertex_shader.vert",
		"sim_static/graphics/shaders/debug_render_shaders/ruler_fragment_shader.frag",
	);
	// Vertex buffer.
	this.rulerVertexBuffer = new VertexBuffer(this.gl);
	this.rulerVertexBuffer.addAttributePointer(0, 2, this.gl.FLOAT);
	this.rulerVertexBuffer.setDataFloat([
		-1,-1, // Triangle 1.
		 1,-1,
		 1, 1,
		-1,-1, // Triangle 2.
		 1, 1,
		-1, 1,
	]);
}
DebugRender.prototype.isReady = function () {
	return this.crossShaderProgram.isReady && this.boxShaderProgram.isReady && this.multiLinesShaderProgram.isReady && this.rulerShaderProgram.isReady;
}
DebugRender.prototype.clearData = function () {
	// Crosses.
	this.crossPositions = [];
	// Boxes.
	this.boxesData = [];
	// Multi lines.
	this.multiLinesData = [];
	this.numberOfMultiLinesLines = 0;
}
DebugRender.prototype.addCross = function (position, size = 0.1, color = new Vec3(1,1,1)) {
	if(!this.isActive){
		return;
	}
	this.crossPositions.push({
		"position": position.clone(),
		"size": size,
		"color": color.clone(),
	});
}
DebugRender.prototype.addBox = function (lowerLeftCorner, upperRightCorner, color = new Vec3(1,1,1)) {
	if(!this.isActive){
		return;
	}
	this.boxesData.push({
		"lowerLeftCorner": lowerLeftCorner,
		"upperRightCorner": upperRightCorner,
		"color": color,
	});
}
DebugRender.prototype.addMultiLines = function (corners, isClosed = false, color = new Vec3(1,1,1)) {
	if(!this.isActive){
		return;
	}
	if(this.numberOfMultiLinesLines + corners.length > this.maxMultiLines){
		if(!this.hasWarnedMaxMultilines){
			console.warn("Too many multilines. Out of memory.");
			this.hasWarnedMaxMultilines = true;
		}
		return false;
	}
	this.numberOfMultiLinesLines += corners.length;
	this.multiLinesData.push({
		"corners": Tool.cloneArray(corners),
		"isClosed": isClosed,
		"color": color,
	});
	return true;
}
DebugRender.prototype.addVector = function (vector, startPosition, color = new Vec3(1,1,1), arrowSize = 0.5) {
	var sqrtOfHalf = 0.7071067811865476; //Math.sqrt(2)/2;
	var endPosition = Vec2.add(startPosition, vector);
	var corners = [
		startPosition,
		endPosition,
		Vec2.add(endPosition, new Vec2(
			(-vector.x - vector.y) * sqrtOfHalf * arrowSize,
			(-vector.y + vector.x) * sqrtOfHalf * arrowSize
		)),
	];
	var corners2 = [
		endPosition,
		Vec2.add(endPosition, new Vec2(
			(-vector.x + vector.y) * sqrtOfHalf * arrowSize,
			(-vector.y - vector.x) * sqrtOfHalf * arrowSize
		)),
	];
	this.addMultiLines(corners, false, color);
	this.addMultiLines(corners2, false, color);
}
DebugRender.prototype.setView = function(viewMatrix) {
	this.viewIsSet = true;
	this.view = viewMatrix;
}
DebugRender.prototype.setProjection = function(projectionMatrix) {
	this.projectionIsSet = true;
	this.projection = projectionMatrix;
}
DebugRender.prototype.render = function () {
	if(!this.isActive){
		return;
	}
	// Checking if ready or has errors.
	if(!this.viewIsSet || !this.projectionIsSet){
		this.printWarnign("Cannot render before view and projection is set using \"setView(viewMatrix)\" and \"setProjection(projectionMatrix)\".");
		return null;
	}
	if(!this.crossShaderProgram.isReady || !this.boxShaderProgram.isReady){
		if(this.crossShaderProgram.isFailed || this.boxShaderProgram.isFailed){
			Tool.printError("ERROR::DebugRender:render(): " + this.shaderProgram.failMessage); // TODO: <- bug
			
		}
		return false;
	}

	// -Render-
	this.renderCrosses();
	this.renderBoxes();	
	this.renderMultiLines();	
	this.renderRuler();
}
DebugRender.prototype.renderCrosses = function () {
	this.crossShaderProgram.use();
	this.crossVertexBuffer.bind();
	for (var i = 0; i < this.crossPositions.length; i++) {
		var position = this.crossPositions[i].position;
		var size = this.crossPositions[i].size;
		var color = this.crossPositions[i].color;

		// Model matrix.
		var model = Matrix3D.getScale(size);
		model = Matrix3D.translate(model, position);
		this.crossShaderProgram.setUniformMat3("model", model);
		// View matrix.
		this.crossShaderProgram.setUniformMat3("view", this.view);
		// Projection matrix.
		this.crossShaderProgram.setUniformMat3("projection", this.projection);
		// Color.
		this.crossShaderProgram.setUniformVec3("color", color);
		// Render.
		this.gl.drawArrays(this.gl.LINES, 0, 4);
	}
}
DebugRender.prototype.renderBoxes = function () {
	this.boxShaderProgram.use();
	this.boxVertexBuffer.bind();
	for (var i = 0; i < this.boxesData.length; i++) {
		// Array of {Vec2 lowerLeftCorner, Vec2 upperRightCorner, Vec3 color}.
		var lowerLeftCorner = this.boxesData[i].lowerLeftCorner;
		var upperRightCorner = this.boxesData[i].upperRightCorner;
		var color = this.boxesData[i].color;

		var width = (upperRightCorner.x - lowerLeftCorner.x) * 0.5;
		var height = (upperRightCorner.y - lowerLeftCorner.y) * 0.5;
		var position = Vec2.average(upperRightCorner, lowerLeftCorner);

		// Set dimensions.
		this.boxShaderProgram.setUniformFloat("width", width);
		this.boxShaderProgram.setUniformFloat("height", height);
		// Model matrix.
		var model = Matrix3D.getTranslation(position);
		this.boxShaderProgram.setUniformMat3("model", model);
		// View matrix.
		this.boxShaderProgram.setUniformMat3("view", this.view);
		// Projection matrix.
		this.boxShaderProgram.setUniformMat3("projection", this.projection);
		// Color.
		this.boxShaderProgram.setUniformVec3("color", color);
		// Render.
		this.gl.drawArrays(this.gl.LINE_LOOP, 0, 4);
	}
}
DebugRender.prototype.renderMultiLines = function () {
	// Load data to buffer.
	var data = [];
	for (var i = 0; i < this.multiLinesData.length; i++) {
		// Array of {Vec2 lowerLeftCorner, Vec2 upperRightCorner, Vec3 color}.
		var corners = this.multiLinesData[i].corners;
		var isClosed = this.multiLinesData[i].isClosed;
		var color = this.multiLinesData[i].color;

		var prevCorner;
		var indexInit;
		if(isClosed){
			prevCorner = corners[corners.length - 1];
			indexInit = 0;
		}else{
			prevCorner = corners[0];
			indexInit = 1;
		}
		for (var j = indexInit; j < corners.length; j++) {
			var corner = corners[j];
			
			data.push(prevCorner.x);
			data.push(prevCorner.y);
			data.push(color.x);
			data.push(color.y);
			data.push(color.z);
			data.push(corner.x);
			data.push(corner.y);
			data.push(color.x);
			data.push(color.y);
			data.push(color.z);

			//
			prevCorner = corner;
		}
	}
	this.multiLinesVertexBuffer.bind();
	this.multiLinesVertexBuffer.setSubDataFloat(data, 0);
	//
	this.multiLinesShaderProgram.use();
	// View matrix.
	this.multiLinesShaderProgram.setUniformMat3("view", this.view);
	// Projection matrix.
	this.multiLinesShaderProgram.setUniformMat3("projection", this.projection);
	// Render.
	if(data.length > 0){
		this.gl.drawArrays(this.gl.LINES, 0, data.length / 5); // data.length / 5 is how many corners and color components there are. Each segment has 2 corners.
	}
}
DebugRender.prototype.renderRuler = function () {
	this.rulerShaderProgram.use();
	this.rulerVertexBuffer.bind();

	// Clipspace to world space matrix.
	// The below works because the projection matrix does no depth division. this.projection[2 + 3 * 2] == 1 && this.projection[2 + 3 * (1 or 0)] == 0.
	var inverseView = Matrix3D.inverse(this.view);
	var inverseProjection = Matrix3D.inverse(this.projection);

	this.rulerShaderProgram.setUniformMat3("inverseView", inverseView);
	this.rulerShaderProgram.setUniformMat3("inverseProjection", inverseProjection);

	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.debug_render', true);