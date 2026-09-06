
function CollisionGroup(polygonA, polygonB, phx){

	this.polygonA = polygonA;
	this.polygonB = polygonB;
	this.phx = phx;

	this.contactPoints = [];

	this.spawnTime;

	this.numberOfContacts = 0;
	this.previousNumberOfContacts = 0;

	// Collsion resolution.
	// Records of normal impulses. Sum of all the normal forces applied over all contact points this tick.
	this.previousSumOfnormalImpulsesA;
	this.previousSumOfnormalImpulsesB;
	this.sumOfnormalImpulsesA = 0;
	this.sumOfnormalImpulsesB = 0;

	this.sumOffrictionImpulsesA;
	this.sumOffrictionImpulsesB;

	this.isStaticFrictionA;
	this.isStaticFrictionB;

	// Shadow related.
	this.shadowOrientationA = this.polygonA.previousOrientation; // What is the orientation of the shadow version of A.
	this.shadowOrientationB = this.polygonB.previousOrientation;
	
	this.shadowDisplacement = Vec2.sub(this.polygonB.previousPosition, this.polygonA.previousPosition); // What is the translational displacement between A and B. The displacement describes B's position relative to A's position.

	// What is the position and orientation of the shadow used during this collision detection.
	// DEBUG START
	/*this.shadowMatrixA = Matrix3D.getRotation(this.polygonA.previousOrientation);
	this.shadowMatrixA = Matrix3D.translate(this.shadowMatrixA, this.polygonA.previousPosition);
	this.shadowMatrixB = Matrix3D.getRotation(this.polygonB.previousOrientation);
	this.shadowMatrixB = Matrix3D.translate(this.shadowMatrixB, this.polygonB.previousPosition);*/
	// DEBUG END

	this.calculatedShadowPositionA = this.polygonA.previousPosition;
	this.calculatedShadowPositionB = this.polygonB.previousPosition;
	this.calculatedShadowOrientationA = this.polygonA.previousOrientation;
	this.calculatedShadowOrientationB = this.polygonB.previousOrientation;

	this.potentialShadowPositionA = this.polygonA.previousPosition;
	this.potentialShadowPositionB = this.polygonB.previousPosition;
	this.potentialShadowOrientationA = this.polygonA.previousOrientation;
	this.potentialShadowOrientationB = this.polygonB.previousOrientation;

	/*this.newShadowDisplacementA = new Vec2();
	this.newShadowDisplacementB = new Vec2();*/

	this.collisionMargin = 0.001;

	// Compensators.
	//this.compensatorVelocity = new Vec2(); // How B is relative to A.
	//this.compensatorAngularVelocityA = 0;
	//this.compensatorAngularVelocityB = 0;

	//this.potentialCompensatorVelocity;
	//this.potentialCompensatorAngularVelocityA;
	//this.potentialCompensatorAngularVelocityB;

	// Collision flags.
	this.enableCollision;

	if (this.polygonA.isStatic && this.polygonB.isStatic) {
		this.enableCollision = false;
	}else{
		this.enableCollision = true;
		for (let i = 0; i < this.polygonA.hingeConstraints.length; i++) {
			const hc = this.polygonA.hingeConstraints[i];
			if(hc.polygonA == this.polygonB || hc.polygonB == this.polygonB){
				this.enableCollision = false;
			}
		}
	}

	/*var indexA = 0;
	var indexB = 0;
	// The flags are sorted smallest to largest.
	var fA = this.polygonA.collisionFlags[indexA];
	var fB = this.polygonB.collisionFlags[indexB];
	while(fA != null && fB != null){
		if(fA == fB){
			this.enableCollision = true;
			break;
		}else if(fA > fB){
			indexB++;
			fB = this.polygonB.collisionFlags[indexB];
		}else{
			indexA++;
			fA = this.polygonA.collisionFlags[indexA];
		}
	}*/

	// DEBUG START
	this.polygonA.debugMark = true;
	this.polygonB.debugMark = true;
	// DEBUG END
}
CollisionGroup.prototype.handleCollisionBoxDetection = function () {
	if(!this.enableCollision){
		return;
	}
	// -Collision boxes-
	// Detect old collisions ending.
	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		if(!Vertex.collisionBoxesAreColliding(cp.vertexA, cp.vertexB)){
			if(--cp.lifeTime <= 0 || true){
				cp.delete();
				i--;
			}
		}
	}
	// Detect new Collisions starting.
	for (let i = 0; i < this.polygonA.geometry.length; i++) {
		const cA = this.polygonA.geometry[i]; // Circumference to this.polygonA.
		for (let j = 0; j < cA.length; j++) {
			const vertexA = cA[j];
			for (let k = 0; k < this.polygonB.geometry.length; k++) {
				const cB = this.polygonB.geometry[k]; // Circumference to this.polygonB.
				for (let l = 0; l < cB.length; l++) {
					const vertexB = cB[l];
					if(Vertex.collisionBoxesAreColliding(vertexA, vertexB) && !Vertex.collisionBoxCollidingIsDetected(vertexA, vertexB)){
						var newCP = new ContactPoint(
							vertexA,
							vertexB,
							(j == cA.length-1? cA[0]: cA[j+1]),
							(l == cB.length-1? cB[0]: cB[l+1]),
						);
						newCP.collisionGroup = this;
						vertexA.contactPoints.push(newCP);
						vertexB.contactPoints.push(newCP);
						this.contactPoints.push(newCP);
					}
				}
			}
		}
	}
}
CollisionGroup.prototype.handleContactPointDetection = function () {
	if(!this.enableCollision){
		return;
	}

	// This does collision detection between polygonA and polygonB.

	// Reset before the contact points increase this value again.
	this.previousNumberOfContacts = this.numberOfContacts;
	this.numberOfContacts = 0;

	// Contact points collision detection.
	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.handleCollisionDetection();
	}

	// Attempt to optimize the shadow.
	/*for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.handleCollisionDetection();
	}*/
}
CollisionGroup.prototype.calculateShadowWorldPositions = function () {
	if(!this.enableCollision){
		return;
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];

		// Shadow for use this collision.
		cp.shadowVertexA = Vec2.rotate(cp.vertexA.position, this.calculatedShadowOrientationA).add(this.calculatedShadowPositionA);
		cp.shadowVertexB = Vec2.rotate(cp.vertexB.position, this.calculatedShadowOrientationB).add(this.calculatedShadowPositionB);

		cp.shadowNextVertexA = Vec2.rotate(cp.nextVertexA.position, this.calculatedShadowOrientationA).add(this.calculatedShadowPositionA);
		cp.shadowNextVertexB = Vec2.rotate(cp.nextVertexB.position, this.calculatedShadowOrientationB).add(this.calculatedShadowPositionB);

		// DEBUG START
		/*cp.shadowVertexA = Matrix3D.multiplyVector2Right(this.shadowMatrixA, cp.vertexA.position);
		cp.shadowVertexB = Matrix3D.multiplyVector2Right(this.shadowMatrixB, cp.vertexB.position);

		cp.shadowNextVertexA = Matrix3D.multiplyVector2Right(this.shadowMatrixA, cp.nextVertexA.position);
		cp.shadowNextVertexB = Matrix3D.multiplyVector2Right(this.shadowMatrixB, cp.nextVertexB.position);*/
		// DEBUG END

		// New potential shadow.
		
		cp.potentialShadowVertexA = Vec2.rotate(cp.vertexA.position, this.potentialShadowOrientationA).add(this.potentialShadowPositionA);
		cp.potentialShadowVertexB = Vec2.rotate(cp.vertexB.position, this.potentialShadowOrientationB).add(this.potentialShadowPositionB);

		cp.potentialShadowNextVertexA = Vec2.rotate(cp.nextVertexA.position, this.potentialShadowOrientationA).add(this.potentialShadowPositionA);
		cp.potentialShadowNextVertexB = Vec2.rotate(cp.nextVertexB.position, this.potentialShadowOrientationB).add(this.potentialShadowPositionB);

		// DEBUG START
		/*cp.potentialShadowVertexA = Vec2.add(cp.vertexA.worldPosition, this.newShadowDisplacementA);
		cp.potentialShadowVertexB = Vec2.add(cp.vertexB.worldPosition, this.newShadowDisplacementB);
		
		cp.potentialShadowNextVertexA = Vec2.add(cp.nextVertexA.worldPosition, this.newShadowDisplacementA);
		cp.potentialShadowNextVertexB = Vec2.add(cp.nextVertexB.worldPosition, this.newShadowDisplacementB);*/
		// DEBUG END

		// DEBUG START.
		if(this.polygonA.id != 36 || this.polygonB.id != 45){
			//continue;
		}
		cp.vertexA.testPotentialShaddow = cp.potentialShadowVertexA;
		cp.vertexB.testPotentialShaddow = cp.potentialShadowVertexB;
		cp.nextVertexA.testPotentialShaddow = cp.potentialShadowNextVertexA;
		cp.nextVertexB.testPotentialShaddow = cp.potentialShadowNextVertexB;
		// DEBUG END.
	}
}
CollisionGroup.prototype.calculateShadowMatrices = function () {
	if(!this.enableCollision){
		return;
	}

	var centerOfMass = Vec2.mul(this.polygonA.position, this.polygonA.mass).add(Vec2.mul(this.polygonB.position, this.polygonB.mass)).div(this.polygonA.mass + this.polygonB.mass);

	// -Calculate current shadow matrix-

	// Calculate a rotated version of the shadow that fits the current position and orientation of the polygons.
	// What is the orientation of the shadow?
	var invInertiaSum = 1 / (this.polygonA.momentOfInertia + this.polygonB.momentOfInertia);
	var direction =
		this.shadowOrientationB - this.shadowOrientationA +
		this.polygonA.orientation - this.polygonB.orientation;

	// Make sure direction is between -Math.PI and Math.PI.
	if(direction > 0){
		direction -= Math.floor((direction + Math.PI) / Math.PI / 2) * Math.PI * 2;
	}else{
		direction -= Math.ceil((direction - Math.PI) / Math.PI / 2) * Math.PI * 2;
	}

	var shadowOrientationA = this.polygonA.orientation - direction * this.polygonB.momentOfInertia * invInertiaSum; // Where, relative to A's current orientation, is A's shadow orientation.
	var shadowOrientationB = this.polygonB.orientation + direction * this.polygonA.momentOfInertia * invInertiaSum;

	// What is the displacement of the shadow?
	var displacement = Vec2.rotate(this.shadowDisplacement, shadowOrientationA - this.shadowOrientationA); // Where is B's position as seen from A's position.
	
	var invMass = 1 / (this.polygonA.mass + this.polygonB.mass);
	var shadowPositionA = Vec2.mul(displacement,
		-this.polygonB.mass * invMass
	).add(centerOfMass);
	var shadowPositionB = Vec2.mul(displacement,
		this.polygonA.mass * invMass
	).add(centerOfMass);

	// Calculated shadow.
	this.calculatedShadowPositionA = shadowPositionA;
	this.calculatedShadowPositionB = shadowPositionB;
	this.calculatedShadowOrientationA = shadowOrientationA;
	this.calculatedShadowOrientationB = shadowOrientationB;

	// potential shadows.
	var randPos1 = this.phx.random.getNext();
	/*var randPos2;
	if(randPos1 < 0.5){
		randPos2 = randPos1 - 2 * randPos1 * this.phx.random.getNext();
	}else{
		randPos2 = (1-0) - 2 * (1-0) * this.phx.random.getNext();
	}*/
	var maxRand2 = Math.sqrt(0.25 - (randPos1-0.5)*(randPos1-0.5));
	randPos2 = 2 * maxRand2 * this.phx.random.getNext() - maxRand2;

	var randOri = this.phx.random.getNext();
	// A.
	var difference = Vec2.sub(this.calculatedShadowPositionA, this.polygonA.position);
	this.potentialShadowPositionA = Vec2.add(
		this.polygonA.position,
		Vec2.mul(
			difference,
			randPos1
		)
	).add(
		difference.rotate90Clockwise().mul(randPos2)
	);
	this.potentialShadowOrientationA = this.polygonA.orientation + (this.calculatedShadowOrientationA - this.polygonA.orientation) * randOri;
	// B.
	var difference = Vec2.sub(this.calculatedShadowPositionB, this.polygonB.position);
	this.potentialShadowPositionB = Vec2.add(
		this.polygonB.position,
		Vec2.mul(
			difference,
			randPos1
		)
	).add(
		difference.rotate90Clockwise().mul(randPos2)
	);
	this.potentialShadowOrientationB = this.polygonB.orientation + (this.calculatedShadowOrientationB - this.polygonB.orientation) * randOri;

	// DEUBG START
	/*this.shadowMatrixA = Matrix3D.getRotation(shadowOrientationA);
	this.shadowMatrixA = Matrix3D.translate(this.shadowMatrixA, shadowPositionA);

	this.shadowMatrixB = Matrix3D.getRotation(shadowOrientationB);
	this.shadowMatrixB = Matrix3D.translate(this.shadowMatrixB, shadowPositionB);*/
	// DEBUGEND

	// Store this displacement of the contact points.
	/*for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.shadowVertexA = Vec2.rotate(cp.vertexA.position, shadowOrientationA).add(shadowPositionA);
		cp.shadowNextVertexA = Vec2.rotate(cp.nextVertexA.position, shadowOrientationA).add(shadowPositionA);
		cp.shadowVertexB = Vec2.rotate(cp.vertexB.position, shadowOrientationB).add(shadowPositionB);
		cp.shadowNextVertexB = Vec2.rotate(cp.nextVertexB.position, shadowOrientationB).add(shadowPositionB);
	}*/
	// DEBUG START
	if(this.polygonA.id != 2 || this.polygonB.id != 4){
		//return;
	}
	for (let i = 0; i < this.polygonA.geometry.length; i++) {
		const c = this.polygonA.geometry[i];
		for (let j = 0; j < c.length; j++) {
			const vertex = c[j];
			vertex.testPos = Vec2.rotate(vertex.position, shadowOrientationA).add(shadowPositionA);
		}
	}
	for (let i = 0; i < this.polygonB.geometry.length; i++) {
		const c = this.polygonB.geometry[i];
		for (let j = 0; j < c.length; j++) {
			const vertex = c[j];
			vertex.testPos = Vec2.rotate(vertex.position, shadowOrientationB).add(shadowPositionB);
		}
	}
	// DEBUG END
}
CollisionGroup.prototype.attemptOptimizeShadow = function () {
	if(!this.enableCollision){
		return;
	}

	// If no collision happened, the shadow will be updated from the current position.
	if(this.numberOfContacts == 0){
		this.shadowOrientationA = this.polygonA.orientation;
		this.shadowOrientationB = this.polygonB.orientation;
		
		this.shadowDisplacement = Vec2.sub(this.polygonB.position, this.polygonA.position);
		return;
	}
	
	// If movement from the shadow, to the new potential overlaps, the attempt to optimize the shadow failed.
	
	if(physicsSimulator.tick == 18){
		//debugger;
	}
	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		if(cp.potentialShadowsCollides()){
			return;
		}
	}

	this.shadowDisplacement = Vec2.sub(this.potentialShadowPositionB, this.potentialShadowPositionA);
	this.shadowOrientationA = this.potentialShadowOrientationA;
	this.shadowOrientationB = this.potentialShadowOrientationB;
	/*
	var newShadowDisplacement = Vec2.add(this.polygonB.position, this.newShadowDisplacementB).sub(this.polygonA.position).sub(this.newShadowDisplacementA);

	// The attempt is successful, so the potential shadow is made the shaddow in use.
	this.shadowOrientationA = this.polygonA.orientation; // Polygon A has the same orientation as the potential shaddow.
	this.shadowOrientationB = this.polygonB.orientation;
	
	this.shadowDisplacement = newShadowDisplacement;*/
}
CollisionGroup.prototype.calculateIfStaticOrDynamicFriction = function () {
	var staticFrictionConstant = this.polygonA.staticFrictionConstant * this.polygonB.staticFrictionConstant;

	this.isStaticFrictionA = staticFrictionConstant * this.sumOfnormalImpulsesA > this.sumOffrictionImpulsesA;
	this.isStaticFrictionB = staticFrictionConstant * this.sumOfnormalImpulsesB > this.sumOffrictionImpulsesB;

	// Reset sums.
	this.previousSumOfnormalImpulsesA = this.sumOfnormalImpulsesA;
	this.previousSumOfnormalImpulsesB = this.sumOfnormalImpulsesB;
	this.sumOfnormalImpulsesA = 0;
	this.sumOfnormalImpulsesB = 0;

	this.sumOffrictionImpulsesA = 0;
	this.sumOffrictionImpulsesB = 0;

	for (let j = 0; j < this.contactPoints.length; j++) {
		const cp = this.contactPoints[j];
		cp.normalImpulseA = 0;
		cp.normalImpulseB = 0;
		cp.frictionImpulseA = 0;
		cp.frictionImpulseB = 0;
	}
}
CollisionGroup.prototype.calculateCompensatorNormal = function () {
	if(!this.enableCollision){
		return;
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.calculateCompensatorNormalA();
		cp.calculateCompensatorNormalB();
	}
}
CollisionGroup.prototype.calculateCompensatorFriction = function () {
	if(!this.enableCollision){
		return;
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.calculateCompensatorFrictionA();
		cp.calculateCompensatorFrictionB();
	}
}
CollisionGroup.prototype.countBouncing = function () {
	// Count bouncing.
	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.countBouncing();
	}
}
CollisionGroup.prototype.resolveByImpulseNormal = function (isLastIteration) {
	if(!this.enableCollision){
		return;
	}

	// Apply impulse.
	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.resolveByImpulseNormalA(isLastIteration);
		cp.resolveByImpulseNormalB(isLastIteration);
	}
}
CollisionGroup.prototype.resolveByImpulseFriction = function () {
	if(!this.enableCollision){
		return;
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.resolveByImpulseFrictionA();
		cp.resolveByImpulseFrictionB();
	}
}
CollisionGroup.prototype.resolveByDisplacement = function () {
	if(!this.enableCollision){
		return;
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.updateVertexWorldPositionOfCorners();
		cp.resolveByDisplacementA();
		cp.resolveByDisplacementB();
	}
}
CollisionGroup.prototype.measureCollisionResolutionError = function () {
	if(!this.enableCollision){
		return;
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.measureCollisionResolutionError();
	}
}
CollisionGroup.prototype.calculateNormals = function () {
	if(!this.enableCollision){
		return;
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		cp.calculateNormals();
	}
}
CollisionGroup.prototype.sortContactPointsByDisplacement = function () {
	this.contactPoints.sort(function(cpA,cpB){
		var a = -Infinity;
		var b = -Infinity;
		if (cpA.cornerAIsColliding) {
			a = cpA.collisionTimeA;
			if (cpA.cornerBIsColliding) {
				// If both are true, use mean.
				a = (a + cpA.collisionTimeB) * 0.5;
			}
		}else if(cpA.cornerBIsColliding){
			a = cpA.collisionTimeB;
		}
		if (cpB.cornerAIsColliding) {
			b = cpB.collisionTimeA;
			if (cpB.cornerBIsColliding) {
				// If both are true, use mean.
				b = (b + cpB.collisionTimeB) * 0.5;
			}
		}else if(cpB.cornerBIsColliding){
			b = cpB.collisionTimeB;
		}
		
		return a > b;
	});
}
CollisionGroup.prototype.isFrictionless = function () {
	// Return true if the collision perfectly conserves energy.
	// Bouncing.
	var bounceFactor = this.polygonA.bounceFactor * this.polygonB.bounceFactor;
	if (bounceFactor < 1-1e-10) {
		return false;
	}
	// Sliding.
	var frictionFactor = this.polygonA.staticFrictionConstant * this.polygonB.staticFrictionConstant;
	if (frictionFactor > 1e-10) {
		return false;
	}
	// Constraints.
	if (
		this.polygonA.fixedConstraints.length > 0 ||
		this.polygonB.fixedConstraints.length > 0 ||
		this.polygonA.hingeConstraints.length > 0 ||
		this.polygonB.hingeConstraints.length > 0 ||
		this.polygonA.ropes.length > 0 ||
		this.polygonB.ropes.length > 0
	) {
		return false;
	}

	return true;
}
CollisionGroup.prototype.getForceVectors = function (polygon) {

	/*
	Format:
	{
		"normalForces": [
			...,
			{
				"point": point,
				"force": force,
			},
			...,
		],
		"frictionForces": [
			...
			{
				"point": point,
				"force": force,
			},
			...,
		],
	}
	*/

	var polygonIsA = this.polygonIsA(polygon);

	var normalForces = [];
	var frictionForces = [];
	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];

		cp.calculateNormals();

		// A.
		if(cp.applyImpulseA){
			cp.vertexA.updateVertexWorldPosition();
			// Normal.
			var normalForce = Vec2.mul(cp.normalA, cp.normalImpulseA);
			if(!polygonIsA){
				normalForce.neg();
			}
			normalForces.push({
				"point": cp.vertexA.worldPosition,
				"force": normalForce,
			});
			// Friction.
			var frictionForce = Vec2.mul(cp.tangentA, cp.frictionImpulseA);
			if(!polygonIsA){
				frictionForce.neg();
			}
			frictionForces.push({
				"point": cp.vertexA.worldPosition,
				"force": frictionForce,
			});
		}

		// B.
		if(cp.applyImpulseB){
			cp.vertexB.updateVertexWorldPosition();
			// Normal.
			var normalForce = Vec2.mul(cp.normalB, cp.normalImpulseB);
			if(polygonIsA){
				normalForce.neg();
			}
			normalForces.push({
				"point": cp.vertexB.worldPosition,
				"force": normalForce,
			});
			// Friction.
			var frictionForce = Vec2.mul(cp.tangentB, cp.frictionImpulseB)
			if(polygonIsA){
				frictionForce.neg();
			}
			frictionForces.push({
				"point": cp.vertexB.worldPosition,
				"force": frictionForce,
			});
		}
	}

	return {
		"normalForces": normalForces,
		"frictionForces": frictionForces,
	};
}
CollisionGroup.prototype.delete = function () {

	var indexInA = this.polygonA.collisionGroups.indexOf(this);
	this.polygonA.collisionGroups.splice(indexInA, 1);

	var indexInB = this.polygonB.collisionGroups.indexOf(this);
	this.polygonB.collisionGroups.splice(indexInB, 1);

	var indexInPhx = this.phx.collisionGroups.indexOf(this);
	this.phx.collisionGroups.splice(indexInPhx, 1);

	while (this.contactPoints.length > 0) {
		const cp = this.contactPoints[0];
		cp.delete();
	}
}
CollisionGroup.prototype.polygonIsA = function (polygon) {
	if(this.polygonA == polygon){
		return true;
	}else{
		return false;
	}
}
CollisionGroup.prototype.getOther = function (polygon) {
	if(this.polygonA == polygon){
		return this.polygonB;
	}else{
		return this.polygonA;
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.collision_group', true);