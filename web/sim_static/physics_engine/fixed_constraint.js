
// A constraint that locks a position on a polygon to the world.

function FixedConstraint(phx){

	this.phx = phx;

	this.worldPosition = new Vec2();
	this.velocity = new Vec2(); // What is the velocity of the constraint.
	

	this.localPolygonPosition = new Vec2();

	this.polygon;

	this.compensator = new Vec2();

	this.friction = 0.01; // 1 is total friction, 0 is no friction.

	this.isDeleted = false;
}
FixedConstraint.prototype.delete = function () {
	if(this.isDeleted){
		return;
	}
	this.isDeleted = true;

	var index = this.phx.fixedConstraints.indexOf(this);
	this.phx.fixedConstraints.splice(index, 1);

	var index = this.polygon.fixedConstraints.indexOf(this);
	this.polygon.fixedConstraints.splice(index, 1);
}
FixedConstraint.prototype.attachToPolygon = function (polygon, worldPosition) {
	this.polygon = polygon;
	this.polygon.fixedConstraints.push(this);

	this.localPolygonPosition = this.polygon.worldToLocalCoordinates(worldPosition);
	this.worldPosition = worldPosition.clone();
}
FixedConstraint.prototype.calculateContactPoint = function () {
	this.contactPoint = Vec2.rotate(this.localPolygonPosition, this.polygon.orientation).add(this.polygon.position);

	// To deal with the contact points beeing too far away from each other.
	if(
		Vec2.sub(this.worldPosition, this.contactPoint).magSqr() >
		Vec2.sub(this.polygon.position, this.contactPoint).magSqr()
	){
		//this.contactPoint = this.polygon.position.clone();
	}
}
FixedConstraint.prototype.resolveByImpulse = function () {
	
	if (this.polygon.isStatic) {
		return;
	}

	var r = Vec2.sub(this.contactPoint, this.polygon.position);
	
	var alpha = this.velocity.x - this.polygon.velocity.x + r.y * this.polygon.angularVelocity;
	var beta = this.velocity.y - this.polygon.velocity.y - r.x * this.polygon.angularVelocity;
	var gamma = r.y*r.y / this.polygon.momentOfInertia + 1 / this.polygon.mass;
	var delta = r.x*r.x / this.polygon.momentOfInertia + 1 / this.polygon.mass;
	var epsilon = - r.x*r.y / this.polygon.momentOfInertia;
	var zeta = epsilon*epsilon - delta*gamma;
	
	var impulse = new Vec2(
		(beta*epsilon - alpha*delta) / (zeta),
		(alpha*epsilon - beta*gamma) / (zeta)
	);

	impulse.add(this.compensator);

	this.polygon.applyImpulse(this.contactPoint, impulse);
}
FixedConstraint.prototype.calculateCompensator = function () {

	if (this.polygon.isStatic) {
		return;
	}

	// Rotate the compensator by the polygons change in orientation.
	var deltaAngle = this.polygon.orientation - this.polygon.previousOrientation;
	//this.compensator.rotate(deltaAngle);
	//

	var r = Vec2.sub(this.contactPoint, this.polygon.position);
	
	var alpha = this.velocity.x - this.polygon.velocity.x + r.y * this.polygon.angularVelocity;
	var beta = this.velocity.y - this.polygon.velocity.y - r.x * this.polygon.angularVelocity;
	var gamma = r.y*r.y / this.polygon.momentOfInertia + 1 / this.polygon.mass;
	var delta = r.x*r.x / this.polygon.momentOfInertia + 1 / this.polygon.mass;
	var epsilon = - r.x*r.y / this.polygon.momentOfInertia;
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
FixedConstraint.prototype.resolveByFriction = function () {

	if (this.polygon.isStatic) {
		return;
	}

	var relVel = - this.polygon.angularVelocity;
	var collisionMass = this.polygon.momentOfInertia;
	var i = relVel * collisionMass;
	
	i *= this.friction;

	this.polygon.angularVelocity += i / this.polygon.momentOfInertia;
}
FixedConstraint.prototype.resolveByDisplacement = function () {
	
	if (this.polygon.isStatic) {
		return;
	}

	var contactPoint = Vec2.rotate(this.localPolygonPosition, this.polygon.orientation).add(this.polygon.position);
	
	this.polygon.applyDisplacement(contactPoint, Vec2.sub(
		this.worldPosition, contactPoint
	).mul(0.2));

	// To make sure the hinges overlap even when the distance is large and angle is large.
	this.polygon.applyAbsoluteDisplacement(Vec2.sub(
		this.worldPosition, contactPoint
	), 0.2);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.fixed_constraint', true);