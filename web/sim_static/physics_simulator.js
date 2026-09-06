
/*
	TODO:
		DONE!	Move tool.
		DONE!	Vectors.
		DONE!	Pause play. Move tool.
		DONE!	Save load. Ctrl z ctrl y.
		DONE!	Bug fix tools select.
		DONE!	Callbacks with mouse position.
		DONE!	Draw polygon increment angle and length.
		DONE!	KeyboardControl fix.
		Calulate normals based on shaddow positions.
		Grid view.
		Ruler tool.
		Pulleys, one tool.
*/

function PhysicsSimulator(canvas){
	this.random = new RandomSeed();
	this.initEnums();

	if(!canvas instanceof HTMLCanvasElement){
		canvas = document.getElementById(canvas);
	}
	this.tick = -1;
	this.fps = 60;

	this.animator = new Animator(canvas);
	this.userInterfaceHandler = new UserInterfaceHandler(canvas, this.animator, this);
	this.userInterfaceHandler.animator = this.animator;
	window.debugRender = this.animator.debugRender;

	// Initial states.
	window.debugRender.isActive = false;
	//this.setModePolygonDraw();

	window.newMethod = false;

	/*this.testObject = this.animator.createAnimatedObject(Shapes.square(1));
	//this.testObject.setDensity(1);
	this.testObject.setPosition(new Vec2(0, 0));
	this.testObject.setVelocity(new Vec2(0, -3));*/
	//this.testObject.setOrientation(Tool.degToRad(180));
	//this.testObject.setAngularVelocity(Tool.degToRad(6));
	//this.testConstraint0 = this.animator.createFixedConstraint(this.testObject, new Vec2(0,10));

	/*var rand = 0.5323203531393417;//Math.random();
	console.log(rand);*/

	/*this.testObject2 = this.animator.createAnimatedObject(Shapes.square(1));
	this.testObject2.setPosition(new Vec2(5,0));*/
	//this.testObject2.setOrientation(Tool.degToRad(180));
	//this.testObject2.setVelocity(new Vec2(3, 0));
	//this.testObject2.setAngularVelocity(Tool.degToRad(-6));
	//this.testObject2.setOrientation(Tool.degToRad(-45.1));
	//this.testObject2.setDensity(2);

	//this.hinge = this.animator.createHingeConstraint(this.testObject, this.testObject2, new Vec2(0,0), new Vec2(0,0));

	/*this.testObject3 = this.animator.createAnimatedObject(Shapes.spikes(10, 40));
	this.testObject3.setPosition(new Vec2(0,-10));
	//this.testObject3.setVelocity(new Vec2(-0.11, 0));
	//this.testObject3.setAngularVelocity(0);
	this.testObject3.setOrientation(Tool.degToRad(-45*0));*/

	/*this.testObject4 = this.animator.createAnimatedObject(Shapes.spikes(10, 40));
	this.testObject4.setPosition(new Vec2(0,10));
	//this.testObject4.setVelocity(new Vec2(-0.11, 0));
	//this.testObject4.setAngularVelocity(0);
	this.testObject4.setOrientation(Tool.degToRad(180));*/

	/*this.testObject4 = this.animator.createAnimatedObject(Shapes.hollowBox(20));
	this.testObject4.setIsAffectedByGravity(false);
	//this.testObject4.setDensity(1e10);
	this.testObject4.setPosition(new Vec2(0,0));
	this.testObject4.setIsStatic(true);*/
	//this.testObject4.setVelocity(new Vec2(10, 0));
	//this.testObject4.setAngularVelocity(Tool.degToRad(0.002));
	//this.testObject4.setOrientation(Tool.degToRad(-3*0));
	//this.testConstraint1 = this.animator.createFixedConstraint(this.testObject4, new Vec2(20,1));
	//this.testConstraint1.setVelocity(new Vec2(0,0));
	//this.testConstraint2 = this.animator.createFixedConstraint(this.testObject4, new Vec2(-20,1));
	//this.testConstraint2.setVelocity(new Vec2(0,0));
	
	/*this.rope0 = this.animator.createRope(this.testObject, this.testObject4, new Vec2(-5,0), new Vec2(-5, 18));
	this.rope1 = this.animator.createRope(this.testObject4, this.testObject4, new Vec2(-5, 18), new Vec2(5, 17));
	this.rope2 = this.animator.createRope(this.testObject2, this.testObject4, new Vec2(5,0), new Vec2(5, 17));

	this.pulley0 = this.animator.createPulley(this.rope0, this.rope1, false, true);
	this.pulley1 = this.animator.createPulley(this.rope1, this.rope2, false, false);*/

	/*this.testObject5 = this.animator.createAnimatedObject(Shapes.square());
	this.testObject5.setPosition(new Vec2(0,-17));
	this.testObject5.setIsAffectedByGravity(false);
	this.testObject5.setIsStatic(true);
	this.testObject5.setVelocity(new Vec2(0.01, 0));
	//this.testObject5.setAngularVelocity(0.1 * this.rdn - 0.2);
	//this.testObject5.setOrientation(Tool.degToRad(-45.1));
	//this.testObject5.setDensity(2);
	this.testObject5.setColor(new Vec3(0,0.5,0.5));*/

	this.testObject6 = this.animator.createAnimatedObject(Shapes.rectangle(1000,10));
	this.testObject6.setIsAffectedByGravity(false);
	this.testObject6.setPosition(new Vec2(0,-25));
	this.testObject6.setIsStatic(true);
	this.testObject6.setVelocity(new Vec2(0, 0));
	this.testObject6.setColor(new Vec3(0.10196078431, 0.6, 0.01960784313));

	/*for (let i = 0; i < 200; i++) {
		var t = this.animator.createAnimatedObject(Shapes.square());
		t.setPosition(new Vec2(this.r(400), this.r(400)));
		t.setVelocity(new Vec2(this.r(0.1), this.r(0.1)));
		t.setAngularVelocity(this.r(0.1));
	}
	for (let i = 0; i < 10000*rand; i++) {
		this.getnextRandom();
	}
	for (let i = 0; i < this.animator.animatedObjects.length; i++) {
		const go = this.animator.animatedObjects[i];
		go.setVelocity(new Vec2(this.r(0.1), this.r(0.1)));
	}*/

	this.animator.cameraVelocity = new Vec2(0,0);

	for (let i = 0; i < 33*0; i++) {
		var t = this.animator.createAnimatedObject(Shapes.man(1.7));
		t.setPosition(new Vec2((i%5)*3, 5 -3 * Math.floor(i/5)));
		t.setIsAffectedByGravity(true);
		t.setVelocity(new Vec2(0,0));
		t.setColor(Tool.getRandomColor());
	}

	this.setLoop();

	this.previousTime = new Date().getTime();
	this.time = this.previousTime;
	this.realFPS = 0;
	this.lowestFPS = Infinity;

	this.physicsFraction = 1;

	this.isPause = false;

	this.userInterfaceHandler.saveStateToUndoHistory();

	this.d0 = 0;
	this.d1 = 0;
	this.d2 = 0;
	this.d3 = 0;
	this.d4 = 0;
	this.d5 = 0;
	this.d6 = 0;
	this.d7 = 0;
	this.d8 = 0;
	this.d9 = 0;
}
PhysicsSimulator.prototype.mainLoop = function (){
	if(!this.animator.isReady()){
		return;
	}
	
	this.debug();
	
	// Run user Input.
	this.userInterfaceHandler.run(); // TODO: Swap with physics.
	
	// Run physics.
	if((this.tick % this.physicsFraction) == 0){
		this.animator.runPhysics();
	}

	// Run graphics
	this.animator.runGraphics();

	this.tick++;
}
PhysicsSimulator.prototype.saveAsObjectSaveData = function () {
	return this.animator.saveAsObjectSaveData();
}
PhysicsSimulator.prototype.loadObjectSaveData = function (saveData) {
	this.animator.loadObjectSaveData(saveData);
	// Reset interface handeler.
	this.userInterfaceHandler.clearActiveTools();
}
PhysicsSimulator.prototype.save = function () {
	var s = this.animator.save();
	
	return s;
}
PhysicsSimulator.prototype.load = function (s) {
	this.animator.load(s);
	// Reset interface handeler.
	this.userInterfaceHandler.clearActiveTools();
}
PhysicsSimulator.prototype.getScreenshot = function (width = 320, height = 200) {
	// Store old settings.
	var originalWidth = this.animator.canvas.width;
	var originalHeight = this.animator.canvas.height;
	
	// Change settings.
	this.animator.canvas.width = width;
	this.animator.canvas.height = height;
	
	this.animator.renderContext.resizeToCanvas();
	this.animator.camera.viewPortWidth = this.animator.canvas.width;
	this.animator.camera.viewPortHeight = this.animator.canvas.height;
	this.animator.camera.calculateProjection();
	
	// Take screenshot.
	this.animator.runGraphics(null, false);

	var s = this.animator.canvas.toDataURL();

	// Revert old settings.
	this.animator.canvas.width = originalWidth;
	this.animator.canvas.height = originalHeight;
	
	this.animator.renderContext.resizeToCanvas();
	this.animator.camera.viewPortWidth = this.animator.canvas.width;
	this.animator.camera.viewPortHeight = this.animator.canvas.height;
	this.animator.camera.calculateProjection();

	//
	return s;
}
PhysicsSimulator.prototype.setPause = function (newPause) {
	// Convert to boolean.
	if (newPause){
		newPause = true;
	}else{
		newPause = false;
	}
	//
	this.animator.setPause(newPause);
}
PhysicsSimulator.prototype.getPause = function () {
	return this.animator.getPause();
}
PhysicsSimulator.prototype.setPausePhysics = function (newPausePhysics) {
	// Convert to boolean.
	if (newPausePhysics){
		newPausePhysics = true;
	}else{
		newPausePhysics = false;
	}
	//
	this.animator.setPausePhysics(newPausePhysics);
}
PhysicsSimulator.prototype.getPausePhysics = function () {
	return this.animator.getPausePhysics();
}
PhysicsSimulator.prototype.setLoop = function (newFps = this.fps){
	clearInterval(this.loop);
	this.fps = newFps;
	this.loop = setInterval(this.mainLoop.bind(this),1000/this.fps);
}
PhysicsSimulator.prototype.r = function (f = 1) {
	return f * (this.getnextRandom() * 2 - 1);
}
PhysicsSimulator.prototype.getnextRandom = function () {
	return this.random.getNext();
}
PhysicsSimulator.prototype.debug = function () {
	if(
		this.animator.phx.tick == 0
		//this.tick == 120
	){
		//location.reload();
		//this.physicsFraction = 30;
		//physicsSimulator.animator.animatedObjects[1].setVelocity(new Vec2(0,0));
	}
	/*if(
		physicsSimulator.animator.animatedObjects[0].getVelocity().x < 0 &&
		this.animator.phx.tick > 60
	){
		//this.physicsFraction = 300;
		//debugger;
	}*/
	
	//console.log(physicsSimulator.animator.animatedObjects[0].getOrientation());

	// Calculate translational momentum.
	var momentum = new Vec2();
	for (let i = 0; i < physicsSimulator.animator.animatedObjects.length; i++) {
		const g = physicsSimulator.animator.animatedObjects[i];
		momentum.add(g.getVelocity().mul(g.getMass()));
	}
	//console.log(momentum);
	if(!momentum.hasZeroMag()){
		//debugger;
	}
	if(this.animator.phx.tick == 282){
		//debugger;
	}

	//
	if(this.tick % this.physicsFraction == 0){
		this.animator.clearDebug();
	}
	var energy = 0;
	for (let i = 1; i < this.animator.animatedObjects.length; i++) {
		const g = this.animator.animatedObjects[i];
		energy += g.getAngularVelocity()*g.getAngularVelocity() * g.getMomentOfInertia() * 0.5;
		energy += g.getVelocity().magSqr() * g.getMass()*0.5;
		energy += g.getPosition().y*g.getMass()*0.01;
	}
	//console.log("energy: " + energy);
	var interval = 30;
	if(window.averageEnergy == null){
		window.averageEnergy = 0;
	}
	window.averageEnergy = (window.averageEnergy * (interval-1) + energy) / interval;
	if(this.tick % interval == 0){
		//console.log("energy: " + window.averageEnergy);
	}
	// FPS
	var now = new Date().getTime();
	var fps = 1 / (now-this.previousTime) * 1000;
	this.realFPS = (this.realFPS * (120-1) + fps) / 120;
	if(this.lowestFPS > fps){
		this.lowestFPS = fps;
	}
	if(this.tick % 60 == 0){
		//console.log("FPS: " + this.realFPS + "\nMin FPS: " + this.lowestFPS);
		this.lowestFPS = Infinity;
	}
	this.previousTime = now;
}
/*PhysicsSimulator.prototype.infect = function (pA, pB) {
	if(pA.infectionList != null && pA.infectionList == pB.infectionList){
		return;
	}

	var newList = [];

	if(pA.infectionList == null){
		newList.push(pA);
	}else{
		for (let i = 0; i < pA.infectionList.length; i++) {
			const p = pA.infectionList[i];
			newList.push(p);
		}
	}

	if(pB.infectionList == null){
		newList.push(pB);
	}else{
		for (let i = 0; i < pB.infectionList.length; i++) {
			const p = pB.infectionList[i];
			newList.push(p);
		}
	}

	for (let i = 0; i < newList.length; i++) {
		const p = newList[i];
		p.infectionList = newList;
	}
}*/

// Modes.
PhysicsSimulator.prototype.initEnums = function () {

	PhysicsSimulator.DEFAULT = UserInterfaceHandler.DEFAULT;
	PhysicsSimulator.MOVE_TOOL = UserInterfaceHandler.MOVE_TOOL;
	PhysicsSimulator.BOX_SPAWNER = UserInterfaceHandler.BOX_SPAWNER;
	PhysicsSimulator.CUSTOM_SHAPE_SPAWNER = UserInterfaceHandler.CUSTOM_SHAPE_SPAWNER;
	PhysicsSimulator.POLYGON_DRAW = UserInterfaceHandler.POLYGON_DRAW;
	PhysicsSimulator.READ_PROPERTIES = UserInterfaceHandler.READ_PROPERTIES;
	PhysicsSimulator.HINGES = UserInterfaceHandler.HINGES;
	PhysicsSimulator.FIXED_CONSTRAINT = UserInterfaceHandler.FIXED_CONSTRAINT;
	PhysicsSimulator.ROPES = UserInterfaceHandler.ROPES;
	PhysicsSimulator.PULLEYS = UserInterfaceHandler.PULLEYS;
	PhysicsSimulator.DELETE_POLYGONS = UserInterfaceHandler.DELETE_POLYGONS;
	PhysicsSimulator.SELECT_TOOLS = UserInterfaceHandler.SELECT_TOOLS;
	PhysicsSimulator.TOGGLE_STATIC = UserInterfaceHandler.TOGGLE_STATIC;
	PhysicsSimulator.SHOW_FORCES = UserInterfaceHandler.SHOW_FORCES;

	// Polygon draw settings.
	PhysicsSimulator.POLYGON_DRAW_STATIC = UserInterfaceHandler.POLYGON_DRAW_STATIC;
	PhysicsSimulator.POLYGON_DRAW_DYNAMIC = UserInterfaceHandler.POLYGON_DRAW_DYNAMIC;
	// Shapes.
	PhysicsSimulator.SQUARE = UserInterfaceHandler.SQUARE;
	PhysicsSimulator.DISC = UserInterfaceHandler.DISC;
	PhysicsSimulator.GEAR = UserInterfaceHandler.GEAR;
	// Custom object settings.
	PhysicsSimulator.DEFAULT_PLACEMENT = UserInterfaceHandler.DEFAULT_PLACEMENT;
	PhysicsSimulator.FIX_TO_BACKGROUND = UserInterfaceHandler.FIX_TO_BACKGROUND;
	PhysicsSimulator.HINGE_TO_POLYGON = UserInterfaceHandler.HINGE_TO_POLYGON;
	// Snap modes.
	PhysicsSimulator.SNAP_DEFAULT = UserInterfaceHandler.SNAP_DEFAULT;
	PhysicsSimulator.SNAP_TO_CARTESIAN = UserInterfaceHandler.SNAP_TO_CARTESIAN;
	PhysicsSimulator.SNAP_TO_POLAR = UserInterfaceHandler.SNAP_TO_POLAR;

}

PhysicsSimulator.prototype.setMode = function (mode) {
	if(mode == null){
		throw "ERROR: Mode is undefined.";
	}
	this.userInterfaceHandler.setMode(mode);
}
PhysicsSimulator.prototype.setModeDefault = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.DEFAULT);
}
PhysicsSimulator.prototype.setModeMoveTool = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.MOVE_TOOL);
}
PhysicsSimulator.prototype.setModeBoxSpawn = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.BOX_SPAWNER);
}
PhysicsSimulator.prototype.setModeCustomShapeSpawner = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.CUSTOM_SHAPE_SPAWNER);
}
PhysicsSimulator.prototype.getCustomShape = function () {
	return this.userInterfaceHandler.getCustomShape();
}
PhysicsSimulator.prototype.setCustomShape = function (shape) {
	this.userInterfaceHandler.setCustomShape(shape);
}
PhysicsSimulator.prototype.setModePolygonDraw = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.POLYGON_DRAW);
}
PhysicsSimulator.prototype.setModeReadPolygonProperties = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.READ_PROPERTIES);
}
PhysicsSimulator.prototype.setModeCreateFixedConstraint = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.FIXED_CONSTRAINT);
}
PhysicsSimulator.prototype.setModeCreateHinges = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.HINGES);
}
PhysicsSimulator.prototype.setModeCreateRopes = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.ROPES);
}
PhysicsSimulator.prototype.setModeCreatePulleys = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.PULLEYS);
}
PhysicsSimulator.prototype.setModeDeletePolygons = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.DELETE_POLYGONS);
}
PhysicsSimulator.prototype.setModeSelectTools = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.SELECT_TOOLS);
}
PhysicsSimulator.prototype.setModeToggleStatic = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.TOGGLE_STATIC);
}
PhysicsSimulator.prototype.setModeShowForces = function () {
	this.userInterfaceHandler.setMode(UserInterfaceHandler.SHOW_FORCES);
}
// Callbacks.
PhysicsSimulator.prototype.addReadPropertiesCallback = function (callback) {
	if (typeof callback != "function") {
		throw "ERROR: First agrument is not a function."
	}
	this.userInterfaceHandler.addReadPropertiesCallback(callback);
}
PhysicsSimulator.prototype.addReadRopesCallback = function (callback) {
	if (typeof callback != "function") {
		throw "ERROR: First agrument is not a function."
	}
	this.userInterfaceHandler.addReadRopesCallback(callback);
}
PhysicsSimulator.prototype.addReadHingesCallback = function (callback) {
	if (typeof callback != "function") {
		throw "ERROR: First agrument is not a function."
	}
	this.userInterfaceHandler.addReadHingesCallback(callback);
}
PhysicsSimulator.prototype.addReadFixedCallback = function (callback) {
	if (typeof callback != "function") {
		throw "ERROR: First agrument is not a function."
	}
	this.userInterfaceHandler.addReadFixedCallback(callback);
}
PhysicsSimulator.prototype.addReadPulleysCallback = function (callback) {
	if (typeof callback != "function") {
		throw "ERROR: First agrument is not a function."
	}
	this.userInterfaceHandler.addReadPulleysCallback(callback);
}
PhysicsSimulator.prototype.addPolygonDrawDataCallback = function (callback) {
	if (typeof callback != "function") {
		throw "ERROR: First agrument is not a function."
	}
	this.userInterfaceHandler.addPolygonDrawDataCallback(callback);
}

// Set properties.
PhysicsSimulator.prototype.setPolygonProperties = function (properties) {
	return this.userInterfaceHandler.setProperties(properties);
}
PhysicsSimulator.prototype.setRopeProperties = function (properties) {
	return this.userInterfaceHandler.setRopeProperties(properties);
}
PhysicsSimulator.prototype.setHingeProperties = function (properties) {
	return this.userInterfaceHandler.setHingeProperties(properties);
}
PhysicsSimulator.prototype.setFixedProperties = function (properties) {
	return this.userInterfaceHandler.setFixedProperties(properties);
}
PhysicsSimulator.prototype.setPulleyProperties = function (properties) {
	return this.userInterfaceHandler.setPulleyProperties(properties);
}
// Polygon draw settings.
PhysicsSimulator.prototype.setPolygonDrawMode = function (mode) {
	if (mode == null) {
		throw "ERROR: mode is not recognized.";
	}
	
	this.userInterfaceHandler.setPolygonDrawMode(mode);
}
PhysicsSimulator.prototype.getPolygonDrawMode = function (mode) {
	return this.userInterfaceHandler.getPolygonDrawMode();
}
PhysicsSimulator.prototype.setPolygonDrawStaticMode = function (mode) {
	if (mode == null) {
		throw "ERROR: mode is not recognized.";
	}
	console.warn("The function setPolygonDrawStaticMode is deprecated. Use setPolygonDrawMode instead().");
	
	this.userInterfaceHandler.setPolygonDrawMode(mode);
}
//
PhysicsSimulator.prototype.setDiscSize = function (newDiscSize) {
	if (typeof newDiscSize != "number" || isNaN(newDiscSize)) {
		throw "ERROR: newDiscSize is not a number."
	}
	if (newDiscSize <= 0) {
		throw "ERROR: newDiscSize can not be 0 or less.";
	}
	this.userInterfaceHandler.setDiscSize(newDiscSize);
}
PhysicsSimulator.prototype.getDiscSize = function () {
	return this.userInterfaceHandler.getDiscSize();
}
PhysicsSimulator.prototype.setDiscResolution = function (newDiscResolution) {
	if (typeof newDiscResolution != "number" || isNaN(newDiscResolution)) {
		throw "ERROR: newDiscResolution is not a number."
	}
	if (newDiscResolution < 3) {
		throw "ERROR: newDiscResolution is too small. It must be 3 or larger."
	}
	if (newDiscResolution > 200) {
		throw "ERROR: newDiscResolution is too large. It must be 200 or less."
	}
	this.userInterfaceHandler.setDiscResolution(newDiscResolution);
}
PhysicsSimulator.prototype.getDiscResolution = function () {
	return this.userInterfaceHandler.getDiscResolution();
}
PhysicsSimulator.prototype.setSquareSize = function (newSquareSize) {
	if (typeof newSquareSize != "number" || isNaN(newSquareSize)) {
		throw "ERROR: newSquareSize is not a number."
	}
	if (newSquareSize <= 0) {
		throw "ERROR: newSquareSize can not be 0 or less.";
	}
	this.userInterfaceHandler.setSquareSize(newSquareSize);
}
PhysicsSimulator.prototype.getSquareSize = function () {
	return this.userInterfaceHandler.getSquareSize();
}
PhysicsSimulator.prototype.setGearSize = function (newGearSize) {
	if (typeof newGearSize != "number" || isNaN(newGearSize)) {
		throw "ERROR: newGearSize is not a number."
	}
	if (newGearSize <= 0) {
		throw "ERROR: newGearSize can not be 0 or less.";
	}
	this.userInterfaceHandler.setGearSize(newGearSize);
}
PhysicsSimulator.prototype.getGearSize = function () {
	return this.userInterfaceHandler.getGearSize();
}
PhysicsSimulator.prototype.setGearResolution = function (newGearResolution) {
	if (typeof newGearResolution != "number" || isNaN(newGearResolution)) {
		throw "ERROR: newGearResolution is not a number."
	}
	if (newGearResolution < 2) {
		throw "ERROR: newGearResolution is too small. It must be 2 or larger."
	}
	if (newGearResolution > 100) {
		throw "ERROR: newGearResolution is too large. It must be 100 or less."
	}
	this.userInterfaceHandler.setGearResolution(newGearResolution);
}
PhysicsSimulator.prototype.getGearResolution = function () {
	return this.userInterfaceHandler.gearResolution;
}
PhysicsSimulator.prototype.setGearPlacementMode = function (mode) {
	if (mode == null) {
		throw "ERROR: Mode is not recognized."
	}
	this.userInterfaceHandler.setPlacementMode(mode);
	console.warn("WARNING: setGearPlacementMode() is depricated. Use setPlacementMode() instead.");
}
PhysicsSimulator.prototype.setPlacementMode = function (mode) {
	if (mode == null) {
		throw "ERROR: Mode is not recognized."
	}
	this.userInterfaceHandler.setPlacementMode(mode);
}
PhysicsSimulator.prototype.getPlacementMode = function () {
	return this.userInterfaceHandler.getPlacementMode();
}
PhysicsSimulator.prototype.setSnapMode = function (mode) {
	this.userInterfaceHandler.setSnapMode(mode);
}
PhysicsSimulator.prototype.getSnapMode = function () {
	return this.userInterfaceHandler.getSnapMode();
}
PhysicsSimulator.prototype.remove = function () {
	clearInterval(this.loop);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.physics_simulator', true);