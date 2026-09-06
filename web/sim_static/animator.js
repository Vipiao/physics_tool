

function Animator (canvas){
	this.animatedObjects = [];
	this.fixedConstraints = [];
	this.hingeConstraints = [];
	this.ropes = [];
	this.pulleys = [];
	
	this.pausePhysics = false;
	this.pause = false;

	// -Physics-
	this.phx = new PHX();
	
	// -Graphics-
	// Canvas.
	this.canvas = canvas;
	this.prevCanvasWidth = this.canvas.width;
	this.prevCanvasHeight = this.canvas.height;
	this.renderContext = new RenderContext();
	this.renderContext.bindCanvas(canvas);
	// Camera.
	this.camera = new Camera();
	this.camera.viewPortWidth = this.renderContext.canvas.width;
	this.camera.viewPortHeight = this.renderContext.canvas.height;
	this.camera.width = 60;
	this.camera.position = new Vec2(0,0);

	this.camera.calculateProjection();
	this.camera.calculateView();

	this.cameraVelocity = new Vec2();

	// Mesh handler.
	this.meshHandeler = new MeshHandler();
	this.meshHandeler.bindGL(this.renderContext.gl);

	// Debug
	this.debugRender = new DebugRender();
	this.debugRender.bindGL(this.renderContext.gl);
	//this.debugRender.isActive = false;

	this.graphicsTick = 0;
}
Animator.prototype.isReady = function () {
	return this.meshHandeler.isReady() && this.debugRender.isReady();
}
Animator.prototype.runPhysics = function () {
	if (this.pause) {
		return;
	}
	// Move camera.
	if (!this.pausePhysics) {
		this.camera.position.add(this.cameraVelocity);
	}
	//
	this.phx.run();
}
Animator.prototype.runGraphics = function (clearDebug = true, adjustCanvasSize = true){

	// Check for resizing of the canvas.
	if(adjustCanvasSize && (
		this.prevCanvasWidth != this.canvas.width || this.prevCanvasWidth != this.canvas.style.width || this.canvas.width != parseFloat(this.canvas.style.width) || this.prevCanvasHeight != this.canvas.height || this.prevCanvasHeight != this.canvas.style.height || this.canvas.height != parseFloat(this.canvas.style.height)
	)){
		
		//this.canvas.width = parseFloat(this.canvas.style.width);
		//this.canvas.height = parseFloat(this.canvas.style.height);
    
		this.canvas.width = parseFloat(this.canvas.offsetWidth);
		this.canvas.height = parseFloat(this.canvas.offsetHeight);
		
		this.renderContext.resizeToCanvas();
		this.camera.viewPortWidth = this.canvas.width;
		this.camera.viewPortHeight = this.canvas.height;
		this.camera.calculateProjection();
	}
	
	// -Rendering-
	// Camera.
	this.camera.calculateView();
	this.camera.calculateProjection();
	// Clear canvas.
	this.renderContext.clear();
	this.meshHandeler.setView(this.camera.view);
	this.meshHandeler.setProjection(this.camera.projection);
	// Update animated objects.
	for (var i = 0; i < this.animatedObjects.length; i++) {
		var g = this.animatedObjects[i];
		g.mesh.orientation = g.polygon.orientation;
		g.mesh.position = g.polygon.position.clone();
	}
	// Update animated fixed constraints.
	for (let i = 0; i < this.fixedConstraints.length; i++) {
		const fc = this.fixedConstraints[i];
		fc.mesh.position = fc.constraint.worldPosition.clone();
	}
	// Update animated hinge constraints.
	for (let i = 0; i < this.hingeConstraints.length; i++) {
		const hc = this.hingeConstraints[i];
		hc.constraint.calculateContactPoint();
		hc.mesh.position = hc.constraint.contactPoint.clone();
	}
	// Update ropes.
	for (let i = 0; i < this.ropes.length; i++) {
		const r = this.ropes[i];
		r.mesh.loadOutline([[r.rope.getContactWorldA(), r.rope.getContactWorldB()]]);
	}
	// Update pulleys.
	for (let i = 0; i < this.pulleys.length; i++) {
		const p = this.pulleys[i];
		p.mesh.loadOutline([[p.getContactWorldA(), p.getContactWorldB()]]);
	}

	this.meshHandeler.renderAll();
	// Render debug overlay.
	this.debugRender.setView(this.camera.view);
	this.debugRender.setProjection(this.camera.projection);
	this.debugRender.render();

	//
	this.graphicsTick++;
}
Animator.prototype.clearDebug = function () {
	this.debugRender.clearData();
}
Animator.prototype.createAnimatedObject = function (geometry) {
	function cloneGeometry (circumferences){
		var clone = [];
		for (var i = 0; i < circumferences.length; i++) {
			var circumference = circumferences[i];
			clone.push([]);
			for (var j = 0; j < circumference.length; j++) {
				var position = circumference[j];
				clone[i].push(position.clone());
			}
		}
		return clone;
	}
	// Physics
	var polygon = this.phx.createPolygon();
	polygon.setGeometry(geometry);
	polygon.calculateInertia();
	polygon.updateVertexWorldPositions();
	polygon.calculateCollisionBoxes();
	polygon.savePreviousCoordinates();
	
	return this.createAnimatedObjectFromPhx(polygon);
}
Animator.prototype.createAnimatedObjectFromPhx = function (polygon) {
	// Graphics
	var newMesh = this.meshHandeler.createMesh();
	newMesh.loadOutlineToTriangles(polygon.getGeometry());
	//newMesh.loadOutline(polygon.getGeometry());
	//newMesh.drawMode = Mesh.OUTLINE;
	// Combine
	var newAnimatedObject = new AnimatedObject(polygon, newMesh, this);
	this.animatedObjects.push(newAnimatedObject);
	return newAnimatedObject;
}
Animator.prototype.createFixedConstraint = function (animatedObject, worldPosition) {
	// Physics.
	var c = this.phx.createFixedConstraint(animatedObject.polygon, worldPosition);

	return this.createFixedConstraintFromPhx(animatedObject, c);
}
Animator.prototype.createFixedConstraintFromPhx = function (animatedObject, c) {
	// Graphics.
	var m = this.meshHandeler.createMesh();
	m.depth = -0.1; // Lower value is closer to screen. -1 <= depth <= 1.
	m.color = new Vec3(0,0,1);
	var dimensions = 1;
	var thickness = 0.1;
	/* It's a cross, where the thickness is the distance between 7, 1, 5 and 3. |7-1| = thickness. thickness is total height and width.
	     0
	    / \
   _---7   1---_
  6_	       _2
    ---5   3---
	    \ /
		 4
	*/
	var outline = Tool.listToVec2([
		          0, dimensions,
		 -thickness,  thickness,
		-dimensions,          0,
		 -thickness, -thickness,
		          0,-dimensions,
		  thickness, -thickness,
		 dimensions,          0,
		  thickness,  thickness,
	]);
	m.loadOutlineToTriangles([outline]);

	var newAnimatedConstraint = new AnimatedFixedConstraint(c, m, this, animatedObject);
	this.fixedConstraints.push(newAnimatedConstraint);

	return newAnimatedConstraint;
}
Animator.prototype.createHingeConstraint = function (animatedObjectA, animatedObjectB, worldPositionA, worldPositionB) {
	// Physics.
	var c = this.phx.createHingeConstraint(animatedObjectA.polygon, animatedObjectB.polygon, worldPositionA, worldPositionB);

	return this.createHingeConstraintFromPhx(animatedObjectA, animatedObjectB, c);
}
Animator.prototype.createHingeConstraintFromPhx = function (animatedObjectA, animatedObjectB, c) {
	// Graphics.
	var m = this.meshHandeler.createMesh();
	m.depth = -0.1; // Lower value is closer to screen. -1 <= depth <= 1.
	m.color = new Vec3(0,0,1);
	var dimensions = 1;
	var thickness = 0.1;
	/* It's a cross, where the thickness is the distance between 7, 1, 5 and 3. |7-1| = thickness. thickness is total height and width.
	     0
	    / \
   _---7   1---_
  6_	       _2
    ---5   3---
	    \ /
		 4
	*/
	var outline = Tool.listToVec2([
		          0, dimensions,
		 -thickness,  thickness,
		-dimensions,          0,
		 -thickness, -thickness,
		          0,-dimensions,
		  thickness, -thickness,
		 dimensions,          0,
		  thickness,  thickness,
	]);
	m.loadOutlineToTriangles([outline]);

	var newAnimatedConstraint = new AnimatedHingeConstraint(c, m, this, animatedObjectA, animatedObjectB);
	this.hingeConstraints.push(newAnimatedConstraint);

	return newAnimatedConstraint;
}
Animator.prototype.createRope = function (animatedObjectA, animatedObjectB, worldPositionA, worldPositionB) {
	// Physics.
	var rope = this.phx.createRope(animatedObjectA.polygon, animatedObjectB.polygon, worldPositionA, worldPositionB);

	return this.createRopeFromPhx(animatedObjectA, animatedObjectB, rope);
}
Animator.prototype.createRopeFromPhx = function (animatedObjectA, animatedObjectB, rope) {
	// Graphics.
	var m = this.meshHandeler.createMesh();
	m.depth = -0.1; // Lower value is closer to screen. -1 <= depth <= 1.
	m.color = new Vec3(0.6,0.6,0.6);
	
	//m.loadOutline([outline]);

	var newRope = new AnimatedRope(rope, m, this, animatedObjectA, animatedObjectB);
	this.ropes.push(newRope);

	return newRope;
}
Animator.prototype.createPulley = function (ropeA, ropeB, useFirstEndOfA, useFirstEndOfB) {
	// Physics.
	var pulley = this.phx.createPulley();
	pulley.attachRopesA(ropeA.rope, useFirstEndOfA);
	pulley.attachRopesB(ropeB.rope, useFirstEndOfB);

	return this.createPulleyFromPhx(ropeA, ropeB, useFirstEndOfA, useFirstEndOfB, pulley);
}
Animator.prototype.createPulleyFromPhx = function (ropeA, ropeB, useFirstEndOfA, useFirstEndOfB, pulley) {
	// Graphics.
	var m = this.meshHandeler.createMesh();
	m.depth = -0.1;
	m.color = new Vec3(0,0.5,0);

	//
	var newPulley = new AnimatedPulley(this, pulley, m, ropeA, ropeB, useFirstEndOfA, useFirstEndOfB);
	this.pulleys.push(newPulley);

	return newPulley;
}
Animator.prototype.createMesh = function () {
	var newMesh = this.meshHandeler.createMesh();
	return newMesh;
}
Animator.prototype.setGravity = function (newGravity) {
	this.phx.gravity = newGravity.clone();
}
Animator.prototype.getGravity = function () {
	return this.phx.gravity.clone();
}
Animator.prototype.setPause = function (newPause) {
	this.pause = newPause;
}
Animator.prototype.getPause = function () {
	return this.pause;
}
Animator.prototype.setPausePhysics = function (newPausePhysics) {
	if (newPausePhysics == this.pausePhysics) {
		return;
	}
	this.pausePhysics = newPausePhysics;
	if (newPausePhysics) {
		this.phx.enableForces = false;
		this.phx.enableMeasureCollisionError = false;
		this.phx.enableMovement = false;
		this.phx.enableCollisionDetection = true;
		this.phx.enableResolutionByDisplacement = true;
	}else{
		this.phx.enableForces = true;
		this.phx.enableMeasureCollisionError = true;
		this.phx.enableMovement = true;
		this.phx.enableCollisionDetection = true;
		this.phx.enableResolutionByDisplacement = true;
	}
}
Animator.prototype.getPausePhysics = function () {
	return this.pausePhysics;
}
Animator.prototype.getAnimationData = function () {
	var animatedObjectsData = [];
	for (let i = 0; i < this.animatedObjects.length; i++) {
		const a = this.animatedObjects[i];
		animatedObjectsData.push({
			"color": a.getColor(),
		});
	}
	
	return animatedObjectsData;
}
Animator.prototype.saveAsObjectSaveData = function () {
	
	var saveData = {
		"animatedObjectsData": this.getAnimationData(),
		"phx": Tool.deepCopy(this.phx),
	};
	
	return saveData;
}
Animator.prototype.loadObjectSaveData = function (saveData) {
	this.handleLoad(Tool.deepCopy(saveData.phx), saveData.animatedObjectsData);
}
Animator.prototype.save = function () {

	var animatedObjectsData = this.getAnimationData();

	var s = JSON.stringify({
		//"phx": Tool.stringify(this.phx),
		"animatedObjectsData": animatedObjectsData,
		//"fixedData": fixedData,
	});

	s += " " + Tool.stringify(this.phx);

	return s;
}
Animator.prototype.load = function (s) {
	try {
		// Split data into JSON and phx data.
		var splitIndex = s.indexOf(" ");
		var loadedPhx = Tool.deStringify(s.substring(splitIndex + 1));
		var loadedData = JSON.parse(s.substring(0, splitIndex));


		//var loadedData = JSON.parse(s);
		//var loadedPhx = Tool.deStringify(loadedData.phx);

		var animatedObjectsData = loadedData.animatedObjectsData;
		//var fixedData = loadedData.fixedData;
	} catch (error) {
		throw "ERROR: Corrupt loading data.";
	}

	this.handleLoad(loadedPhx, animatedObjectsData);
}
Animator.prototype.handleLoad = function (newPhx, animatedObjectsData) {

	// Delete all objects.
	while(this.animatedObjects.length > 0){
		this.animatedObjects[0].delete();
	}

	this.phx = newPhx;

	// Restore animated objects from physics data.
	for (let i = 0; i < this.phx.polygons.length; i++) {
		const p = this.phx.polygons[i];
		var data = animatedObjectsData[i];
		var newAnimatedObject = this.createAnimatedObjectFromPhx(p);
		newAnimatedObject.setColor(new Vec3(data.color.x, data.color.y, data.color.z));
	}

	// Restore fixed constraints from physics data.
	for (let i = 0; i < this.phx.fixedConstraints.length; i++) {
		const f = this.phx.fixedConstraints[i];
		// Find animated object.
		var fixedAnimatedObject;
		for (let i = 0; i < this.animatedObjects.length; i++) {
			const a = this.animatedObjects[i];
			if (a.polygon.fixedConstraints.indexOf(f) != -1) {
				fixedAnimatedObject = a;
				break;
			}
		}
		if (fixedAnimatedObject == null) {
			throw "ERROR: Corrupt loading data. Scene corrupted.";
		}
		this.createFixedConstraintFromPhx(fixedAnimatedObject, f);
	}
	
	// Restore hinge constraints from physics data.
	for (let i = 0; i < this.phx.hingeConstraints.length; i++) {
		const h = this.phx.hingeConstraints[i];
		// Find animated objects.
		var hingeAnimatedObjectA = null;
		var hingeAnimatedObjectB = null;
		for (let i = 0; i < this.animatedObjects.length; i++) {
			const a = this.animatedObjects[i];
			if (a.polygon.hingeConstraints.indexOf(h) != -1) {
				if (h.polygonIsA(a.polygon)) {
					hingeAnimatedObjectA = a;
				}else{
					hingeAnimatedObjectB = a;
				}
				if (hingeAnimatedObjectA != null && hingeAnimatedObjectB != null) {
					break;
				}
			}
		}
		if (hingeAnimatedObjectA == null || hingeAnimatedObjectB == null) {
			throw "ERROR: Corrupt loading data. Scene corrupted.";
		}
		this.createHingeConstraintFromPhx(hingeAnimatedObjectA, hingeAnimatedObjectB, h);
	}
	
	// Restore ropes from physics data.
	for (let i = 0; i < this.phx.ropes.length; i++) {
		const r = this.phx.ropes[i];
		// Find animated objects.
		var ropeAnimatedObjectA = null;
		var ropeAnimatedObjectB = null;
		for (let i = 0; i < this.animatedObjects.length; i++) {
			const a = this.animatedObjects[i];
			if (a.polygon.ropes.indexOf(r) != -1) {
				if (r.polygonIsA(a.polygon)) {
					ropeAnimatedObjectA = a;
				}else{
					ropeAnimatedObjectB = a;
				}
				if (ropeAnimatedObjectA != null && ropeAnimatedObjectB != null){
					break;
				}
			}
		}
		if (ropeAnimatedObjectA == null || ropeAnimatedObjectB == null) {
			throw "ERROR: Corrupt loading data. Scene corrupted.";
		}
		this.createRopeFromPhx(ropeAnimatedObjectA, ropeAnimatedObjectB, r);
	}
	
	// Restore pulleys from physics data.
	for (let i = 0; i < this.phx.pulleys.length; i++) {
		const p = this.phx.pulleys[i];
		// Find animated objects.
		var pulleyAnimatedRopeA = null;
		var useFirstEndOfA;
		var pulleyAnimatedRopeB = null;
		var useFirstEndOfB;
		for (let i = 0; i < this.ropes.length; i++) {
			const r = this.ropes[i];
			if (p.ropeA == r.rope) {
				pulleyAnimatedRopeA = r;
				if (r.rope.pulleyA == p) {
					useFirstEndOfA = true;
				}else{
					useFirstEndOfA = false;
				}
				if (pulleyAnimatedRopeB != null) {
					break;
				}
			}else if(p.ropeB == r.rope){
				pulleyAnimatedRopeB = r;
				if (r.rope.pulleyA == p) {
					useFirstEndOfB = true;
				}else{
					useFirstEndOfB = false;
				}
				if (pulleyAnimatedRopeA != null) {
					break;
				}
			}
		}
		if (pulleyAnimatedRopeA == null || pulleyAnimatedRopeB == null || useFirstEndOfA == null || useFirstEndOfB == null) {
			throw "ERROR: Corrupt loading data. Scene corrupted.";
		}
		this.createPulleyFromPhx(pulleyAnimatedRopeA, pulleyAnimatedRopeB, useFirstEndOfA, useFirstEndOfB, p);
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.animator', true);