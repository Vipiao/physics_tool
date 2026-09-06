
Rope.nrOfCreatedRopes = 0;

function Rope (phx){
	this.id = Rope.nrOfCreatedRopes++;

	this.phx = phx;

	this.localPolygonPositionA;
	this.localPolygonPositionB;

	this.polygonA;
	this.polygonB;

	this.length = 1;
	this.springConstant = 0.06;

	this.friction = 0.1;

	this.pulleyA;
	this.pulleyB;

	this.isDeleted = false;
}
Rope.prototype.delete = function () {
	if (this.isDeleted) {
		return;
	}
	this.isDeleted = true;

	var index = this.phx.ropes.indexOf(this);
	this.phx.ropes.splice(index, 1);

	var index = this.polygonA.ropes.indexOf(this);
	this.polygonA.ropes.splice(index, 1);

	var index = this.polygonB.ropes.indexOf(this);
	this.polygonB.ropes.splice(index, 1);

	if (this.pulleyA != null) {
		this.pulleyA.delete();
	}
	if (this.pulleyB != null) {
		this.pulleyB.delete();
	}
}
Rope.prototype.attachPolygons = function (polygonA, polygonB, worldPositionA, worldPositionB) {
	this.polygonA = polygonA;
	this.polygonB = polygonB;
	this.polygonA.ropes.push(this);
	this.polygonB.ropes.push(this);

	this.localPolygonPositionA = this.polygonA.worldToLocalCoordinates(worldPositionA);
	this.localPolygonPositionB = this.polygonB.worldToLocalCoordinates(worldPositionB);

	this.resetLength();
}
Rope.prototype.resetLength = function () {
	this.length = Vec2.sub(this.getContactWorldA(), this.getContactWorldB()).mag();
}
Rope.prototype.resolveByImpulse = function () {

	if (this.polygonA.isStatic && this.polygonB.isStatic) {
		return;
	}

	var contactPointA = this.getContactWorldA();
	var contactPointB = this.getContactWorldB();

	var displacement = Vec2.sub(contactPointA, contactPointB);
	var distSqr = displacement.magSqr();
	var lengthToUse = this.length;
	if(lengthToUse < 0){
		lengthToUse = 0;
	}
	if(distSqr <= lengthToUse * lengthToUse){
		return;
	}
	
	var distance = Math.sqrt(distSqr);
	var offset = distance - lengthToUse;
	var normal = Vec2.div(displacement, distance); // Vec2.unit(displacement);

	var rA = Vec2.sub(contactPointA, this.polygonA.position);
	var rB = Vec2.sub(contactPointB, this.polygonB.position);

	var dA = Vec2.det(rA, normal);
	var dB = Vec2.det(rB, normal);

	var frictionToUse = this.friction;

	var relVel;
	if (this.pulleyA != null) {
		relVel = this.pulleyA.overrideRelativeVelocity;
		frictionToUse = 1 - (1 - frictionToUse) / this.pulleyA.nrOfPulleysInChain;
	}else if (this.pulleyB != null) {
		relVel = this.pulleyB.overrideRelativeVelocity;
		frictionToUse = 1 - (1 - frictionToUse) / this.pulleyB.nrOfPulleysInChain;
	}else{
		relVel = Vec2.dot(normal, Vec2.sub(this.polygonB.velocity, this.polygonA.velocity)) + dB * this.polygonB.angularVelocity - dA * this.polygonA.angularVelocity;
	}

	var invCollisionMass;
	if (this.polygonA.isStatic) {
		invCollisionMass = 1/(this.polygonB.mass) + dB*dB/this.polygonB.momentOfInertia;
	}else if(this.polygonB.isStatic){
		invCollisionMass = 1/(this.polygonA.mass) + dA*dA/this.polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(this.polygonA.mass) + 1/(this.polygonB.mass) + dA*dA/this.polygonA.momentOfInertia + dB*dB/this.polygonB.momentOfInertia;
	}
	
	/*var frictionToUse = Infinity;
	if (this.pulleyA != null) {
		frictionToUse = this.pulleyA.overrideFriction;
	}
	if (this.pulleyB != null && this.pulleyB.overrideFriction < frictionToUse) {
		frictionToUse = this.pulleyB.overrideFriction;
	}
	if (this.friction < frictionToUse) {
		frictionToUse = this.friction;
	}*/


	var frictionPart = relVel * frictionToUse;
	// TODO: MORE FRICTION IF FRICTION IS +-???
	var restorePart = -offset * this.springConstant;
	var result;
	if (frictionPart < 0) {
		result = restorePart;
	} else if (frictionPart > -restorePart) {
		result = 0;
	}else{
		result = frictionPart + restorePart;
	}

	var i = (result) / invCollisionMass; // Could experiment with factoring out the spring constant.

	var impulse = Vec2.mul(normal, i);

	this.polygonA.applyImpulse(contactPointA, impulse);
	this.polygonB.applyImpulse(contactPointB, impulse.neg());
}
Rope.prototype.getRelativeVelocity = function () {
	var contactPointA = this.getContactWorldA();
	var contactPointB = this.getContactWorldB();

	var normal = Vec2.sub(contactPointA, contactPointB).unit();

	var rA = Vec2.sub(contactPointA, this.polygonA.position);
	var rB = Vec2.sub(contactPointB, this.polygonB.position);

	var dA = Vec2.det(rA, normal);
	var dB = Vec2.det(rB, normal);

	var relVel = Vec2.dot(normal, Vec2.sub(this.polygonB.velocity, this.polygonA.velocity)) + dB * this.polygonB.angularVelocity - dA * this.polygonA.angularVelocity;

	return relVel;
}
Rope.prototype.getContactWorldA = function () {
	return Vec2.rotate(this.localPolygonPositionA, this.polygonA.orientation).add(this.polygonA.position);
}
Rope.prototype.getContactWorldB = function () {
	return Vec2.rotate(this.localPolygonPositionB, this.polygonB.orientation).add(this.polygonB.position);
}
Rope.prototype.getCollisionMass = function () {

	if (this.polygonA.isStatic && this.polygonB.isStatic) {
		return Infinity;
	}

	var contactPointA = this.getContactWorldA();
	var contactPointB = this.getContactWorldB();

	var normal = Vec2.sub(contactPointA, contactPointB).unit();

	var rA = Vec2.sub(contactPointA, this.polygonA.position);
	var rB = Vec2.sub(contactPointB, this.polygonB.position);

	var dA = Vec2.det(rA, normal);
	var dB = Vec2.det(rB, normal);

	var invCollisionMass;
	if (this.polygonA.isStatic) {
		invCollisionMass = 1/(this.polygonB.mass) + dB*dB/this.polygonB.momentOfInertia;
	}else if(this.polygonB.isStatic){
		invCollisionMass = 1/(this.polygonA.mass) + dA*dA/this.polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(this.polygonA.mass) + 1/(this.polygonB.mass) + dA*dA/this.polygonA.momentOfInertia + dB*dB/this.polygonB.momentOfInertia;
	}

	return 1/invCollisionMass;
}
Rope.prototype.getRealLength = function () {
	return Vec2.sub(this.getContactWorldA(), this.getContactWorldB()).mag();
}
Rope.prototype.setLength = function (newLength) {
	this.length = newLength;
}
Rope.prototype.getLength = function () {
	return this.length;
}
Rope.prototype.polygonIsA = function (polygon) {
	if (this.polygonA == polygon) {
		return true;
	}else{
		return false;
	}
}
Rope.prototype.pulleyIsA = function (pulley) {
	if (this.pulleyA == pulley) {
		return true;
	}else{
		return false;
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.rope', true);