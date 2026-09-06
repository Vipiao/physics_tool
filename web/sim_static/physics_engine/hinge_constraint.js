
function HingeConstraint (phx) {

	this.phx = phx;

	this.localPolygonPositionA;
	this.localPolygonPositionB;

	this.polygonA;
	this.polygonB;

	this.compensator = new Vec2();

	this.contactPoint;
	this.normal;

	this.friction = 0.01; // 1 is total friction, 0 is no friction.

	this.isDeleted = false;
}
HingeConstraint.prototype.delete = function () {
	if(this.isDeleted){
		return;
	}
	this.isDeleted = true;

	var index = this.phx.hingeConstraints.indexOf(this);
	this.phx.hingeConstraints.splice(index, 1);

	var index = this.polygonA.hingeConstraints.indexOf(this);
	this.polygonA.hingeConstraints.splice(index, 1);

	var index = this.polygonB.hingeConstraints.indexOf(this);
	this.polygonB.hingeConstraints.splice(index, 1);

	//this.polygonA.updateEnableCollision();
	//this.polygonB.updateEnableCollision();
}
HingeConstraint.prototype.attachPolygons = function (polygonA, polygonB, worldPositionA, worldPositionB) {
	this.polygonA = polygonA;
	this.polygonB = polygonB;
	this.polygonA.hingeConstraints.push(this);
	this.polygonB.hingeConstraints.push(this);

	this.localPolygonPositionA = this.polygonA.worldToLocalCoordinates(worldPositionA);
	this.localPolygonPositionB = this.polygonB.worldToLocalCoordinates(worldPositionB);
	this.calculateContactPoint();

	// Disable collision groups between the polygons.
	for (let i = 0; i < this.polygonA.collisionGroups.length; i++) {
		const cg = this.polygonA.collisionGroups[i];
		if (cg.getOther(this.polygonA) == this.polygonB) {
			cg.enableCollision = false;
		}
	}
}
HingeConstraint.prototype.calculateContactPoint = function () {
	var contactA = Vec2.rotate(this.localPolygonPositionA, this.polygonA.orientation).add(this.polygonA.position);
	var contactB = Vec2.rotate(this.localPolygonPositionB, this.polygonB.orientation).add(this.polygonB.position);
	this.contactPoint = Vec2.add(contactA, contactB).mul(0.5); // Contact point is average of the points of connection.
}
HingeConstraint.prototype.resolveByImpulse = function () {

	// PV = BV - AV + BR2 bv - AR2 av
	// DeltaPV = I / BM + I / AM + (BR ⊗ I / BI) BR2 + (AR ⊗ I / AI) AR2
	// ...
	// PV + DeltaPV = 0
	// BV - AV + BR2 bv - AR2 av + I / BM + I / AM + (BR ⊗ I / BI) BR2 + (AR ⊗ I / AI) AR2 = 0
	// ...
	// Alpha = -BR.y BW + BV.x + AR.y AW - AV.x
	// Beta = BR.x BW + BV.y - AR.x AW - AV.y
	// Gamma = BR.y*BR.y / BI + 1 / BM + AR.y*AR.y / AI + 1 / AM
	// Delta = BR.x*BR.x / BI + 1 / BM + AR.x*AR.x / AI + 1 / AM
	// Epsilon = -BR.x BR.y / BI - AR.x AR.y / AI
	// Zeta = Epsilon*Epsilon - Delta*Gamma
	// IX = (Beta*Epsilon - Alpha*Delta) / Zeta
	// IY = (Alpha*Epsilon - Beta*Gamma) / Zeta

	if (this.polygonA.isStatic && this.polygonB.isStatic) {
		return;
	}

	var rA = Vec2.sub(this.contactPoint, this.polygonA.position);
	var rB = Vec2.sub(this.contactPoint, this.polygonB.position);
	
	var alpha = this.polygonB.velocity.x - this.polygonA.velocity.x - rB.y * this.polygonB.angularVelocity + rA.y * this.polygonA.angularVelocity;
	var beta = this.polygonB.velocity.y - this.polygonA.velocity.y + rB.x * this.polygonB.angularVelocity - rA.x * this.polygonA.angularVelocity;
	var gamma;
	var delta;
	var epsilon;
	if (this.polygonA.isStatic && !this.polygonB.isStatic) {
		gamma = rB.y*rB.y / this.polygonB.momentOfInertia + 1 / this.polygonB.mass;
		delta = rB.x*rB.x / this.polygonB.momentOfInertia + 1 / this.polygonB.mass;
		epsilon = - rB.x*rB.y / this.polygonB.momentOfInertia;
	} else if (this.polygonB.isStatic && !this.polygonA.isStatic) {
		gamma = rA.y*rA.y / this.polygonA.momentOfInertia + 1 / this.polygonA.mass;
		delta = rA.x*rA.x / this.polygonA.momentOfInertia + 1 / this.polygonA.mass;
		epsilon = - rA.x*rA.y / this.polygonA.momentOfInertia;
	}else{
		gamma = rB.y*rB.y / this.polygonB.momentOfInertia + rA.y*rA.y / this.polygonA.momentOfInertia + 1 / this.polygonB.mass + 1 / this.polygonA.mass;
		delta = rB.x*rB.x / this.polygonB.momentOfInertia + rA.x*rA.x / this.polygonA.momentOfInertia + 1 / this.polygonB.mass + 1 / this.polygonA.mass;
		epsilon = - rB.x*rB.y / this.polygonB.momentOfInertia - rA.x*rA.y / this.polygonA.momentOfInertia;
	}
	var zeta = epsilon*epsilon - delta*gamma;
	
	var impulse = new Vec2(
		(beta*epsilon - alpha*delta) / (zeta),
		(alpha*epsilon - beta*gamma) / (zeta)
	);

	impulse.add(this.compensator);

	this.polygonA.applyImpulse(this.contactPoint, impulse);
	this.polygonB.applyImpulse(this.contactPoint, impulse.neg());
}
HingeConstraint.prototype.calculateCompensator = function () {

	if (this.polygonA.isStatic && this.polygonB.isStatic) {
		return;
	}

	// Rotate the compensator by the polygons change in orientation.
	var deltaAngle =
		(
			(this.polygonA.orientation - this.polygonA.previousOrientation) * this.polygonA.momentOfInertia +
			(this.polygonB.orientation - this.polygonB.previousOrientation) * this.polygonB.momentOfInertia
		) / (this.polygonA.momentOfInertia + this.polygonB.momentOfInertia);
	//this.compensator.rotate(deltaAngle);
	//

	var rA = Vec2.sub(this.contactPoint, this.polygonA.position);
	var rB = Vec2.sub(this.contactPoint, this.polygonB.position);
	
	var alpha = this.polygonB.velocity.x - this.polygonA.velocity.x - rB.y * this.polygonB.angularVelocity + rA.y * this.polygonA.angularVelocity;
	var beta = this.polygonB.velocity.y - this.polygonA.velocity.y + rB.x * this.polygonB.angularVelocity - rA.x * this.polygonA.angularVelocity;
	var gamma;
	var delta;
	var epsilon;
	if (this.polygonA.isStatic && !this.polygonB.isStatic) {
		gamma = rB.y*rB.y / this.polygonB.momentOfInertia + 1 / this.polygonB.mass;
		delta = rB.x*rB.x / this.polygonB.momentOfInertia + 1 / this.polygonB.mass;
		epsilon = - rB.x*rB.y / this.polygonB.momentOfInertia;
	} else if (this.polygonB.isStatic && !this.polygonA.isStatic) {
		gamma = rA.y*rA.y / this.polygonA.momentOfInertia + 1 / this.polygonA.mass;
		delta = rA.x*rA.x / this.polygonA.momentOfInertia + 1 / this.polygonA.mass;
		epsilon = - rA.x*rA.y / this.polygonA.momentOfInertia;
	}else{
		gamma = rB.y*rB.y / this.polygonB.momentOfInertia + rA.y*rA.y / this.polygonA.momentOfInertia + 1 / this.polygonB.mass + 1 / this.polygonA.mass;
		delta = rB.x*rB.x / this.polygonB.momentOfInertia + rA.x*rA.x / this.polygonA.momentOfInertia + 1 / this.polygonB.mass + 1 / this.polygonA.mass;
		epsilon = - rB.x*rB.y / this.polygonB.momentOfInertia - rA.x*rA.y / this.polygonA.momentOfInertia;
	}
	var zeta = epsilon*epsilon - delta*gamma;
	
	var impulse = new Vec2(
		(beta*epsilon - alpha*delta) / (zeta),
		(alpha*epsilon - beta*gamma) / (zeta)
	);

	this.compensator.add(impulse);

	//this.compensator.mul(0.99);

	window.debugRender.addVector(
		Vec2.mul(this.compensator, 100),
		this.contactPoint,
		new Vec3(0,1,1)
	);
}
HingeConstraint.prototype.resolveByFriction = function () {
	
	if (this.polygonA.isStatic && this.polygonB.isStatic) {
		return;
	}
	
	var relVel = this.polygonB.angularVelocity - this.polygonA.angularVelocity;
	var collisionMass;
	if (this.polygonA.isStatic) {
		collisionMass = this.polygonB.momentOfInertia;
	}else if (this.polygonB.isStatic) {
		collisionMass = this.polygonA.momentOfInertia;
	}else{
		collisionMass = 1/(1/this.polygonA.momentOfInertia + 1/this.polygonB.momentOfInertia);
	}
	var i = relVel * collisionMass;
	
	i *= this.friction;

	if (!this.polygonA.isStatic) {
		this.polygonA.angularVelocity += i / this.polygonA.momentOfInertia;
	}
	if (!this.polygonB.isStatic) {
		this.polygonB.angularVelocity -= i / this.polygonB.momentOfInertia;
	}
}
HingeConstraint.prototype.resolveByDisplacement = function () {

	if (this.polygonA.isStatic && this.polygonB.isStatic) {
		return;
	}

	var contactPointA = Vec2.rotate(this.localPolygonPositionA, this.polygonA.orientation).add(this.polygonA.position);
	var contactPointB = Vec2.rotate(this.localPolygonPositionB, this.polygonB.orientation).add(this.polygonB.position);

	var towardsBsContactPoint = Vec2.sub(
		contactPointB,
		contactPointA
	);

	towardsBsContactPoint.mul(0.2);

	Polygon.applyRelativeDisplacement(this.contactPoint, towardsBsContactPoint, this.polygonA, this.polygonB);
	
	// To make sure the hinges overlap even when the distance is large and angle is large.
	Polygon.applyRelativeAbsoluteDisplacement(contactPointA, contactPointB, this.polygonA, this.polygonB, 0.2);
}
HingeConstraint.prototype.polygonIsA = function (polygon) {
	if (this.polygonA == polygon) {
		return true;
	}else{
		return false;
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.hinge_constraint', true);