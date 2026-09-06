
// States:
UserInterfaceHandler.CLEAR = "CLEAR";
UserInterfaceHandler.DEFAULT = "DEFAULT";
UserInterfaceHandler.MOVE_TOOL = "MOVE_TOOL";
UserInterfaceHandler.BOX_SPAWNER = "BOX_SPAWNER";
UserInterfaceHandler.CUSTOM_SHAPE_SPAWNER = "CUSTOM_SHAPE_SPAWNER";
UserInterfaceHandler.POLYGON_DRAW = "POLYGON_DRAW";
UserInterfaceHandler.HINGES = "HINGES";
UserInterfaceHandler.FIXED_CONSTRAINT = "FIXED_CONSTRAINT";
UserInterfaceHandler.READ_PROPERTIES = "READ_PROPERTIES";
UserInterfaceHandler.ROPES = "ROPES";
UserInterfaceHandler.PULLEYS = "PULLEYS";
UserInterfaceHandler.DELETE_POLYGONS = "DELETE_POLYGONS";
UserInterfaceHandler.SELECT_TOOLS = "SELECT_TOOLS";
UserInterfaceHandler.TOGGLE_STATIC = "TOGGLE_STATIC";
UserInterfaceHandler.SHOW_FORCES = "SHOW_FORCES";

UserInterfaceHandler.SNAP_DEFAULT = "SNAP_DEFAULT";
UserInterfaceHandler.SNAP_TO_CARTESIAN = "SNAP_TO_CARTESIAN";
UserInterfaceHandler.SNAP_TO_POLAR = "SNAP_TO_POLAR";

// Polygon draw settings.
UserInterfaceHandler.POLYGON_DRAW_STATIC = "POLYGON_DRAW_STATIC";
UserInterfaceHandler.POLYGON_DRAW_DYNAMIC = "POLYGON_DRAW_DYNAMIC";

// Custom shapes.
UserInterfaceHandler.SQUARE = "SQUARE";
UserInterfaceHandler.DISC = "DISC";
UserInterfaceHandler.GEAR = "GEAR";

// Custom object settings.
UserInterfaceHandler.DEFAULT_PLACEMENT = "DEFAULT_PLACEMENT";
UserInterfaceHandler.FIX_TO_BACKGROUND = "FIX_TO_BACKGROUND";
UserInterfaceHandler.HINGE_TO_POLYGON = "HINGE_TO_POLYGON";

function UserInterfaceHandler(canvas, animator, physicsSimulator) {

	var keyboardListener = document.createElement("input")
	keyboardListener.setAttribute("type", "text");
	canvas.addEventListener('mouseover', function(){
		keyboardListener.focus();
	});
	canvas.appendChild(keyboardListener);

	this.mouseControl = new MouseControl(canvas);
	this.keyBoardControl = new KeyboardControl(keyboardListener);

	this.animator = animator; // Reference to the animator from main.
	this.physicsSimulator = physicsSimulator;

	this.state = UserInterfaceHandler.DEFAULT;

	// Undo redo history.
	this.maxHistory = 5;
	this.historyIndex = -1; // Points at the last saved state.
	this.undoHistory = [];

	// Default.
	this.selectedAnimatedObject; // Selected animated object for drag and drop.
	this.selectedLocalGrabPosition; // Where on the object was it grabbed in local coordinates?
	this.selectedDragLine = this.animator.createMesh();
	this.selectedDragLine.drawMode = Mesh.OUTLINE;
	this.selectedDragLine.isVisible = false;
	this.selectedDragLine.depth = -0.2;
	this.selectedDragLine.loadOutline([Tool.listToVec2([
		0, 0,
		1, 1,
	])]);

	// Move tool.
	this.moveToolSelected;
	this.moveToolLocalGrabPosition;
	this.moveToolTargetAngle;
	this.moveToolRoundedTargetAngle;
	this.moveToolMinAngle = Tool.degToRad(5);

	// Polygon drawing.
	this.geometry;
	this.polygonOutline = this.animator.createMesh();
	this.polygonOutline.drawMode = Mesh.OUTLINE;
	this.polygonDrawMode = UserInterfaceHandler.POLYGON_DRAW_DYNAMIC;
	this.polygonSnapMode = UserInterfaceHandler.SNAP_DEFAULT;
	this.polygonMinimumSnapAngle = Tool.degToRad(1);
	this.polygonMinimumSnapRadius = 1;
	this.polygonMinimumSnapGridDistance = 1;
	this.polygonDrawPrevData;

	// Hinges.
	this.hingeOutline = this.animator.createMesh();
	this.hingeOutline.drawMode = Mesh.OUTLINE;
	this.hingeOutline.loadOutline(Shapes.disc(0.5, 5));
	this.hingeOutline.color = new Vec3(0, 0, 1);
	this.hingeOutline.isVisible = false;
	this.hingeOutline.depth = -0.1;
	this.hingeSelectedAnimatedObject;
	this.hingeSelectedLocalGrabPosition;

	// Ropes.
	this.ropeOutline = this.animator.createMesh();
	this.ropeOutline.color = new Vec3(0.3, 0.4, 0.5);
	this.ropeOutline.isVisible = false;
	this.ropeOutline.depth = -0.1;
	this.ropeSelectedAnimatedObject;
	this.ropeSelectedLocalStartPosition;

	// Pulleys.
	this.pulleySelectMesh = this.animator.createMesh();
	this.pulleySelectMesh.color = new Vec3(0, 1, 0);
	this.pulleySelectMesh.isVisible = false;
	this.pulleySelectMesh.depth = -0.1;
	this.pulleySelectedRope;
	this.pulleySelectedRopeUseFirstEnd;

	// Custom shapes.
	// Disc.
	this.discSize = 1;
	this.discResolution = 6;
	// Square.
	this.squareSize = 1;
	// Gear.
	this.gearSize = 1;
	this.gearResolution = 10;
	this.placementMode = UserInterfaceHandler.DEFAULT_PLACEMENT;
	//
	this.customShape = UserInterfaceHandler.SQUARE;
	this.customShapeVertices;
	this.setCustomShape(this.customShape); // Update this.customShapeVertices.
	this.customShapeOutline = this.animator.createMesh();
	this.customShapeOutline.color = new Vec3(1, 1, 1);
	this.customShapeOutline.depth = -0.1;
	this.customShapeOutline.isVisible = false;

	// Select tools.
	this.selectionMesh = this.animator.createMesh();
	this.selectionMesh.color = new Vec3(0, 1, 1);
	this.selectionMesh.isVisible = false;
	this.selectionMesh.depth = -0.1;

	// Show forces.
	this.showForcesScaleFactor = 10;
	this.showForcesArrowHeads = [];
	this.showForcesArrowBodies = [];
	var maxArrows = 300;
	for (let i = 0; i < maxArrows; i++) {
		var newArrowHead = this.animator.createMesh();
		newArrowHead.color = new Vec3(1, 0, 0);
		newArrowHead.isVisible = false;
		newArrowHead.depth = -0.2;
		newArrowHead.loadOutlineToTriangles([Tool.listToVec2([
			0, -1,
			1, 0,
			0, 1,
		])]);

		this.showForcesArrowHeads.push(newArrowHead);
	}
	for (let i = 0; i < maxArrows; i++) {
		var newArrowBody = this.animator.createMesh();
		newArrowBody.color = new Vec3(1, 0, 0);
		newArrowBody.isVisible = false;
		newArrowBody.depth = -0.2;
		newArrowBody.loadOutlineToTriangles([Tool.listToVec2([
			0, -1,
			1, -1,
			1, 1,
			0, 1,
		])]);

		this.showForcesArrowBodies.push(newArrowBody);
	}
	this.showForcesObject;

	// Callbacks.
	this.readPropertiesCallbacks = [];
	this.readRopesCallbacks = [];
	this.readHingesCallbacks = [];
	this.readFixedCallbacks = [];
	this.readPulleysCallbacks = [];
	this.polygonDrawDataCallbacks = [];
}
UserInterfaceHandler.prototype.run = function () {
	// Select object.
	this.handleCameraControls();
	this.handleUndoRedo();
	switch (this.state) {
		case UserInterfaceHandler.CLEAR:
			this.handleUndoRedo();
			break;
		case UserInterfaceHandler.DEFAULT:
			this.handleDefault();
			break;
		case UserInterfaceHandler.MOVE_TOOL:
			this.handleMoveTool();
			break;
		case UserInterfaceHandler.BOX_SPAWNER:
			this.handleBoxSpawner();
			break;
		case UserInterfaceHandler.CUSTOM_SHAPE_SPAWNER:
			this.handleCustomShapeSpawner();
			break;
		case UserInterfaceHandler.POLYGON_DRAW:
			this.handlePolygonDrawing();
			break;
		case UserInterfaceHandler.READ_PROPERTIES:
			this.handleReadProperties();
			break;
		case UserInterfaceHandler.HINGES:
			this.handleHinges();
			break;
		case UserInterfaceHandler.FIXED_CONSTRAINT:
			this.handleFixedConstraints();
			break;
		case UserInterfaceHandler.ROPES:
			this.handleRopes();
			break;
		case UserInterfaceHandler.PULLEYS:
			this.handlePulleys();
			break;
		case UserInterfaceHandler.DELETE_POLYGONS:
			this.handleDeletePolygons();
			break;
		case UserInterfaceHandler.SELECT_TOOLS:
			this.handleSelectTools();
			break;
		case UserInterfaceHandler.TOGGLE_STATIC:
			this.handleToggleStatic();
			break;
		case UserInterfaceHandler.SHOW_FORCES:
			this.handleShowForces();
			break;
		default:
			Tool.printError("ERROR::UserInterfaceHandler.updateUser: InterfaceHandler.status not recogniced.");
	}

	// Update controls.
	this.mouseControl.update();
	this.keyBoardControl.update();
}
// Handle modes.
UserInterfaceHandler.prototype.handleCameraControls = function () {

	var camera = this.animator.camera;
	var camPos = this.animator.camera.position;
	var up = this.animator.camera.up;
	var right = Vec2.rotate90Clockwise(up);

	// Zoom.
	var zoomSensitivity = 0.03;

	var zoomLevel;
	if (this.keyBoardControl.numPlus.isDown || this.keyBoardControl.comma.isDown) {
		zoomLevel = camera.width * (1 - zoomSensitivity);
	}
	if (this.keyBoardControl.numMinus.isDown || this.keyBoardControl.period.isDown) {
		zoomLevel = camera.width * (1 + zoomSensitivity);
	}
	if (zoomLevel == null) {
		zoomLevel = camera.width;
	}
	camera.width = zoomLevel;

	// Translation.
	var translationSensitivity = 0.02 * zoomLevel;

	if (this.keyBoardControl.up.isDown || this.keyBoardControl.w.isDown) {
		camPos.add(Vec2.mul(up, translationSensitivity));
	}
	if (this.keyBoardControl.down.isDown || this.keyBoardControl.s.isDown) {
		camPos.add(Vec2.mul(up, -translationSensitivity));
	}
	if (this.keyBoardControl.right.isDown || this.keyBoardControl.d.isDown) {
		camPos.add(Vec2.mul(right, translationSensitivity));
	}
	if (this.keyBoardControl.left.isDown || this.keyBoardControl.a.isDown) {
		camPos.add(Vec2.mul(right, -translationSensitivity));
	}

	// Rotation.
	var rotationSensitivity = 0.05;
	if (this.keyBoardControl.q.isDown) {
		camera.up.rotate(rotationSensitivity);
	}
	if (this.keyBoardControl.e.isDown) {
		camera.up.rotate(-rotationSensitivity);
	}
	if (this.keyBoardControl.r.isDown) {
		camera.setUp(new Vec2(0, 1));
	}

	//
	camera.calculateView();
	camera.calculateProjection();
}
UserInterfaceHandler.prototype.saveStateToUndoHistory = function () {
	// Remove redo history.
	if (this.historyIndex < this.undoHistory.length - 1) {
		this.undoHistory.splice(this.historyIndex + 1);
	}
	//
	this.undoHistory.push(this.physicsSimulator.saveAsObjectSaveData());
	this.historyIndex++;
	//
	if (this.undoHistory.length > this.maxHistory) {
		this.undoHistory.shift();
		this.historyIndex--;
	}
}
UserInterfaceHandler.prototype.handleUndoRedo = function () {

	if (
		this.keyBoardControl.ctrl.isDown &&
		!this.keyBoardControl.shift.isDown &&
		this.keyBoardControl.z.isPushed()
	) { // Undo.
		if (this.historyIndex >= 1) {
			this.historyIndex--;
			this.physicsSimulator.loadObjectSaveData(this.undoHistory[this.historyIndex]);
		}
	} else if (
		this.keyBoardControl.ctrl.isDown &&
		this.keyBoardControl.shift.isDown &&
		this.keyBoardControl.z.isPushed() ||
		this.keyBoardControl.ctrl.isDown &&
		this.keyBoardControl.y.isPushed()
	) { // Redo.
		if (this.historyIndex < this.undoHistory.length - 1) {
			this.historyIndex++;
			this.physicsSimulator.loadObjectSaveData(this.undoHistory[this.historyIndex]);
		}
	}
}
UserInterfaceHandler.prototype.handleDefault = function () {
	if (this.mouseControl.left.clicked()) {
		if (this.selectedAnimatedObject != null) {
			// -Cancel if click-
			this.selectedAnimatedObject = null;
			this.selectedLocalGrabPosition = null;
			this.saveStateToUndoHistory();
		} else {
			// -Look for objects to select-
			for (var i = 0; i < this.animator.animatedObjects.length; i++) {
				var g = this.animator.animatedObjects[i];
				var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
				if (g.positionDetect(worldClickPosition)) {
					this.selectedAnimatedObject = g;
					this.selectedLocalGrabPosition = g.worldToLocalCoordinates(worldClickPosition);
					//this.state = UserInterfaceHandler.ANIMATED_OBJECT_SELECTED;
					break;
				}
			}
		}
	}
	if (this.selectedAnimatedObject != null) {
		// -Apply impulse to animated object-
		var globalMousePosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
		var globalGrabPosition = this.selectedAnimatedObject.localToWorldCoordinates(this.selectedLocalGrabPosition);

		var impulse = Vec2.sub(globalMousePosition, globalGrabPosition);
		// DEBUG START
		window.debugRender.addCross(globalGrabPosition, 0.2, new Vec3(0, 0, 1));
		// DEBUG END
		impulse.add(
			this.selectedAnimatedObject.getVelocityAtPosition(globalGrabPosition).mul(-4)
		);

		impulse.mul(0.01 * this.selectedAnimatedObject.getMass());

		this.selectedAnimatedObject.applyImpulse(globalGrabPosition, impulse);

	}
	// Animate.
	if (this.selectedAnimatedObject == null) {
		this.selectedDragLine.isVisible = false;
	} else {
		this.selectedDragLine.isVisible = true;
		this.selectedDragLine.position = globalGrabPosition.clone();
		var difference = Vec2.sub(globalMousePosition, globalGrabPosition);
		this.selectedDragLine.scale = difference.clone();
	}
}
UserInterfaceHandler.prototype.handleMoveTool = function () {


	// Cancel if click when object is selected.
	if (this.moveToolSelected != null && this.mouseControl.left.clicked()) {

		this.moveToolSelected = null;
		this.moveToolLocalGrabPosition = null;
		this.moveToolTargetAngle = null;
		this.moveToolRoundedTargetAngle = null;
		this.saveStateToUndoHistory();
		return;
	}

	// -Look for objects to select-
	if (this.mouseControl.left.clicked()) {
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var g = this.animator.animatedObjects[i];
			var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
			if (g.positionDetect(worldClickPosition)) {
				this.moveToolSelected = g;
				this.moveToolLocalGrabPosition = g.worldToLocalCoordinates(worldClickPosition);
				this.moveToolTargetAngle = g.getOrientation();
				this.moveToolRoundedTargetAngle = Math.round(this.moveToolTargetAngle / this.moveToolMinAngle) * this.moveToolMinAngle;
				break;
			}
		}
	}

	if (this.moveToolSelected != null) {

		// Rotation input.
		if (Math.abs(this.mouseControl.deltaY) > 0) {
			this.moveToolTargetAngle -= this.mouseControl.deltaY * 0.003;
		}
		this.moveToolRoundedTargetAngle = Math.round(this.moveToolTargetAngle / this.moveToolMinAngle) * this.moveToolMinAngle;

		// Translation input.
		var globalMousePosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
		var globalGrabPosition = this.moveToolSelected.localToWorldCoordinates(this.moveToolLocalGrabPosition);

		if (this.physicsSimulator.getPausePhysics()) {
			// --Pause mode--
			// Translation.
			var speed = 0.1;
			var difference = Vec2.sub(globalMousePosition, globalGrabPosition);
			if (difference.mag() > speed) {
				difference.resize(Math.sqrt(difference.mag() / speed) * speed);
			}
			this.moveToolSelected.setPosition(
				this.moveToolSelected.getPosition().add(
					difference
				)
			);

			// Rotation.
			var speed = 0.1;
			var difference = this.moveToolRoundedTargetAngle - this.moveToolSelected.getOrientation();
			if (difference > speed) {
				if (difference > 0) {
					difference = Math.sqrt(difference / speed) * speed;
				} else {
					difference = -Math.sqrt(-difference / speed) * speed;
				}
			}
			this.moveToolSelected.setOrientation(
				this.moveToolSelected.getOrientation() + difference
			);


		} else {
			// --Play mode--

			// -Apply impulse to animated object-

			// Translation.
			var maxAcceleration = 0.1;

			var myVel = this.moveToolSelected.getVelocity();

			var difference = Vec2.sub(globalMousePosition, globalGrabPosition);
			var nextDifference = Vec2.sub(difference, myVel); // Compensates for numerical integration error.

			var idealVelocity;
			if (nextDifference.hasZeroMag()) {
				idealVelocity = myVel.clone();
			} else {
				// v_1^2 - v_0^2 = 2*a*s
				// velocity = sqrt(2 * acceleration * distance)
				var carefulFactor = 0.9; // 1 for not careful.
				var v = Math.sqrt(2 * maxAcceleration * nextDifference.mag()) * carefulFactor;
				idealVelocity = Vec2.resize(nextDifference, v);
			}
			var deltaVel = Vec2.sub(idealVelocity, myVel);

			// if close and slow moving, set velocity to target position.
			if (Vec2.sub(difference, myVel).mag() <= maxAcceleration && // Slow.
				difference.mag() < maxAcceleration) { // Close.
				deltaVel = Vec2.sub(difference, myVel);
			}
			// clamp deltaVel to acceleration
			if (deltaVel.mag() > maxAcceleration) {
				deltaVel.resize(maxAcceleration);
			}
			this.moveToolSelected.setVelocity(Vec2.add(myVel, deltaVel));

			// Rotation.
			//
			var maxAcceleration = 0.01;

			var myVel = this.moveToolSelected.getAngularVelocity();

			var difference = this.moveToolRoundedTargetAngle - this.moveToolSelected.getOrientation();
			var nextDifference = difference - myVel; // Compensates for numerical integration error.

			var idealVelocity;
			if (Math.abs(difference) == 0) {
				idealVelocity = 0;
			} else {
				// v_1^2 - v_0^2 = 2*a*s
				// velocity = sqrt(2 * acceleration * distance)
				var carefulFactor = 0.9; // 1 for not careful.
				var v = Math.sqrt(2 * maxAcceleration * Math.abs(nextDifference)) * carefulFactor;
				idealVelocity = v;
				if (nextDifference < 0) {
					idealVelocity = -idealVelocity;
				}
			}
			var deltaVel = idealVelocity - myVel;

			// if close and slow moving, set velocity to target position.
			if (Math.abs(difference - myVel) <= maxAcceleration && // Slow.
				Math.abs(difference) < maxAcceleration) { // Close.
				deltaVel = difference - myVel;
			}
			// clamp deltaVel to acceleration
			if (deltaVel > maxAcceleration) {
				deltaVel = maxAcceleration;
			} else if (deltaVel < -maxAcceleration) {
				deltaVel = -maxAcceleration;
			}

			this.moveToolSelected.setAngularVelocity(myVel + deltaVel);
		}
	}
}
UserInterfaceHandler.prototype.handleBoxSpawner = function () {
	if (this.mouseControl.left.clicked()) {
		var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);

		var newBox = this.animator.createAnimatedObject(Shapes.square());
		newBox.setPosition(worldClickPosition);
		newBox.setColor(Tool.getRandomColor(1));
		// Test if the new box is overlapping with existing polygons, delete if that is the case.
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var g = this.animator.animatedObjects[i];
			if (g != newBox && AnimatedObject.areOverlapping(g, newBox)) {
				newBox.delete();
				return;
			}
		}
		//
		this.saveStateToUndoHistory();
	}
}
UserInterfaceHandler.prototype.handleCustomShapeSpawner = function () {
	var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
	if (this.mouseControl.left.clicked()) {
		var newShape = this.animator.createAnimatedObject(this.customShapeVertices);
		newShape.setPosition(worldClickPosition);
		newShape.setColor(Tool.getRandomColor(1));
		// Test if the new box is overlapping with existing polygons, delete if that is the case.
		var numberOverlappingPolygons = 0;
		var polygonToAttachTo;
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var g = this.animator.animatedObjects[i];
			if (g != newShape && AnimatedObject.areOverlapping(g, newShape)) {
				numberOverlappingPolygons++;
				// If the new shape is a gear, check if it should be hinged to the colliding polygon.
				if (
					numberOverlappingPolygons == 1 &&
					this.placementMode == UserInterfaceHandler.HINGE_TO_POLYGON &&
					g.positionDetect(worldClickPosition)
				) {
					polygonToAttachTo = g;
					continue;
				}
				newShape.delete();
			}
		}
		// Handle placement.
		if (!newShape.isDeleted) {
			if (this.placementMode == UserInterfaceHandler.HINGE_TO_POLYGON) {
				if (numberOverlappingPolygons == 1) {
					this.animator.createHingeConstraint(polygonToAttachTo, newShape, worldClickPosition, worldClickPosition);
				} else {
					newShape.delete();
				}
			} else if (this.placementMode == UserInterfaceHandler.FIX_TO_BACKGROUND) {
				this.animator.createFixedConstraint(newShape, worldClickPosition);
			}
		}
		if (!newShape.isDeleted) {
			this.saveStateToUndoHistory();
		}
	}
	// Animate.
	this.customShapeOutline.loadOutline(this.customShapeVertices);
	this.customShapeOutline.position = worldClickPosition.clone();
}
UserInterfaceHandler.prototype.getCustomShape = function () {
	return this.customShape;
}
UserInterfaceHandler.prototype.setCustomShape = function (shape) {
	this.customShape = shape;
	switch (this.customShape) {
		case UserInterfaceHandler.SQUARE:
			this.customShapeVertices = Shapes.square(this.squareSize);
			break;

		case UserInterfaceHandler.DISC:
			this.customShapeVertices = Shapes.disc(this.discSize, this.discResolution);
			break;
		case UserInterfaceHandler.GEAR:
			this.customShapeVertices = Shapes.gear(this.gearSize, this.gearResolution);
			break;
		default:
			throw "ERROR: Shape not recognized.";
			break;
	}
}
UserInterfaceHandler.prototype.handlePolygonDrawing = function () {
	function angleIsAllowed(segStartA, segEndAAndSegStartB, segEndB) {
		var segDirA = Vec2.sub(segEndAAndSegStartB, segStartA);
		var segDirBNegative = Vec2.sub(segEndAAndSegStartB, segEndB);

		if (Vec2.dot(segDirA, segDirBNegative) < 0) {
			return true;
		}

		var tan = Vec2.tanOfAngle(segDirA, segDirBNegative);
		if (tan == null || (tan < 0 ? -tan : tan) >= 0.0524077792830412) { // Larger than 3 degrees.
			return true;
		}
		return false;
	}
	function calculateSnapPosition() {
		var snappedPosition;
		var magnitude;
		var angle;
		var radius;
		if (lastCircumference.length == 0) {
			if (this.polygonSnapMode == UserInterfaceHandler.SNAP_TO_CARTESIAN || this.polygonSnapMode == UserInterfaceHandler.SNAP_TO_POLAR){
				// Cartesian. (Polar does not work for the first corner, so cartesian will be used instead).
				snappedPosition = new Vec2(
					Math.round(worldClickPosition.x / this.polygonMinimumSnapGridDistance) * this.polygonMinimumSnapGridDistance,
					Math.round(worldClickPosition.y / this.polygonMinimumSnapGridDistance) * this.polygonMinimumSnapGridDistance
				);
			}else{
				// Default.
				snappedPosition = worldClickPosition.clone();
			}
		}else{
			var previousPosition = lastCircumference[lastCircumference.length - 1];
			if (this.polygonSnapMode == UserInterfaceHandler.SNAP_TO_CARTESIAN){
				// Cartesian.
				snappedPosition = new Vec2(
					Math.round(worldClickPosition.x / this.polygonMinimumSnapGridDistance) * this.polygonMinimumSnapGridDistance,
					Math.round(worldClickPosition.y / this.polygonMinimumSnapGridDistance) * this.polygonMinimumSnapGridDistance
				);
				// Convert to polar coordinates. (This is used in the callbacks.)
				var dir = Vec2.sub(snappedPosition, previousPosition);
				angle = dir.angle();
				radius = dir.mag();
				// Round off polar coordinates.
				angle = Math.round(angle / this.polygonMinimumSnapAngle) * this.polygonMinimumSnapAngle;
				radius = Math.round(radius / this.polygonMinimumSnapRadius) * this.polygonMinimumSnapRadius;
			}else if(this.polygonSnapMode == UserInterfaceHandler.SNAP_TO_POLAR){
				// Polar.
				// Convert to polar coordinates.
				var dir = Vec2.sub(worldClickPosition, previousPosition);
				angle = dir.angle();
				radius = dir.mag();
				// Round off polar coordinates.
				angle = Math.round(angle / this.polygonMinimumSnapAngle) * this.polygonMinimumSnapAngle;
				radius = Math.round(radius / this.polygonMinimumSnapRadius) * this.polygonMinimumSnapRadius;
				// Convert rounded polar to cartesian coordinates.
				snappedPosition = new Vec2(
					previousPosition.x + Math.cos(angle) * radius,
					previousPosition.y + Math.sin(angle) * radius
				);
			}else{
				// Default.
				snappedPosition = worldClickPosition.clone();
			}

			magnitude = Vec2.sub(lastCircumference[lastCircumference.length-1], snappedPosition).mag();
		}

		// Check if snappedPosition has changed since last frame and call callbacks if it has.
		if (magnitude == null || magnitude == 0) {
			magnitude = 0;
			angle = 0;
			radius = 0;
		}
		var data = {
			"angle": angle,
			"magnitude": magnitude,
		};
		if (this.polygonDrawPrevData == null || !Tool.objectsEqual(this.polygonDrawPrevData, data)) {
			for (let i = 0; i < this.polygonDrawDataCallbacks.length; i++) {
				const c = this.polygonDrawDataCallbacks[i];
				c(data);
			}
		}
		this.polygonDrawPrevData = data; 

		return snappedPosition;
	}
	function segmentIntersectGeometry(s0, s1, ingoreFirst, ignoreLast) {
		for (let i = 0; i < this.geometry.length; i++) {
			const c = this.geometry[i];

			var prevVertex;
			var initialJ;
			if (i < this.geometry.length - 1) {
				initialJ = 0;
				prevVertex = c[c.length - 1];
			} else {
				initialJ = 1;
				prevVertex = c[0];
			}
			for (let j = initialJ; j < c.length; j++) {
				const vertex = c[j];
				if (
					i == this.geometry.length - 1 && (
						ignoreLast && j == c.length - 1 ||
						ingoreFirst && j == 1
					)
				) {
					prevVertex = vertex;
					continue;
				}
				if (Tool.segmentsIntersectInclusive(prevVertex, vertex, s0, s1)) {
					return true; // The corner intersects with previous geometry, and the adding of the corner will be cancelled.
				}

				prevVertex = vertex;
			}
		}
		return false;
	}
	function tryFinishCircumference() {
		if (lastCircumference.length >= 3) { // The circumference is big enough to be finished. The next circumference will be prepared.

			// Check that the angle between the newly created segment does not have a too sharp angle between the last and the first segment.
			var s0 = lastCircumference[lastCircumference.length - 2];
			var s1 = lastCircumference[lastCircumference.length - 1];
			var s2 = lastCircumference[0];
			var s3 = lastCircumference[1];
			if (!angleIsAllowed(s0, s1, s2) || !angleIsAllowed(s1, s2, s3)) {
				return;
			}

			// Check that the new segment does not intersect with the rest of the circumference.
			if (segmentIntersectGeometry.call(this,
				s1, s2,
				true, true // Ignore the first and last segment.
			)) {
				return;
			}

			//
			this.geometry.push([]); // Start creating the next circumference.
			return;
		}
		// The circumference is not big enough to be finished. The circumference will be canceled.
		this.geometry[this.geometry.length - 1] = []; // Empty the outer cicumference.
		return;
	}
	function tryAddNewCorner() {
		// Check if the angle is allowed.
		if (
			lastCircumference.length > 1 &&
			!angleIsAllowed(
				lastCircumference[lastCircumference.length - 2],
				lastCircumference[lastCircumference.length - 1],
				snappedPosition
			)) {
			return;
		}
		// Check of the new segment intersects any part of the rest of the circumference.
		if (segmentIntersectGeometry.call(this,
			lastCircumference[lastCircumference.length - 1],
			snappedPosition,
			false, true // Ignore the last segment.
		)) {
			return;
		}

		// Make sure the segment is large enough.
		var minSize = 0.1;
		if (Vec2.sub(snappedPosition, lastCircumference[lastCircumference.length - 1]).magSqr() < minSize * minSize) {
			return;
		}

		//
		lastCircumference.push(snappedPosition.clone());
	}
	function getOrientedGeometry() {
		var geometryOriented = [];
		for (let i = 0; i < this.geometry.length - 1; i++) { // Skip the last circumference as it is empty.
			const c = this.geometry[i];

			geometryOriented.push([]);
			if ((i == 0) == (Tool.areaOfOrientedPolygon(c) > 0)) { // Has the correct orientation.
				for (let j = 0; j < c.length; j++) {
					const v = c[j];
					geometryOriented[geometryOriented.length - 1].push(v);
				}
			} else {
				for (let j = c.length - 1; j >= 0; j--) { // Orientation will be reversed.
					const v = c[j];
					geometryOriented[geometryOriented.length - 1].push(v);
				}
			}
		}
		return geometryOriented;
	}
	function tryFinishPolygon() {
		if (this.geometry.length <= 1) { // There will always be an empty list, so this essentially means there is no polygon.
			return;
		}
		// Give circumferences the correct orientation.
		var geometryOriented = getOrientedGeometry.call(this);

		// Create the polygon.
		var newPolygon = this.animator.createAnimatedObject(geometryOriented);
		newPolygon.setColor(Tool.getRandomColor(1));
		if (this.polygonDrawMode == UserInterfaceHandler.POLYGON_DRAW_STATIC) {
			newPolygon.setIsStatic(true);
			newPolygon.setVelocity(new Vec2());
			newPolygon.setAngularVelocity(0);
			newPolygon.setIsAffectedByGravity(false);
		}


		// Test if the new polygon is overlapping with existing polygons, delete if that is the case.
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var g = this.animator.animatedObjects[i];
			if (g != newPolygon && AnimatedObject.areOverlapping(g, newPolygon)) {
				newPolygon.delete();
				return;
			}
		}
		// The polygon was created successfully. The geometry will be reset.
		this.geometry = [[]];

		this.saveStateToUndoHistory();
	}
	function tryStartNewCircumference() {
		// If this circumference is a hole, test if the position is inside the rest of the geometry.
		var orientedGeometry = getOrientedGeometry.call(this);
		for (let i = 0; i < orientedGeometry.length; i++) {
			const c = orientedGeometry[i];
			if (!Tool.positionInsideOrientedPolygonInclusive(snappedPosition, c)) {
				return;
			}
		}

		this.geometry[this.geometry.length - 1].push(snappedPosition.clone());
	}
	function renderOutline() {

		var renderedGeometry = [];
		for (let i = 0; i < this.geometry.length; i++) {
			const c = this.geometry[i];
			if (c.length == 0) {
				continue;
			}
			renderedGeometry.push([]);
			var lastRenderedGeometry = renderedGeometry[renderedGeometry.length - 1];
			for (let j = 0; j < c.length; j++) {
				const v = c[j];
				lastRenderedGeometry.push(v);
			}
			if (i == this.geometry.length - 1) {
				lastRenderedGeometry.push(snappedPosition);
			} else {
				lastRenderedGeometry.push(lastRenderedGeometry[0]);
			}
		}

		this.polygonOutline.loadOutline(renderedGeometry, false);
	}

	var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);

	var lastCircumference = this.geometry[this.geometry.length - 1];
	
	var snappedPosition = calculateSnapPosition.call(this);

	// Handle states.
	var doUpdateGraphics = false;
	if (lastCircumference.length > 0) { // Is drawing/carving a circumference.
		if (this.keyBoardControl.enter.isPushed()) { // Check if the circumference is to be finished.
			tryFinishCircumference.call(this);
			doUpdateGraphics = true;
		} else if (this.mouseControl.left.clicked()) { // Attempt to add a new corner.
			tryAddNewCorner.call(this);
			doUpdateGraphics = true;
		} else if (this.mouseControl.right.clicked()) { // Remove the last corner.
			lastCircumference.pop();
		}
	} else { // lastCircumference.length == 0.
		if (this.keyBoardControl.enter.isPushed()) { // Try to finish the polygon.
			tryFinishPolygon.call(this);
			doUpdateGraphics = true;
		} else if (this.mouseControl.left.clicked()) { // Create first corner.
			tryStartNewCircumference.call(this);
			doUpdateGraphics = true;
		} else if (this.mouseControl.right.clicked() && this.geometry.length > 1) { // Remove the last segment.
			this.geometry.pop();
		}
	}
	// Graphics.
	if (doUpdateGraphics || true) {
		renderOutline.call(this);
	}
}
UserInterfaceHandler.prototype.handleReadProperties = function () {
	// The selected polygons properties will be returned.
	if (this.mouseControl.left.clicked()) {
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var g = this.animator.animatedObjects[i];
			var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
			if (g.positionDetect(worldClickPosition)) {
				var properties = {
					"mouseX": this.mouseControl.getCanvasPosition().x,
					"mouseY": this.mouseControl.getCanvasPosition().y,
					"id": g.getId(),
					"positionX": g.getPosition().x,
					"positionY": g.getPosition().y,
					"velocityX": g.getVelocity().x,
					"velocityY": g.getVelocity().y,
					"orientation": g.getOrientation(),
					"angularVelocity": g.getAngularVelocity(),
					"density": g.getDensity(),
					"mass": g.getMass(),
					"isFixed": g.getIsStatic(),
					"dynamicFrictionConstant": g.getDynamicFrictionConstant(),
					"staticFrictionConstant": g.getStaticFrictionConstant(),
					"bounceFactor": g.getBounceFactor(),
					"delete": false,
				};
				for (let j = 0; j < this.readPropertiesCallbacks.length; j++) {
					const c = this.readPropertiesCallbacks[j];
					c(properties);
				}
			}
		}
	}
}
UserInterfaceHandler.prototype.handleHinges = function () {

	// -Initialization and creation of hinges-
	if (this.mouseControl.left.clicked()) {
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var a = this.animator.animatedObjects[i];
			var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
			if (a.positionDetect(worldClickPosition)) {
				if (this.hingeSelectedAnimatedObject == null) {
					// First selection
					this.hingeSelectedAnimatedObject = a;
					this.hingeSelectedLocalGrabPosition = a.worldToLocalCoordinates(worldClickPosition);
				} else {
					// Second selection.
					if (this.hingeSelectedAnimatedObject == a) {
						continue;
					}
					var newHinge = this.animator.createHingeConstraint(
						this.hingeSelectedAnimatedObject,
						a,
						this.hingeSelectedAnimatedObject.localToWorldCoordinates(this.hingeSelectedLocalGrabPosition),
						worldClickPosition
					);
					// Prepare for new initialization of hinge.
					this.hingeSelectedAnimatedObject = null;
					this.hingeSelectedLocalGrabPosition = null;
					//
					this.saveStateToUndoHistory();
				}
				break;
			}
		}
	}
	if (this.mouseControl.right.clicked()) {
		// Undo initialization of hinge.
		this.hingeSelectedAnimatedObject = null;
		this.hingeSelectedLocalGrabPosition = null;
	}

	// -Animation-
	if (this.hingeSelectedAnimatedObject == null) {
		this.hingeOutline.isVisible = false;
	} else {
		this.hingeOutline.isVisible = true;
		this.hingeOutline.position = this.hingeSelectedAnimatedObject.localToWorldCoordinates(this.hingeSelectedLocalGrabPosition);
	}
}
UserInterfaceHandler.prototype.handleFixedConstraints = function () {

	// -Initialization and creation of fixed constraints-
	if (this.mouseControl.left.clicked()) {
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var a = this.animator.animatedObjects[i];
			var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
			if (a.positionDetect(worldClickPosition)) {
				var newFixedConstraint = this.animator.createFixedConstraint(
					a,
					worldClickPosition
				);
				this.saveStateToUndoHistory();
				break;
			}
		}
	}
}
UserInterfaceHandler.prototype.handleRopes = function () {

	var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);

	// -Initialization and creation of ropes-
	if (this.mouseControl.left.clicked()) {
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var a = this.animator.animatedObjects[i];
			if (a.positionDetect(worldClickPosition)) {
				if (this.ropeSelectedAnimatedObject == null) {
					// First selection
					this.ropeSelectedAnimatedObject = a;
					this.ropeSelectedLocalStartPosition = a.worldToLocalCoordinates(worldClickPosition);
				} else {
					// Second selection.
					if (this.ropeSelectedAnimatedObject == a) {
						continue;
					}
					var ropeStart = this.ropeSelectedAnimatedObject.localToWorldCoordinates(this.ropeSelectedLocalStartPosition);
					var newRope = this.animator.createRope(
						this.ropeSelectedAnimatedObject,
						a,
						ropeStart,
						worldClickPosition
					);
					newRope.setLength(Vec2.sub(ropeStart, worldClickPosition).mag());
					// Prepare for new initialization of rope.
					this.ropeSelectedAnimatedObject = null;
					this.ropeSelectedLocalStartPosition = null;
					//
					this.saveStateToUndoHistory();
				}
				break;
			}
		}
	}
	if (this.mouseControl.right.clicked()) {
		// Undo initialization of rope.
		this.ropeSelectedAnimatedObject = null;
		this.ropeSelectedLocalStartPosition = null;
	}

	// -Animation-
	if (this.ropeSelectedAnimatedObject == null) {
		this.ropeOutline.isVisible = false;
	} else {
		this.ropeOutline.isVisible = true;
		this.ropeOutline.loadOutline([[
			this.ropeSelectedAnimatedObject.localToWorldCoordinates(this.ropeSelectedLocalStartPosition),
			worldClickPosition
		]]);
	}
}
UserInterfaceHandler.prototype.handlePulleys = function () {
	var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);

	if (this.mouseControl.left.clicked() && this.animator.ropes.length > 0) {

		// Find closest rope end.
		var shortestDistance;
		var closestRope;
		var useFirstEnd;
		for (let i = 0; i < this.animator.ropes.length; i++) {
			const r = this.animator.ropes[i];

			var distanceToRopeStart = Vec2.sub(worldClickPosition, r.getContactWorldA()).mag();
			if (
				closestRope == null ||
				distanceToRopeStart < shortestDistance
			) {
				shortestDistance = distanceToRopeStart;
				closestRope = r;
				useFirstEnd = true;
			}

			var distanceToRopeEnd = Vec2.sub(worldClickPosition, r.getContactWorldB()).mag();
			if (
				distanceToRopeEnd < shortestDistance
			) {
				shortestDistance = distanceToRopeEnd;
				closestRope = r;
				useFirstEnd = false;
			}
		}

		// Check if rope end is not already bound by pulley.
		if (useFirstEnd && !closestRope.hasPulleyA() || !useFirstEnd && !closestRope.hasPulleyB()) {

			if (this.pulleySelectedRope == null) {
				// First selection.
				this.pulleySelectedRope = closestRope;
				this.pulleySelectedRopeUseFirstEnd = useFirstEnd;
			} else {
				// Second selection.
				// Check if it is attempted to bind the rope to itself or in between two different objects.
				var startPolygon;
				if (this.pulleySelectedRopeUseFirstEnd) {
					startPolygon = this.pulleySelectedRope.animatedGameOjbectA;
				} else {
					startPolygon = this.pulleySelectedRope.animatedGameOjbectB;
				}
				var endPolygon;
				if (useFirstEnd) {
					endPolygon = closestRope.animatedGameOjbectA;
				} else {
					endPolygon = closestRope.animatedGameOjbectB;
				}
				if (this.pulleySelectedRope != closestRope && startPolygon == endPolygon) {
					this.animator.createPulley(this.pulleySelectedRope, closestRope, this.pulleySelectedRopeUseFirstEnd, useFirstEnd);
					this.pulleySelectedRope = null;
					this.pulleySelectedRopeUseFirstEnd = null;
					//
					this.saveStateToUndoHistory();
				}
			}
		}
	}
	if (this.mouseControl.right.clicked()) { // Cancel pulley.
		this.pulleySelectedRope = null;
		this.pulleySelectedRopeUseFirstEnd = null;
	}


	// Animate.
	if (this.pulleySelectedRope != null) {
		this.pulleySelectMesh.isVisible = true;
		var ropePosition;
		if (this.pulleySelectedRopeUseFirstEnd) {
			ropePosition = this.pulleySelectedRope.getContactWorldA();
		} else {
			ropePosition = this.pulleySelectedRope.getContactWorldB();
		}
		this.pulleySelectMesh.loadOutline([[ropePosition, worldClickPosition]]);
	} else {
		this.pulleySelectMesh.isVisible = false;
	}

}
UserInterfaceHandler.prototype.handleDeletePolygons = function () {
	var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);

	// -Initialization and creation of ropes-
	if (this.mouseControl.left.clicked()) {
		for (var i = this.animator.animatedObjects.length - 1; i >= 0; i--) {
			var a = this.animator.animatedObjects[i];
			if (a.positionDetect(worldClickPosition)) {
				a.delete();
				this.saveStateToUndoHistory();
				break;
			}
		}
	}
}
UserInterfaceHandler.prototype.handleSelectTools = function () {
	var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);

	var closestTool;
	var shortestDistance;
	var selectionGraphics;

	var rope = 0; var hinge = 1; var fixed = 2; var pulley = 3;
	var toolType;
	// Ropes.
	for (let i = 0; i < this.animator.ropes.length; i++) {
		const r = this.animator.ropes[i];

		var start = r.getContactWorldA();
		var end = r.getContactWorldB();
		var closestPoint = Vec2.projectPointToSegment(worldClickPosition, start, end);
		var length = Vec2.sub(worldClickPosition, closestPoint).mag();
		if (closestTool == null || length < shortestDistance) {
			shortestDistance = length;
			closestTool = r;
			toolType = rope;
			// Graphics.
			var dir = Vec2.sub(end, start).resize(1);
			var dirOrth = Vec2.rotate90Clockwise(dir);
			selectionGraphics = [
				Vec2.sub(start, dir).sub(dirOrth),
				Vec2.sub(start, dir).add(dirOrth),
				Vec2.add(end, dir).add(dirOrth),
				Vec2.add(end, dir).sub(dirOrth),
			];
		}
	}
	// Hinges.
	for (let i = 0; i < this.animator.hingeConstraints.length; i++) {
		const h = this.animator.hingeConstraints[i];

		var contactPoint = h.getContactPoint();
		var length = Vec2.sub(worldClickPosition, contactPoint).mag();
		if (closestTool == null || length < shortestDistance) {
			shortestDistance = length;
			closestTool = h;
			toolType = hinge;
			// Graphics.
			selectionGraphics = [
				Vec2.add(contactPoint, new Vec2(-1, -1)),
				Vec2.add(contactPoint, new Vec2(-1, 1)),
				Vec2.add(contactPoint, new Vec2(1, 1)),
				Vec2.add(contactPoint, new Vec2(1, -1)),
			];
		}
	}
	// Fixed.
	for (let i = 0; i < this.animator.fixedConstraints.length; i++) {
		const f = this.animator.fixedConstraints[i];

		var position = f.getWorldPosition();
		var length = Vec2.sub(worldClickPosition, position).mag();
		if (closestTool == null || length < shortestDistance) {
			shortestDistance = length;
			closestTool = f;
			toolType = fixed;
			// Graphics.
			selectionGraphics = [
				Vec2.add(position, new Vec2(-1, -1)),
				Vec2.add(position, new Vec2(-1, 1)),
				Vec2.add(position, new Vec2(1, 1)),
				Vec2.add(position, new Vec2(1, -1)),
			];
		}
	}
	// Pulleys.
	for (let i = 0; i < this.animator.pulleys.length; i++) {
		const p = this.animator.pulleys[i];

		var start = p.getContactWorldA();
		var end = p.getContactWorldB();
		var closestPoint = Vec2.projectPointToSegment(worldClickPosition, start, end);
		var length = Vec2.sub(worldClickPosition, closestPoint).mag();
		if (closestTool == null || length < shortestDistance) {
			shortestDistance = length;
			closestTool = p;
			toolType = pulley;
			// Graphics.
			var dir = Vec2.sub(end, start).resize(1);
			var dirOrth = Vec2.rotate90Clockwise(dir);
			selectionGraphics = [
				Vec2.sub(start, dir).sub(dirOrth),
				Vec2.sub(start, dir).add(dirOrth),
				Vec2.add(end, dir).add(dirOrth),
				Vec2.add(end, dir).sub(dirOrth),
			];
		}
	}

	// Call callback with data.

	var properties;

	if (closestTool == null) {
		// No tool was found.
	} else if (toolType == rope) {
		properties = {
			"mouseX": this.mouseControl.getCanvasPosition().x,
			"mouseY": this.mouseControl.getCanvasPosition().y,
			"id": closestTool.id,
			"length": closestTool.getLength(),
			"delete": false,
		};
		if (this.mouseControl.left.clicked()) {
			for (let i = 0; i < this.readRopesCallbacks.length; i++) {
				const c = this.readRopesCallbacks[i];
				c(properties);
			}
		}
	} else if (toolType == hinge) {
		properties = {
			"mouseX": this.mouseControl.getCanvasPosition().x,
			"mouseY": this.mouseControl.getCanvasPosition().y,
			"id": closestTool.id,
			"friction": closestTool.getFriction(),
			"delete": false,
		};
		if (this.mouseControl.left.clicked()) {
			for (let i = 0; i < this.readHingesCallbacks.length; i++) {
				const c = this.readHingesCallbacks[i];
				c(properties);
			}
		}
	} else if (toolType == fixed) {
		properties = {
			"mouseX": this.mouseControl.getCanvasPosition().x,
			"mouseY": this.mouseControl.getCanvasPosition().y,
			"id": closestTool.id,
			"positionX": closestTool.getWorldPosition().x,
			"positionY": closestTool.getWorldPosition().y,
			"velocityX": closestTool.getVelocity().x,
			"velocityY": closestTool.getVelocity().y,
			"friction": closestTool.getFriction(),
			"delete": false,
		};
		if (this.mouseControl.left.clicked()) {
			for (let i = 0; i < this.readFixedCallbacks.length; i++) {
				const c = this.readFixedCallbacks[i];
				c(properties);
			}
		}
	} else if (toolType == pulley) {
		properties = {
			"mouseX": this.mouseControl.getCanvasPosition().x,
			"mouseY": this.mouseControl.getCanvasPosition().y,
			"id": closestTool.id,
			"delete": false,
		};
		if (this.mouseControl.left.clicked()) {
			for (let i = 0; i < this.readPulleysCallbacks.length; i++) {
				const c = this.readPulleysCallbacks[i];
				c(properties);
			}
		}
	} else {
		throw "ERROR: Tool not recognized."
	}

	// Animate.
	if (closestTool == null) {
		this.selectionMesh.isVisible = false;
	} else {
		this.selectionMesh.isVisible = true;
		this.selectionMesh.loadOutline([selectionGraphics]);
	}
}
UserInterfaceHandler.prototype.handleToggleStatic = function () {
	if (this.mouseControl.left.clicked()) {
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var g = this.animator.animatedObjects[i];
			var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
			if (g.positionDetect(worldClickPosition)) {
				if (g.getIsStatic()) {
					g.setIsStatic(false);
					g.setIsAffectedByGravity(true);
				} else {
					g.setIsStatic(true);
					g.setVelocity(new Vec2());
					g.setAngularVelocity(0);
					g.setIsAffectedByGravity(false);
				}
				this.saveStateToUndoHistory();
				break;
			}
		}
	}
}
UserInterfaceHandler.prototype.handleShowForces = function () {
	if (this.mouseControl.left.clicked()) {
		for (var i = 0; i < this.animator.animatedObjects.length; i++) {
			var g = this.animator.animatedObjects[i];
			var worldClickPosition = this.animator.camera.canvasToWorldCoordinates(this.mouseControl.position);
			if (g.positionDetect(worldClickPosition)) {
				this.showForcesObject = g;
				break;
			}
		}
	}
	if (this.mouseControl.right.clicked()) {
		this.showForcesObject = null;
	}

	// Animate.
	if (this.showForcesObject != null) {
		var forceData = this.showForcesObject.getAverageForces();

		// Add in gravity.
		if (this.showForcesObject.getIsAffectedByGravity()) {
			var gravityForce = this.animator.getGravity().mul(this.showForcesObject.getMass());
			forceData.push({
				"force": gravityForce,
				"normalForce": new Vec2(),
				"frictionForce": new Vec2(),
				"point": this.showForcesObject.getPosition(),
			});
		}
		//

		for (let i = 0; i < this.showForcesArrowHeads.length; i++) {
			const element = this.showForcesArrowHeads[i];
			const arrowHead = this.showForcesArrowHeads[i];
			const arrowBody = this.showForcesArrowBodies[i];

			arrowHead.isVisible = false;
			arrowBody.isVisible = false;
		}

		var arrowData = [];

		for (let i = 0; i < forceData.length && i * 3 < this.showForcesArrowHeads.length; i++) {
			const data = forceData[i];
			const arrowForceHead = this.showForcesArrowHeads[i * 3];
			const arrowForceBody = this.showForcesArrowBodies[i * 3];
			const arrowNormalHead = this.showForcesArrowHeads[i * 3 + 1];
			const arrowNormalBody = this.showForcesArrowBodies[i * 3 + 1];
			const arrowFrictionHead = this.showForcesArrowHeads[i * 3 + 2];
			const arrowFrictionBody = this.showForcesArrowBodies[i * 3 + 2];

			//
			if (data.force.mag() < 10e-3) {
				arrowForceHead.isVisible = false;
				arrowForceBody.isVisible = false;

			} else {
				arrowForceHead.isVisible = true;
				arrowForceBody.isVisible = true;
			}
			if (data.normalForce.mag() < 10e-3) {
				arrowNormalHead.isVisible = false;
				arrowNormalBody.isVisible = false;

			} else {
				arrowNormalHead.isVisible = true;
				arrowNormalBody.isVisible = true;
			}
			if (data.frictionForce.mag() < 10e-3) {
				arrowFrictionHead.isVisible = false;
				arrowFrictionBody.isVisible = false;

			} else {
				arrowFrictionHead.isVisible = true;
				arrowFrictionBody.isVisible = true;
			}

			//
			var smallArrowFactor = 0.4;

			// -Total force-

			var orientation = data.force.angle();

			// Depth.
			arrowForceHead.depth = -0.2;
			arrowForceBody.depth = -0.2;

			// Color.
			arrowForceHead.color = new Vec3(1, 0, 0);
			arrowForceBody.color = new Vec3(1, 0, 0);

			// Head.
			arrowForceHead.scale.x = 0.4;
			arrowForceHead.scale.y = 0.4;
			arrowForceHead.orientation = orientation;
			arrowForceHead.position = Vec2.add(data.point, Vec2.mul(data.force, this.showForcesScaleFactor).increaseBy(-arrowForceHead.scale.x));

			// Body.
			arrowForceBody.position = data.point.clone();
			arrowForceBody.scale.x = data.force.mag() * this.showForcesScaleFactor - arrowForceHead.scale.x;
			arrowForceBody.scale.y = 0.2;
			arrowForceBody.orientation = orientation;

			// -Normal force-

			var orientation = data.normalForce.angle();

			// Depth.
			arrowNormalHead.depth = -0.3;
			arrowNormalBody.depth = -0.3;

			// Color.
			arrowNormalHead.color = new Vec3(0, 1, 0);
			arrowNormalBody.color = new Vec3(0, 1, 0);

			// Head.
			arrowNormalHead.scale.x = 0.4 * smallArrowFactor;
			arrowNormalHead.scale.y = 0.4 * smallArrowFactor;
			arrowNormalHead.orientation = orientation;
			arrowNormalHead.position = Vec2.add(data.point, Vec2.mul(data.normalForce, this.showForcesScaleFactor).increaseBy(-arrowNormalHead.scale.y));

			// Body.
			arrowNormalBody.position = data.point.clone();
			arrowNormalBody.scale.x = data.normalForce.mag() * this.showForcesScaleFactor - arrowNormalHead.scale.y;
			arrowNormalBody.scale.y = 0.2 * smallArrowFactor;
			arrowNormalBody.orientation = orientation;

			// -Friction-

			var orientation = data.frictionForce.angle();

			// Depth.
			arrowFrictionHead.depth = -0.3;
			arrowFrictionBody.depth = -0.3;

			// Color.
			arrowFrictionHead.color = new Vec3(0, 1, 0);
			arrowFrictionBody.color = new Vec3(0, 1, 0);

			// Head.
			arrowFrictionHead.scale.x = 0.4 * smallArrowFactor;
			arrowFrictionHead.scale.y = 0.4 * smallArrowFactor;
			arrowFrictionHead.orientation = orientation;
			arrowFrictionHead.position = Vec2.add(data.point, Vec2.mul(data.frictionForce, this.showForcesScaleFactor).increaseBy(-arrowFrictionHead.scale.y));

			// Body.
			arrowFrictionBody.position = data.point.clone();
			arrowFrictionBody.scale.x = data.frictionForce.mag() * this.showForcesScaleFactor - arrowFrictionHead.scale.y;
			arrowFrictionBody.scale.y = 0.2 * smallArrowFactor;
			arrowFrictionBody.orientation = orientation;


		}
	}
}
// Set properties.
UserInterfaceHandler.prototype.setProperties = function (properties) {
	// If id is not found, false is returned, otherwise true is returned.

	// -Get animated object with id-
	if (properties == null) {
		throw "ERROR: Missing the argument \"properties\" containing the properties that is to be modified.";
	}
	if (properties.id == null) {
		throw "ERROR: No attribute \"id\" in argument.";
	}
	if (typeof properties.id != "number" || isNaN(properties.id)) {
		throw "ERROR: Attribute \"id\" is not a number.";
	}
	var animatedObject;
	for (let i = 0; i < this.animator.animatedObjects.length; i++) {
		const a = this.animator.animatedObjects[i];
		if (a.getId() == properties.id) {
			animatedObject = a;
			break;
		}
	}
	if (animatedObject == null) {
		return false;
	}
	// -Set properties-
	// Delete.
	if (properties.delete) {
		animatedObject.delete();
		return true;
	}
	// Position.
	if (properties.positionX != null || properties.positionY != null) {
		if (properties.positionX == null) {
			throw "ERROR: Missing attribute positionX.";
		}
		if (properties.positionY == null) {
			throw "ERROR: Missing attribute positionY.";
		}
		if (typeof properties.positionX != "number" || isNaN(properties.positionX)) {
			throw "ERROR: Attribute positionX is not a number.";
		}
		if (typeof properties.positionY != "number" || isNaN(properties.positionY)) {
			throw "ERROR: Attribute positionY is not a number.";
		}
		animatedObject.setPosition(new Vec2(
			properties.positionX, properties.positionY,
		));
	}
	// Velocity.
	if (properties.velocityX != null || properties.velocityY != null) {
		if (properties.velocityX == null) {
			throw "ERROR: Missing attribute velocityX.";
		}
		if (properties.velocityY == null) {
			throw "ERROR: Missing attribute velocityY.";
		}
		if (typeof properties.velocityX != "number" || isNaN(properties.velocityX)) {
			throw "ERROR: Attribute velocityX is not a number.";
		}
		if (typeof properties.velocityY != "number" || isNaN(properties.velocityY)) {
			throw "ERROR: Attribute velocityY is not a number.";
		}
		animatedObject.setVelocity(new Vec2(
			properties.velocityX, properties.velocityY,
		));
	}
	// Orientation.
	if (properties.orientation != null) {
		if (typeof properties.orientation != "number" || isNaN(properties.orientation)) {
			throw "ERROR: Attribute orientation is not a number.";
		}
		animatedObject.setOrientation(properties.orientation);
	}
	// Angular velocity.
	if (properties.angularVelocity != null) {
		if (typeof properties.angularVelocity != "number" || isNaN(properties.angularVelocity)) {
			throw "ERROR: Attribute angularVelocity is not a number.";
		}
		animatedObject.setAngularVelocity(properties.angularVelocity);
	}
	// Density.
	if (properties.density != null) {
		if (typeof properties.density != "number" || isNaN(properties.density)) {
			throw "ERROR: Attribute density is not a number.";
		}
		animatedObject.setDensity(properties.density);
	}
	// Mass.
	if (properties.mass != null) {
		if (typeof properties.mass != "number" || isNaN(properties.mass)) {
			throw "ERROR: Attribute mass is not a number.";
		}
		animatedObject.setMass(properties.mass);
	}
	// IsFixed.
	if (properties.isFixed != null) {
		var isFixed;
		// Convert to boolean
		if (properties.isFixed) {
			isFixed = true;
		} else {
			isFixed = false;
		}
		if (!animatedObject.getIsStatic() && isFixed) {
			animatedObject.setVelocity(new Vec2(0,0));
			animatedObject.setAngularVelocity(0);
		}
		animatedObject.setIsStatic(isFixed);
		animatedObject.setIsAffectedByGravity(!isFixed);
	}
	// DynamicFrictionConstant.
	if (properties.dynamicFrictionConstant != null) {
		if (typeof properties.dynamicFrictionConstant != "number" || isNaN(properties.dynamicFrictionConstant)) {
			throw "ERROR: Attribute dynamicFrictionConstant is not a number.";
		}
		if (properties.dynamicFrictionConstant < 0) {
			throw "ERROR: dynamicFrictionConstant must be larger than 0.";
		}
		animatedObject.setDynamicFrictionConstant(properties.dynamicFrictionConstant);
	}
	// StaticFrictionConstant.
	if (properties.staticFrictionConstant != null) {
		if (typeof properties.staticFrictionConstant != "number" || isNaN(properties.staticFrictionConstant)) {
			throw "ERROR: Attribute staticFrictionConstant is not a number.";
		}
		if (properties.staticFrictionConstant < 0) {
			throw "ERROR: staticFrictionConstant must be be larger than 0.";
		}
		animatedObject.setStaticFrictionConstant(properties.staticFrictionConstant);
	}
	// BounceFactor.
	if (properties.bounceFactor != null) {
		if (typeof properties.bounceFactor != "number" || isNaN(properties.bounceFactor)) {
			throw "ERROR: Attribute bounceFactor is not a number.";
		}
		if (properties.bounceFactor < 0 || properties.bounceFactor > 1) {
			throw "ERROR: bounceFactor must be between 0 and 1.";
		}
		animatedObject.setBounceFactor(properties.bounceFactor);
	}

	return true;
}
UserInterfaceHandler.prototype.setRopeProperties = function (properties) {
	if (properties == null) {
		throw "ERROR: Missing the argument \"properties\" containing the properties that is to be modified.";
	}
	if (properties.id == null) {
		throw "ERROR: No attribute \"id\" in argument.";
	}
	if (typeof properties.id != "number" || isNaN(properties.id)) {
		throw "ERROR: Attribute \"id\" is not a number.";
	}

	var rope;
	for (let i = 0; i < this.animator.ropes.length; i++) {
		const r = this.animator.ropes[i];
		if (r.id == properties.id) {
			rope = r;
			break;
		}
	}
	if (rope == null) {
		return false;
	}
	// Delete.
	if (properties.delete) {
		rope.delete();
		return true;
	}
	// Length.
	if (properties.length != null) {
		if (typeof properties.length != "number" || isNaN(properties.length)) {
			throw "ERROR: properties.length is not a number.";
		}
		if (properties.length < 0) {
			throw "ERROR: properties.length cannot be negative."
		}
		rope.setLength(properties.length);
	}

	return true;
}
UserInterfaceHandler.prototype.setHingeProperties = function (properties) {
	if (properties == null) {
		throw "ERROR: Missing the argument \"properties\" containing the properties that is to be modified.";
	}
	if (properties.id == null) {
		throw "ERROR: No attribute \"id\" in argument.";
	}
	if (typeof properties.id != "number" || isNaN(properties.id)) {
		throw "ERROR: Attribute \"id\" is not a number.";
	}

	var hinge;
	for (let i = 0; i < this.animator.hingeConstraints.length; i++) {
		const h = this.animator.hingeConstraints[i];
		if (h.id == properties.id) {
			hinge = h;
			break;
		}
	}
	if (hinge == null) {
		return false;
	}
	// Delete.
	if (properties.delete) {
		hinge.delete();
		return true;
	}
	// Friction.
	if (properties.friction != null) {
		if (typeof properties.friction != "number" || isNaN(properties.friction)) {
			throw "ERROR: properties.friction is not a number.";
		}
		if (properties.friction < 0 || properties.friction > 1) {
			throw "ERROR: properties.friction must be between 0 and 1 inclusively.";
		}
		hinge.setFriction(properties.friction);
	}

	return true;
}
UserInterfaceHandler.prototype.setFixedProperties = function (properties) {
	if (properties == null) {
		throw "ERROR: Missing the argument \"properties\" containing the properties that is to be modified.";
	}
	if (properties.id == null) {
		throw "ERROR: No attribute \"id\" in argument.";
	}
	if (typeof properties.id != "number" || isNaN(properties.id)) {
		throw "ERROR: Attribute \"id\" is not a number.";
	}

	var fixed;
	for (let i = 0; i < this.animator.fixedConstraints.length; i++) {
		const f = this.animator.fixedConstraints[i];
		if (f.id == properties.id) {
			fixed = f;
			break;
		}
	}
	if (fixed == null) {
		return false;
	}
	// Delete.
	if (properties.delete) {
		fixed.delete();
		return true;
	}
	// Position
	if (properties.positionX != null || properties.positionY != null) {
		if (typeof properties.positionX != "number" || isNaN(properties.positionX) || typeof properties.positionY != "number" || isNaN(properties.positionY)) {
			throw "ERROR: properties.positionX or properties.positionY is not a number."
		}
		fixed.setWorldPosition(new Vec2(properties.positionX, properties.positionY));
	}
	// Velocities.
	if (properties.velocityX != null || properties.velocityY != null) {
		if (typeof properties.velocityX != "number" || isNaN(properties.velocityX) || typeof properties.velocityY != "number" || isNaN(properties.velocityY)) {
			throw "ERROR: properties.velocityX or properties.velocityY is not a number."
		}
		fixed.setVelocity(new Vec2(properties.velocityX, properties.velocityY));
	}
	// Friction
	if (properties.friction != null) {
		if (typeof properties.friction != "number" || isNaN(properties.friction)) {
			throw "ERROR: properties.friction is not a number.";
		}
		if (properties.friction < 0 || properties.friction > 1) {
			throw "ERROR: properties.friction must be between 0 and 1 inclusively.";
		}
		fixed.setFriction(properties.friction);
	}

	return true;
}
UserInterfaceHandler.prototype.setPulleyProperties = function (properties) {
	if (properties == null) {
		throw "ERROR: Missing the argument \"properties\" containing the properties that is to be modified.";
	}
	if (properties.id == null) {
		throw "ERROR: No attribute \"id\" in argument.";
	}
	if (typeof properties.id != "number" || isNaN(properties.id)) {
		throw "ERROR: Attribute \"id\" is not a number.";
	}

	var pulley;
	for (let i = 0; i < this.animator.pulleys.length; i++) {
		const p = this.animator.pulleys[i];
		if (p.id == properties.id) {
			pulley = p;
			break;
		}
	}
	if (pulley == null) {
		return false;
	}
	// Delete.
	if (properties.delete) {
		pulley.delete();
		return true;
	}

	// Set the properties of the pulley:
	// .. there are no properties to be set.

	return true;
}
// Polygon draw settings.
UserInterfaceHandler.prototype.setPolygonDrawMode = function (mode) {
	this.polygonDrawMode = mode;
}
UserInterfaceHandler.prototype.getPolygonDrawMode = function () {
	return this.polygonDrawMode;
}
// Set custom shape properties.
UserInterfaceHandler.prototype.setDiscSize = function (newDiscSize) {
	this.discSize = newDiscSize;
	this.setCustomShape(this.customShape); // Update custom shape.
}
UserInterfaceHandler.prototype.getDiscSize = function () {
	return this.discSize;
}
UserInterfaceHandler.prototype.setDiscResolution = function (newDiscResolution) {
	this.discResolution = newDiscResolution;
	this.setCustomShape(this.customShape); // Update custom shape.
}
UserInterfaceHandler.prototype.getDiscResolution = function () {
	return this.discResolution;
}
UserInterfaceHandler.prototype.setSquareSize = function (newSquareSize) {
	this.squareSize = newSquareSize;
	this.setCustomShape(this.customShape); // Update custom shape.
}
UserInterfaceHandler.prototype.getSquareSize = function () {
	return this.squareSize;
}
UserInterfaceHandler.prototype.setGearSize = function (newGearSize) {
	this.gearSize = newGearSize;
	this.setCustomShape(this.customShape); // Update custom shape.
}
UserInterfaceHandler.prototype.getGearSize = function () {
	return this.gearSize;
}
UserInterfaceHandler.prototype.setGearResolution = function (newGearResolution) {
	this.gearResolution = newGearResolution;
	this.setCustomShape(this.customShape); // Update custom shape.
}
UserInterfaceHandler.prototype.getGearResolution = function () {
	return this.gearResolution;
}
UserInterfaceHandler.prototype.setPlacementMode = function (mode) {
	this.placementMode = mode;
}
UserInterfaceHandler.prototype.getPlacementMode = function () {
	return this.placementMode;
}
UserInterfaceHandler.prototype.setSnapMode = function (mode) {
	this.polygonSnapMode = mode;
}
UserInterfaceHandler.prototype.getSnapMode = function () {
	return this.polygonSnapMode;
}
UserInterfaceHandler.prototype.setMode = function (newMode) {
	if (this.state == newMode) {
		return;
	}
	// End previous mode.
	switch (this.state) {
		case UserInterfaceHandler.CLEAR:

			break;
		case UserInterfaceHandler.DEFAULT:
			this.selectedAnimatedObject = null;
			this.selectedLocalGrabPosition = null;
			this.selectedDragLine.isVisible = false;
			break;
		case UserInterfaceHandler.MOVE_TOOL:
			this.moveToolSelected = null;
			this.moveToolLocalGrabPosition = null;
			this.moveToolTargetAngle = null;
			this.moveToolRoundedTargetAngle = null;
			break;
		case UserInterfaceHandler.BOX_SPAWNER:

			break;
		case UserInterfaceHandler.CUSTOM_SHAPE_SPAWNER:
			this.customShapeOutline.isVisible = false;
			break;
		case UserInterfaceHandler.POLYGON_DRAW:
			this.polygonOutline.isVisible = false;
			break;
		case UserInterfaceHandler.READ_PROPERTIES:

			break;
		case UserInterfaceHandler.HINGES:
			this.hingeSelectedAnimatedObject = null;
			this.hingeSelectedLocalGrabPosition = null;
			this.hingeOutline.isVisible = false;
			break;
		case UserInterfaceHandler.FIXED_CONSTRAINT:

			break;
		case UserInterfaceHandler.ROPES:
			this.ropeSelectedAnimatedObject = null;
			this.ropeSelectedLocalStartPosition = null;
			this.ropeOutline.isVisible = false;
			break;
		case UserInterfaceHandler.PULLEYS:
			this.pulleySelectMesh.isVisible = false;
			this.pulleySelectedRope = null;
			this.pulleySelectedRopeUseFirstEnd = null;
			break;
		case UserInterfaceHandler.DELETE_POLYGONS:

			break;
		case UserInterfaceHandler.SELECT_TOOLS:
			this.selectionMesh.isVisible = false;
			break;
		case UserInterfaceHandler.TOGGLE_STATIC:

			break;
		case UserInterfaceHandler.SHOW_FORCES:
			this.showForcesObject = null;
			for (let i = 0; i < this.showForcesArrowHeads.length; i++) {
				const h = this.showForcesArrowHeads[i];
				const b = this.showForcesArrowBodies[i];
				h.isVisible = false;
				b.isVisible = false;
			}
			break;
		default:
			Tool.printError("ERROR::UserInterfaceHandler.updateUser: InterfaceHandler.status not recogniced.");
	}
	// Start new mode.
	switch (newMode) {
		case UserInterfaceHandler.CLEAR:
			this.state = UserInterfaceHandler.CLEAR;
			break;
		case UserInterfaceHandler.DEFAULT:
			this.state = UserInterfaceHandler.DEFAULT;
			break;
		case UserInterfaceHandler.MOVE_TOOL:
			this.state = UserInterfaceHandler.MOVE_TOOL;
			break;
		case UserInterfaceHandler.BOX_SPAWNER:
			this.state = UserInterfaceHandler.BOX_SPAWNER;
			break;
		case UserInterfaceHandler.CUSTOM_SHAPE_SPAWNER:
			this.state = UserInterfaceHandler.CUSTOM_SHAPE_SPAWNER;
			this.customShapeOutline.isVisible = true;
			break;
		case UserInterfaceHandler.POLYGON_DRAW:
			this.state = UserInterfaceHandler.POLYGON_DRAW;
			this.polygonOutline.isVisible = true;
			this.geometry = [[]];
			break;
		case UserInterfaceHandler.READ_PROPERTIES:
			this.state = UserInterfaceHandler.READ_PROPERTIES;
			break;
		case UserInterfaceHandler.HINGES:
			this.state = UserInterfaceHandler.HINGES;
			break;
		case UserInterfaceHandler.FIXED_CONSTRAINT:
			this.state = UserInterfaceHandler.FIXED_CONSTRAINT;
			break;
		case UserInterfaceHandler.ROPES:
			this.state = UserInterfaceHandler.ROPES;
			break;
		case UserInterfaceHandler.PULLEYS:
			this.state = UserInterfaceHandler.PULLEYS;
			break;
		case UserInterfaceHandler.DELETE_POLYGONS:
			this.state = UserInterfaceHandler.DELETE_POLYGONS;
			break;
		case UserInterfaceHandler.SELECT_TOOLS:
			this.state = UserInterfaceHandler.SELECT_TOOLS;
			this.selectionMesh.isVisible = true;
			break;
		case UserInterfaceHandler.TOGGLE_STATIC:
			this.state = UserInterfaceHandler.TOGGLE_STATIC;
			break;
		case UserInterfaceHandler.SHOW_FORCES:
			this.state = UserInterfaceHandler.SHOW_FORCES;
			break;
		default:
			Tool.printError("ERROR::UserInterfaceHandler.updateUser: InterfaceHandler.status not recogniced.");
	}
}
UserInterfaceHandler.prototype.clearActiveTools = function () {
	var oldState = this.state;
	this.setMode(UserInterfaceHandler.CLEAR);
	this.setMode(oldState);
}
UserInterfaceHandler.prototype.addReadPropertiesCallback = function (callback) {
	this.readPropertiesCallbacks.push(callback);
}
UserInterfaceHandler.prototype.addReadRopesCallback = function (callback) {
	this.readRopesCallbacks.push(callback);
}
UserInterfaceHandler.prototype.addReadHingesCallback = function (callback) {
	this.readHingesCallbacks.push(callback);
}
UserInterfaceHandler.prototype.addReadFixedCallback = function (callback) {
	this.readFixedCallbacks.push(callback);
}
UserInterfaceHandler.prototype.addReadPulleysCallback = function (callback) {
	this.readPulleysCallbacks.push(callback);
}
UserInterfaceHandler.prototype.addPolygonDrawDataCallback = function (callback) {
	this.polygonDrawDataCallbacks.push(callback);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.user_interface_handler', true);