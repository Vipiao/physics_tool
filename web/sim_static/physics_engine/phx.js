


/*

Ideas:
	- Sort order of impulses by magnitude of compensation (velocity or impulse)?
	- Bug? Bounce factor has to be set to 0 before compensation can start.
	- Apply compensators after ordinary impulses.
	- Apply displacement to make static friction more accurate.
	- Don't forget compensators if the pressure between polygons are not released.
	- Re-calculate polygons world position after displacement by hinges and other constraints.
	- Increase the number of resolutions by impulse per tick.
	- Apply all forces in the impulse iterator.
	- Only apply compensator at last impulse iteration.
	- Do compensator independent of impulses.
	- Set minimum length of rope.
	PLAUSIBLE (IS IN USE)	- Sort order of contact points by collision time. Use linked list.
	DONE	- Change pulley length calculation.
	DONE	- Apply half of the acceleration before and half after movement to improv conservation of energy.
	FAILED	- Half continuous forces before and after movement and collision resolution by impulse.
	FAILED	- Only skip collision if the impulse is negativ both before and after the compensator is added.
*/

function PHX(){
	// Shapes
	this.polygons = [];
	
	// Constraints
	this.fixedConstraints = [];
	this.hingeConstraints = [];
	this.ropes = [];
	this.pulleys = [];

	// Properties
	// 9.81m/s^2
	// s = 60t
	// 9.81m/s^2 = 9.81m/60^2/t^2
	this.gravity = new Vec2(0, -9.81/60/60*4);
	
	//
	this.enableForces = true;
	this.enableMeasureCollisionError = true;
	this.enableMovement = true;
	this.enableCollisionDetection = true;
	this.enableResolutionByDisplacement = true;

	//
	this.tick = 0;

	this.collisionGroups = []; // Data about the colliding polygons.

	this.contactList = new LinkedList();

	this.random = new RandomSeed();

	this.collisionResolutionImpulsePrecision = 4; // Must be >= 1 and integer.
	this.collisionResolutionDisplacementPrecision = 1; // Must be >= 1 and integer.
}
PHX.prototype.run = function (){
	// TEST START
	//this.polygons[0].applyImpulse(new Vec2(400, 0), new Vec2(5e11, 0));
	// TEST END

	if (this.enableForces){
		// Collision resolution. How does the polygons bounce and slide.
		this.handleCollisionResolutionByImpulse();
		
		// Accelerate half.
		this.handleForces();
	}

	//
	if (this.enableMeasureCollisionError) {
		this.measureCollisionError();
	}

	// Move.
	if (this.enableMovement) {
		this.handleMovement();
	}

	if (this.enableForces){
		// Accelerate half.
		this.handleForces();
	}

	// Collision detection. How and where does the polygons collide.
	if(physicsSimulator.animator.phx.tick == 377){
		//physicsSimulator.physicsFraction = 240;
	}
	if (this.enableCollisionDetection) {
		this.handleCollisionDetection();
	}
	
	//
	if (this.enableResolutionByDisplacement) {
		this.handleCollisionResolutionByDisplacement();
	}

	this.tick++;
}
PHX.prototype.createPolygon = function () {
	var newPolygon = new Polygon();
	newPolygon.spawnTime = this.tick;
	newPolygon.phx = this;
	this.polygons.push(newPolygon);
	return newPolygon;
}
PHX.prototype.createFixedConstraint = function (polygon, worldPosition) {
	var newConstraint = new FixedConstraint(this);
	newConstraint.attachToPolygon(polygon, worldPosition);
	this.fixedConstraints.push(newConstraint);

	return newConstraint;
}
PHX.prototype.createHingeConstraint = function (polygonA, polygonB, worldPositionA, worldPositionB) {
	
	var newConstraint = new HingeConstraint(this);
	newConstraint.attachPolygons(polygonA, polygonB, worldPositionA, worldPositionB);
	this.hingeConstraints.push(newConstraint);

	return newConstraint;
}
PHX.prototype.createRope = function (polygonA, polygonB, worldPositionA, worldPositionB) {
	
	var newRope = new Rope(this);
	newRope.attachPolygons(polygonA, polygonB, worldPositionA, worldPositionB);
	this.ropes.push(newRope);

	return newRope;
}
PHX.prototype.createPulley = function () {
	var newPulley = new Pulley(this);
	this.pulleys.push(newPulley);
	
	return newPulley;
}
PHX.prototype.handleForces = function () {
	for (var i = 0; i < this.polygons.length; i++) {
		var p = this.polygons[i];
		p.isAffectedByGravity && p.velocity.add(Vec2.mul(this.gravity, 0.5));
		/*!p.position.hasZeroMag() && p.velocity.add(
			Vec2.resize(p.position, -p.position.magSqr() * 0.000005)
		);*/
	}
}
PHX.prototype.handleAdjustPulleys = function () {
	for (let i = 0; i < this.pulleys.length; i++) {
		const p = this.pulleys[i];
		p.hasBeenAdjusted = false;
	}
	for (let i = 0; i < this.pulleys.length; i++) {
		const p = this.pulleys[i];
		p.adjustRopesLengths();
	}
}
PHX.prototype.handleMovement = function () {
	// Polygons.
	for (var i = 0; i < this.polygons.length; i++) {
		var p = this.polygons[i];
		p.position.add(p.velocity);
		p.orientation += p.angularVelocity;
		// DEBGUG START.
		//Render center of mass.
		window.debugRender.addCross(p.position, 0.1, new Vec3(0,1,0));
		// Render first corner.
		window.debugRender.addCross(
			Vec2.add(
				p.position,
				Vec2.rotate(p.geometry[0][0].position, p.orientation)
			),
			0.1, new Vec3(0,1,1), 2
		);
		// DEBUG END
	}
	// Fixed constraints.
	for (let i = 0; i < this.fixedConstraints.length; i++) {
		const fc = this.fixedConstraints[i];
		fc.worldPosition.add(fc.velocity);
	}
}
PHX.prototype.handleCollisionResolutionByDisplacement = function () {
	//
	this.updateNormals();
	//
	for (let i = 0; i < this.collisionResolutionDisplacementPrecision; i++) {
		// -Resolve by displacement-
		// Fixed constraint.
		for (let j = 0; j < this.fixedConstraints.length; j++) {
			const fc = this.fixedConstraints[j];
			fc.resolveByDisplacement();
		}
		// Hinge constraint.
		for (let j = 0; j < this.hingeConstraints.length; j++) {
			const hc = this.hingeConstraints[j];
			hc.resolveByDisplacement();
		}
		// Polyons.
		if(window.newMethod){
			for (let node = this.contactList.first; node != null; node = node.next) {
				if (node.content.isA) { // REMEMBER ENABLE DISABLE COLLISION CHECK!!!!!!!!!
					node.content.contactPoint.updateVertexWorldPositionOfCorners();
					node.content.contactPoint.resolveByDisplacementA();
				}else{
					node.content.contactPoint.updateVertexWorldPositionOfCorners();
					node.content.contactPoint.resolveByDisplacementB();
				}
			}
		}else{
			for (let j = 0; j < this.collisionGroups.length; j++) {
				const cg = this.collisionGroups[j];
				cg.resolveByDisplacement();
			}
		}
	}
}
PHX.prototype.handleCollisionResolutionByImpulse = function () {
	// -Prepare-
	// Reset normal impulse measurer.
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		cg.calculateIfStaticOrDynamicFriction();
	}
	//
	this.updateContactPoints();
	// Reset friction meter.
	
	// -Resolve by impulse-
	//
	/*for (let j = 0; j < this.collisionGroups.length; j++) {
		const cg = this.collisionGroups[j];
		cg.countBouncing();
	}*/
	// Sort contact points by displacement.
	/*for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		cg.sortContactPointsByDisplacement();
	}*/
	// Apply impulse and calculate compensators.
	if(physicsSimulator.animator.phx.tick == 169){
		//debugger;
	}
	// Hinge and fixed friction must be dealt with in a special way due to energy conservation.
	for (let i = 0; i < 4; i++) {
		// Hinge friction.
		for (let j = 0; j < this.hingeConstraints.length; j++) {
			const hc = this.hingeConstraints[j];
			hc.resolveByFriction();
		}
		for (let j = this.hingeConstraints.length-1; j >= 0; j--) {
			const hc = this.hingeConstraints[j];
			hc.resolveByFriction();
		}
		// Fixed friction.
		for (let j = 0; j < this.fixedConstraints.length; j++) {
			const f = this.fixedConstraints[j];
			f.resolveByFriction();
		}
		for (let j = this.fixedConstraints.length-1; j >= 0; j--) {
			const f = this.fixedConstraints[j];
			f.resolveByFriction();
		}
	}
	for (let i = 0; i < this.collisionResolutionImpulsePrecision; i++) {
		var isLastIteration = this.collisionResolutionImpulsePrecision == i+1;
		// Fixed constraints.
		for (let j = 0; j < this.fixedConstraints.length; j++) {
			const fc = this.fixedConstraints[j];
			fc.resolveByImpulse();
		}
		// Hinge constraints.
		for (let j = 0; j < this.hingeConstraints.length; j++) {
			const hc = this.hingeConstraints[j];
			hc.resolveByImpulse();
		}
		// Polygon normal forces.
		if(window.newMethod){
			for (let node = this.contactList.first; node != null; node = node.next) {
				if (node.content.isA) { // REMEMBER ENABLE DISABLE COLLISION CHECK!!!!!!!!!
					node.content.contactPoint.resolveByImpulseNormalA(isLastIteration);
				}else{
					node.content.contactPoint.resolveByImpulseNormalB(isLastIteration);
				}
			}
		}else{
			for (let j = 0; j < this.collisionGroups.length; j++) {
				const cg = this.collisionGroups[j];
				cg.resolveByImpulseNormal(isLastIteration);
			}
		}
		// Pulleys.
		this.handleAdjustPulleys();
		// Ropes.
		for (let j = 0; j < this.ropes.length; j++) {
			const r = this.ropes[j];
			r.resolveByImpulse();
		}
	}
	for (let i = 0; i < this.collisionResolutionImpulsePrecision; i++) {
		// Polygons friction forces. Friction must be calculated after normal forces to know what magnitude of friction to apply.
		if(window.newMethod){
			for (let node = this.contactList.first; node != null; node = node.next) {
				if (node.content.isA) {
					node.content.contactPoint.resolveByImpulseFrictionA();
				}else{
					node.content.contactPoint.resolveByImpulseFrictionB();
				}
			}
		}else{
			for (let j = 0; j < this.collisionGroups.length; j++) {
				const cg = this.collisionGroups[j];
				cg.resolveByImpulseFriction();
			}
		}
	}
}
PHX.prototype.updateContactPoints = function () {
	// Calculate contact points.
	for (let i = 0; i < this.hingeConstraints.length; i++) {
		const hc = this.hingeConstraints[i];
		hc.calculateContactPoint();
	}
	for (let i = 0; i < this.fixedConstraints.length; i++) {
		const fc = this.fixedConstraints[i];
		fc.calculateContactPoint();
	}
}
PHX.prototype.updateNormals = function () {
	// Calculate normals
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		cg.calculateNormals();
	}
}
PHX.prototype.measureCollisionError = function () {
	// -Polygons-
	// Normal direction.
	if(window.newMethod){
		for (let node = this.contactList.first; node != null; node = node.next) {
			if (node.content.isA) { // REMEMBER ENABLE DISABLE COLLISION CHECK!!!!!!!!!
				node.content.contactPoint.calculateCompensatorNormalA();
			}else{
				node.content.contactPoint.calculateCompensatorNormalB();
			}
		}
	}else{
		for (let j = 0; j < this.collisionGroups.length; j++) {
			const cg = this.collisionGroups[j];
			cg.calculateCompensatorNormal();
		}
	}
	// Tangent direction.
	if(window.newMethod){
		for (let node = this.contactList.first; node != null; node = node.next) {
			if (node.content.isA) { // REMEMBER ENABLE DISABLE COLLISION CHECK!!!!!!!!!
				node.content.contactPoint.calculateCompensatorFrictionA();
			}else{
				node.content.contactPoint.calculateCompensatorFrictionB();
			}
		}
	}else{
		for (let j = 0; j < this.collisionGroups.length; j++) {
			const cg = this.collisionGroups[j];
			cg.calculateCompensatorFriction();
		}
	}
	// -Fixed constraints-
	for (let i = 0; i < this.fixedConstraints.length; i++) {
		const fc = this.fixedConstraints[i];
		fc.calculateCompensator();
	}
	// -Hinge constraints-
	for (let i = 0; i < this.hingeConstraints.length; i++) {
		const fc = this.hingeConstraints[i];
		fc.calculateCompensator();
	}
}
PHX.prototype.handleCollisionDetection = function () {
	
	// Calculate vertex world positions.
	for (var i = 0; i < this.polygons.length; i++) {
		var p = this.polygons[i];
		p.updateVertexWorldPositions();
	}

	// Calculate shadow displacement. This new displacement will also affect the collision boxeses size.
	/*for (var i = 0; i < this.collisionGroups.length; i++) {
		var cg = this.collisionGroups[i];
		cg.calculateNewShadowDisplacement();
	}*/

	// Calculate shadow position.
	for (var i = 0; i < this.collisionGroups.length; i++) {
		var cg = this.collisionGroups[i];
		if(cg.polygonA.id == 87 && cg.polygonB.id == 181 && this.tick >= 478){
			//debugger;
		}
		cg.calculateShadowMatrices();
	}

	// Discard potential shadows that are worse than the current shaddow.
	/*for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		cg.tryDiscardPotentialShaddow();
	}*/
	//
	for (let i = 0; i < this.polygons.length; i++) {
		const p = this.polygons[i];
		if((p.id == 49 || p.id == 60) && this.tick >= 121){
			//debugger;
		}
		p.calculateCollisionBoxes();
		p.expandCollisionBoxesByShadows();
	}
	
	// -Polygon collision box detection-
	// Detect old collisions ending.
	for (var i = 0; i < this.collisionGroups.length; i++) {
		var cg = this.collisionGroups[i];
		if(!Polygon.collisionBoxesAreColliding(cg.polygonA, cg.polygonB) && (cg.numberOfContacts == 0 || !cg.enableCollision)){
			cg.delete();
		}
	}
	// Detect new Collisions starting.
	for (var i = 0; i < this.polygons.length; i++) {
		var pA = this.polygons[i];
		for (var j = i+1; j < this.polygons.length; j++) {
			var pB = this.polygons[j];
			if(Polygon.collisionBoxesAreColliding(pA, pB) && !Polygon.collisionBoxCollidingIsDetected(pA, pB)){
				var newCG = new CollisionGroup(pA, pB, this);
				newCG.phx = this;
				newCG.spawnTime = this.tick;
				pA.collisionGroups.push(newCG);
				pB.collisionGroups.push(newCG);
				this.collisionGroups.push(newCG);
			}
		}
	}

	// Collision groups collision box detection.
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		if(cg.polygonA.id == 49 && cg.polygonB.id == 60 && this.tick >= 121){
			//debugger;
		}
		cg.handleCollisionBoxDetection();
	}

	// 
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		if(cg.polygonA.id == 2 && cg.polygonB.id == 4 && this.tick >= 1){
			//debugger;
		}
		cg.calculateShadowWorldPositions();
	}

	// DEBUG START
	for (let i = 0; i < this.collisionGroups.length*0; i++) {
		var cg = this.collisionGroups[i];
		for (let j = 0; j < cg.contactPoints.length; j++) {
			var cpA = cg.contactPoints[j];
			physicsSimulator.cpA = cpA;
			for (let k = j+1; k < cg.contactPoints.length; k++) {
				var cpB = cg.contactPoints[k];
				physicsSimulator.cpB = cpB;

				if(window.sub == null){
					window.sub = 0;
				}
				window.sub++;
				if(window.sub == 1){
					//debugger;
				}


				if (
					Tool.segmentsIntersectInclusive(
						cpA.shadowVertexA, cpA.shadowNextVertexA,
						cpA.shadowVertexB, cpA.shadowNextVertexB,
					) ||
					Tool.segmentsIntersectInclusive(
						cpB.shadowVertexA, cpB.shadowNextVertexA,
						cpB.shadowVertexB, cpB.shadowNextVertexB,
					)
				){
					if(physicsSimulator.test == null){
						physicsSimulator.test = 0;
					}
					if(physicsSimulator.testCG != cg){
						physicsSimulator.test++;
					}
					if(physicsSimulator.test == 1){
						debugger;
					}
					physicsSimulator.testCG = cg;
				}
			}
		}
	}
	// DEBUG END

	// Collision groups contact point detection.
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		if(cg.polygonA.id == 21 && cg.polygonB.id == 70 && this.tick >= 39){
			//debugger;
		}
		cg.handleContactPointDetection();
	}
	

	// DEBUG START
	// Shaddow.
	for (let i = 0; i < this.polygons.length; i++) {
		const c = this.polygons[i].geometry[0];
		var corners = [];
		for (let j = 0; j < c.length; j++) {
			const vertex = c[j];
			if(vertex.testPos == null){
				continue;
			}
			corners.push(vertex.testPos);
		}
		window.debugRender.addMultiLines (corners, true, new Vec3(1,1,1));
	}

	// Potential shaddow.
	for (let i = 0; i < this.polygons.length; i++) {
		const c = this.polygons[i].geometry[0];
		var corners = [];
		for (let j = 0; j < c.length; j++) {
			const vertex = c[j];
			if(vertex.testPotentialShaddow == null){
				continue;
			}
			corners.push(vertex.testPotentialShaddow);
		}
		window.debugRender.addMultiLines (corners, true, new Vec3(0,1,0));
	}

	// DEBUG END

	// Attempt to optimize shaddow.
	if(physicsSimulator.tick == 34){
		//debugger;
	}
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		
		if(cg.polygonA.id == 0 && cg.polygonB.id == 5 && this.tick >= 299){
			//debugger;
		}
		cg.attemptOptimizeShadow();
	}

	// Save previous coordinates.
	for (var i = 0; i < this.polygons.length; i++) {
		var p = this.polygons[i];
		p.savePreviousCoordinates();
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.phx', true);