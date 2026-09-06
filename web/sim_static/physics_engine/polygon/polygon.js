
Polygon.nrOfPolygons = 0;
function Polygon() {
	this.id = Polygon.nrOfPolygons++;

	// Properties
	
	this.density = 1;
	this.isAffectedByGravity = true;
	
	this.dynamicFrictionConstant = Math.sqrt(0.2); // Sliding friction.
	this.staticFrictionConstant = Math.sqrt(0.4); // ... fricF = normF*const.
	
	this.bounceFactor = Math.sqrt(0.5); // This is in [0,1]. 0 Is perfectly inelastic collision, while 1 is a perfect elastic collision.

	this.isStatic = false;

	//

	this.position = new Vec2();
	this.velocity = new Vec2();
	this.orientation = 0;
	this.previousOrientation = 0;
	this.angularVelocity = 0;

	this.area;
	this.mass;
	this.relativeMomentOfInertia; // Moment of inertia if density is 1.
	this.momentOfInertia; // Moment of inertia.
	
	this.geometry = []; // Geometry is a 2d array of Vec2s that describe the corners of a polygon with holes in it. Innwards is to the left as you move forward through the second dimension of the list. Example ("(a,b)" is a vector): [[(0,0), (3,0), (3,3), (0,3)], [(1,1),(1,2),(2,2),(2,1)]] is a box with a box shaped hole in it. TODO: UPDATE THIS DESCRIPTION

	//
	this.spawnTime; // What tick did this polygon originate.

	this.phx;

	//this.collisionFlags = [1]; // A list of integers. If two polygons share a flag, they will interact.

	//
	this.fixedConstraints = [];
	this.hingeConstraints = [];
	this.ropes = [];

	// -Collision related-
	// Collision box.
	this.right;
	this.left;
	this.top;
	this.bottom;
	
	this.previousRight;
	this.previousLeft;
	this.previousTop;
	this.previousBottom;
	//
	this.collisionGroups = [];

	this.debugMark = false;

	this.isDeleted = false;
}
Polygon.prototype.delete = function () {
	if(this.isDeleted){
		return;
	}
	this.isDeleted = true;

	this.phx.polygons.splice(this.phx.polygons.indexOf(this), 1);
	while (this.collisionGroups.length > 0) {
		this.collisionGroups[0].delete();
	}

	// Delete fixed.
	while (this.fixedConstraints.length > 0) {
		this.fixedConstraints[0].delete();
	}

	// Delete hinges.
	while (this.hingeConstraints.length > 0) {
		this.hingeConstraints[0].delete();
	}

	// Delete ropes.
	while (this.ropes.length > 0) {
		this.ropes[0].delete();
	}
}
Polygon.getVertex = function (circumference, vertexIndex) {
	// Takes the circumference where the vertex is and the index of the vertex within that circumference. If the vertex index is out of bounds, the index will wrap around to the other side. This is good for getting the next or previous vertex.
	if(vertexIndex >= circumference.length || vertexIndex < 0){
		vertexIndex = Tool.modulo(vertexIndex, circumference.length);
	}
	return circumference[vertexIndex];
}
Polygon.prototype.updateVertexWorldPositions = function () {
	for (var i = 0; i < this.geometry.length; i++) {
		var circumference = this.geometry[i];
		for (var j = 0; j < circumference.length; j++) {
			var vertex = circumference[j];
			vertex.updateVertexWorldPosition();
			//vertex.worldPosition = Vec2.rotate(vertex.position, this.orientation).add(this.position);
		}
	}
	for (var i = 0; i < this.geometry.length; i++) {
		var circumference = this.geometry[i];
		for (var j = 0; j < circumference.length; j++) {
			var vertex = circumference[j];
			// DEBUG START.
			//Render where each vertex is.
			//window.debugRender.addCross(vertex.worldPosition);
			// Render collision box.
			//window.debugRender.addBox(vertex.worldPosition, Polygon.getVertex(circumference, j + 1).worldPosition);
			// DEBUG END
		}
	}
}
Polygon.prototype.calculateCollisionBoxes = function () {
	// This polygons collision box.
	var polygonRight = -Infinity;
	var polygonLeft = Infinity;
	var polygonTop = -Infinity;
	var polygonBottom = Infinity;
	
	for (let i = 0; i < this.geometry.length; i++) {
		const c = this.geometry[i];
		var vertex = c[c.length-1];
		for (let j = 0; j < c.length; j++) {
			const nextVertex = c[j];

			vertex.right = Math.max(vertex.worldPosition.x, nextVertex.worldPosition.x);
			vertex.left = Math.min(vertex.worldPosition.x, nextVertex.worldPosition.x);
			vertex.top = Math.max(vertex.worldPosition.y, nextVertex.worldPosition.y);
			vertex.bottom = Math.min(vertex.worldPosition.y, nextVertex.worldPosition.y);
			if(polygonRight < vertex.right){
				polygonRight = vertex.right;
			}
			if(polygonLeft > vertex.left){
				polygonLeft = vertex.left;
			}
			if(polygonTop < vertex.top){
				polygonTop = vertex.top;
			}
			if(polygonBottom > vertex.bottom){
				polygonBottom = vertex.bottom;
			}

			// Prepare for the next loop iteration.
			vertex = nextVertex;
		}
	}

	// Set the polygons collision boxes.
	this.right =  polygonRight;
	this.left =  polygonLeft;
	this.top =  polygonTop;
	this.bottom =  polygonBottom;
}
Polygon.prototype.expandCollisionBoxesByShadows = function () {
	
	// This polygons collision box.
	var polygonRight = -Infinity;
	var polygonLeft = Infinity;
	var polygonTop = -Infinity;
	var polygonBottom = Infinity;

	// Calculate vertex and the polygons collision boxes.
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		if(!cg.enableCollision){
			continue;
		}
		//var shadowMatrix;
		var calculatedShadowPosition;
		var calculatedShadowOrientation;
		var potentialShadowPosition;
		var potentialShadowOrientation;
		var shadowDisplacement;
		if(cg.polygonIsA(this)){
			//shadowMatrix = cg.shadowMatrixA;
			calculatedShadowPosition = cg.calculatedShadowPositionA;
			calculatedShadowOrientation = cg.calculatedShadowOrientationA;
			//shadowDisplacement = cg.newShadowDisplacementA;
			potentialShadowPosition = cg.potentialShadowPositionA;
			potentialShadowOrientation = cg.potentialShadowOrientationA;
		}else{
			//shadowMatrix = cg.shadowMatrixB;
			calculatedShadowPosition = cg.calculatedShadowPositionB;
			calculatedShadowOrientation = cg.calculatedShadowOrientationB;
			//shadowDisplacement = cg.newShadowDisplacementB;
			potentialShadowPosition = cg.potentialShadowPositionB;
			potentialShadowOrientation = cg.potentialShadowOrientationB;
		}
		for (let j = 0; j < this.geometry.length; j++) {
			const c = this.geometry[j];
			var vertex = c[c.length-1];
			//var shadowPosition = Matrix3D.multiplyVector2Right(shadowMatrix, vertex.position);
			var shadowPosition = Vec2.rotate(vertex.position, calculatedShadowOrientation).add(calculatedShadowPosition);
			var vertexPotentialShadowPosition;
			//vertexPotentialShadowPosition = Vec2.add(vertex.worldPosition, shadowDisplacement);
			vertexPotentialShadowPosition = Vec2.rotate(vertex.position, potentialShadowOrientation).add(potentialShadowPosition);
			for (let k = 0; k < c.length; k++) {
				const nextVertex = c[k];
				//var nextShadowPosition = Matrix3D.multiplyVector2Right(shadowMatrix, nextVertex.position);
				var nextShadowPosition = Vec2.rotate(nextVertex.position, calculatedShadowOrientation).add(calculatedShadowPosition);
				var nextVertexPotentialShadowPosition;
				//nextPotentialShadowPosition = Vec2.add(nextVertex.worldPosition, shadowDisplacement);
				nextVertexPotentialShadowPosition = Vec2.rotate(nextVertex.position, potentialShadowOrientation).add(potentialShadowPosition);
				vertex.right = Math.max(vertex.right, shadowPosition.x, nextShadowPosition.x, vertexPotentialShadowPosition.x, nextVertexPotentialShadowPosition.x);
				vertex.left = Math.min(vertex.left, shadowPosition.x, nextShadowPosition.x, vertexPotentialShadowPosition.x, nextVertexPotentialShadowPosition.x);
				vertex.top = Math.max(vertex.top, shadowPosition.y, nextShadowPosition.y, vertexPotentialShadowPosition.y, nextVertexPotentialShadowPosition.y);
				vertex.bottom = Math.min(vertex.bottom, shadowPosition.y, nextShadowPosition.y, vertexPotentialShadowPosition.y, nextVertexPotentialShadowPosition.y);
				if(polygonRight < vertex.right){
					polygonRight = vertex.right;
				}
				if(polygonLeft > vertex.left){
					polygonLeft = vertex.left;
				}
				if(polygonTop < vertex.top){
					polygonTop = vertex.top;
				}
				if(polygonBottom > vertex.bottom){
					polygonBottom = vertex.bottom;
				}
				// Prepare for the next loop iteration.
				vertex = nextVertex;
				shadowPosition = nextShadowPosition;
				vertexPotentialShadowPosition = nextVertexPotentialShadowPosition;
			}
		}
	}
}
Polygon.prototype.savePreviousCoordinates = function () {
	// Polygon
	this.previousRight =  this.right;
	this.previousLeft =  this.left;
	this.previousTop =  this.top;
	this.previousBottom =  this.bottom;

	this.previousPosition = this.position.clone();
	this.previousOrientation = this.orientation;
	// Vertices.
	for (var i = 0; i < this.geometry.length; i++) {
		var circumference = this.geometry[i];
		for (var j = 0; j < circumference.length; j++) {
			var vertex = circumference[j];
			
			vertex.previousWorldPosition = vertex.worldPosition.clone();

			vertex.previousRight = vertex.right;
			vertex.previousLeft = vertex.left;
			vertex.previousTop = vertex.top;
			vertex.previousBottom = vertex.bottom;
		}
	}
}
Polygon.prototype.calculateInertia = function () {
	// Calculates the mass and moment of intertia based on the density and the area of the triangle.
	
	// calculate mass.
	var totalArea = 0;
	var totalCenterOfMass = new Vec2();
	for (var i = 0; i < this.geometry.length; i++) {
		var c = this.geometry[i];
		for (var j = 2; j < c.length; j++) {
			// Define triangle. Counter clockwise orientation.
			var p2 = c[j].position;
			var p1 = c[j-1].position;
			var p0 = c[0].position;
			// Calculate mass of this triangle.
			var v1 = Vec2.sub(p2, p0);
			var v2 = Vec2.sub(p1, p0);
			var mass = Vec2.det(v2, v1) * 0.5;
			var centerOfMass = Vec2.addMany(p0, p1, p2).div(3);
			totalArea += mass;
			totalCenterOfMass.add(centerOfMass.mul(mass));
		}
	}
	totalCenterOfMass.div(totalArea);

	this.area = totalArea;
	this.mass = totalArea * this.density;

	// Calculate moment of inertia.
	var totalMomentOfInertia = 0;
	for (var i = 0; i < this.geometry.length; i++) {
		var circumference = this.geometry[i];
		for (var j = 2; j < circumference.length; j++) {
			// Define triangle. Counter clockwise orientation.
			var p2 = circumference[j].position;
			var p1 = circumference[j-1].position;
			var p0 = circumference[0].position;
			// Calculate rotation mass of triangle around the center of mass.
			var v1 = Vec2.sub(p2, p0);
			var v2 = Vec2.sub(p1, p0);
			var a = Vec2.det(v2, v1);
			var b = Vec2.dot(v2, v1);
			var c = Vec2.dot(v1, v1);
			var momentOfInertia = a / (12 * c) * (a * a + b * b + c * c + b * c); // First only calculate rotation mass around p0.
			var centerOfMass = Vec2.addMany(p0, p1, p2).div(3);
			var mass = a * 0.5;
			momentOfInertia += (-Vec2.sub(p0, centerOfMass).magSqr() + Vec2.sub(centerOfMass, totalCenterOfMass).magSqr()) * mass; // The paralell axis theorem, first to find the moment of inertia around the center of mass, then around the total center of mass of the polygon.
			totalMomentOfInertia += momentOfInertia;

		}
	}
	this.relativeMomentOfInertia = totalMomentOfInertia;
	this.momentOfInertia = this.relativeMomentOfInertia * this.density;

	// Adjust geometry.
	this.position.add(totalCenterOfMass);
	for (var i = 0; i < this.geometry.length; i++) {
		var c = this.geometry[i];
		for (var j = 0; j < c.length; j++) {
			var p = c[j];
			p.position.sub(totalCenterOfMass);
		}
	}
	
	return totalCenterOfMass;
}
Polygon.prototype.setGeometry = function (circumferences) {
	// Circumferences is a 2d array of Vec2s that describe the corners of a polygon with holes in it. Innwards is to the left as you move forward through the second dimension of the list. Example ("(a,b)" is a vector): [[(0,0), (3,0), (3,3), (0,3)], [(1,1),(1,2),(2,2),(2,1)]] is a box with a box shaped hole in it.
	for (var i = 0; i < circumferences.length; i++) {
		var c = circumferences[i];
		this.geometry.push([]);
		for (var j = 0; j < c.length; j++) {
			var position = c[j];
			//
			var newVertex = new Vertex();
			newVertex.index = j;
			newVertex.position = position.clone();
			newVertex.polygon = this;
			newVertex.circumference = this.geometry[i];
			this.geometry[i].push(newVertex);
		}
	}
	
	// The polygon just came into existence, so for collision detection to work, it will pretend it has existed already for 1 frames.
	this.updateVertexWorldPositions();
	this.calculateCollisionBoxes();
	this.savePreviousCoordinates();

}
Polygon.prototype.getGeometry = function () {

	var geometry = [];

	for (let i = 0; i < this.geometry.length; i++) {
		const c = this.geometry[i];
		geometry.push([]);
		for (let j = 0; j < c.length; j++) {
			const v = c[j];
			geometry[geometry.length-1].push(v.position.clone());
		}
	}

	return geometry;
}
Polygon.prototype.positionDetect = function (position) {
	// Is the position inside the polygon? The test is inclusive. Returns true or false.
	// Polygon collision box detection
	if(
		this.right < position.x ||
		this.left > position.x ||
		this.top < position.y ||
		this.bottom > position.y
	){
		return false;
	}
	// TODO: Optimization. The function is not very optimized, alot of creating and deleting of lists are done.
	for (var i = 0; i < this.geometry.length; i++) {
		var c = this.geometry[i];
		var circumference = [];
		for (var j = 0; j < c.length; j++) {
			var vertex = c[j];
			circumference.push(vertex.worldPosition);
		}
		if(!Tool.positionInsideOrientedPolygonInclusive(position, circumference)){
			return false;
		}
	}
	return true;
}
Polygon.prototype.applyImpulse = function (position, impulse) {
	//
	if (this.isStatic) {
		return;
	}
	var localPosition = Vec2.sub(position, this.position);
	
	this.velocity.add(Vec2.div(impulse, this.mass));
	this.angularVelocity += Vec2.det(localPosition, impulse) / this.momentOfInertia;
}
Polygon.prototype.displaceByImpulse = function (position, impulse) {
	// Displace this polygon by a translation and orientation equivalent to the effect the impulse would have if applied at the position over one tick.

	if (this.isStatic) {
		return;
	}

	var localPosition = Vec2.sub(position, this.position);
	
	this.position.add(Vec2.div(impulse, this.mass));
	this.orientation += Vec2.det(localPosition, impulse) / this.momentOfInertia;
}
Polygon.prototype.applyDisplacement = function (position, displacement) {
	var r = Vec2.sub(position, this.position);
	
	var alpha = displacement.x;
	var beta = displacement.y;
	var gamma = r.y*r.y / this.momentOfInertia + 1 / this.mass;
	var delta = r.x*r.x / this.momentOfInertia + 1 / this.mass;
	var epsilon = - r.x*r.y / this.momentOfInertia;
	var zeta = epsilon*epsilon - delta*gamma;
	
	var impulse = new Vec2(
		(beta*epsilon - alpha*delta) / (zeta),
		(alpha*epsilon - beta*gamma) / (zeta)
	);

	//this.displaceByImpulse(position, impulse);

	var localPosition = Vec2.sub(position, this.position);
	
	this.position.add(Vec2.div(impulse, this.mass));
	this.orientation += Vec2.det(localPosition, impulse) / this.momentOfInertia;
}
Polygon.prototype.applyAbsoluteDisplacement = function (displacement, factor) {
	this.position.add(Vec2.mul(displacement, factor));
}
Polygon.prototype.applyShift = function (position, displacement) {
	// Displaces the polygon so that the position on the polygon at "position" will move approximately by the "displacement" vector.

	if(displacement.hasZeroMag()){
		return;
	}

	var normal = Vec2.unit(displacement); // The direction the impulse is applied.

	var localPosition = Vec2.sub(position, this.position);
	var d = Vec2.det(localPosition, normal);

	var relVel = Vec2.dot(normal, displacement);

	var collisionMass = 1/(this.mass) + d*d/this.momentOfInertia;

	var i = relVel / collisionMass;
	
	var impulse = Vec2.mul(normal, i);

	/*this.setPosition(this.getPosition().add(
		Vec2.div(impulse, this.mass)
	));*/
	this.position.add(Vec2.div(impulse, this.mass));
	//this.setOrientation(this.orientation + Vec2.det(localPosition, impulse) / this.momentOfInertia);
	this.orientation += Vec2.det(localPosition, impulse) / this.momentOfInertia;
}
Polygon.applyRelativeDisplacement = function (position, displacement, polygonA, polygonB) {

	if (polygonA.isStatic && polygonB.isStatic) {
		return;
	}

	var rA = Vec2.sub(position, polygonA.position);
	var rB = Vec2.sub(position, polygonB.position);
	
	var alpha = displacement.x;
	var beta = displacement.y;
	var gamma;
	var delta;
	var epsilon;
	if (polygonA.isStatic && !polygonB.isStatic) {
		gamma = rB.y*rB.y / polygonB.momentOfInertia + 1 / polygonB.mass;
		delta = rB.x*rB.x / polygonB.momentOfInertia + 1 / polygonB.mass;
		epsilon = - rB.x*rB.y / polygonB.momentOfInertia;
	} else if (polygonB.isStatic && !polygonA.isStatic) {
		gamma = rA.y*rA.y / polygonA.momentOfInertia + 1 / polygonA.mass;
		delta = rA.x*rA.x / polygonA.momentOfInertia + 1 / polygonA.mass;
		epsilon = - rA.x*rA.y / polygonA.momentOfInertia;
	}else{
		gamma = rB.y*rB.y / polygonB.momentOfInertia + rA.y*rA.y / polygonA.momentOfInertia + 1 / polygonB.mass + 1 / polygonA.mass;
		delta = rB.x*rB.x / polygonB.momentOfInertia + rA.x*rA.x / polygonA.momentOfInertia + 1 / polygonB.mass + 1 / polygonA.mass;
		epsilon = - rB.x*rB.y / polygonB.momentOfInertia - rA.x*rA.y / polygonA.momentOfInertia;
	}
	var zeta = epsilon*epsilon - delta*gamma;
	
	var impulse = new Vec2(
		(beta*epsilon - alpha*delta) / (zeta),
		(alpha*epsilon - beta*gamma) / (zeta)
	);

	polygonA.displaceByImpulse(position, impulse);
	polygonB.displaceByImpulse(position, impulse.neg());
}
Polygon.applyRelativeShift = function (position, displacement, polygonA, polygonB) {
	// Displaces the polygons relative position at "position" by the "displacement" vector as if an impulse were applied in between them. If the orientation of the polygons change a lot, the displacement is approximated. The displacement describe how the position on polygonB moves relative to polygonA.

	if (polygonA.isStatic && polygonB.isStatic) {
		return;
	}

	if(displacement.hasZeroMag()){
		return;
	}

	var normal = Vec2.unit(displacement);

	var rA = Vec2.sub(position, polygonA.position);
	var rB = Vec2.sub(position, polygonB.position);

	var dA = Vec2.det(rA, normal);
	var dB = Vec2.det(rB, normal);

	var relVel = Vec2.dot(normal, displacement);

	var invCollisionMass;
	if (polygonA.isStatic) {
		invCollisionMass = 1/(polygonB.mass) + dB*dB/polygonB.momentOfInertia;
	}else if(polygonB.isStatic){
		invCollisionMass = 1/(polygonA.mass) + dA*dA/polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(polygonA.mass) + 1/(polygonB.mass) + dA*dA/polygonA.momentOfInertia + dB*dB/polygonB.momentOfInertia;
	}
	invCollisionMass

	var i = relVel / collisionMass;

	var impulse = Vec2.mul(normal, i);

	polygonA.displaceByImpulse(position, impulse);
	polygonB.displaceByImpulse(position, impulse.neg());
}
Polygon.applyRelativeAbsoluteDisplacement = function (contantPositionA, contactPositionB, polygonA, polygonB, factor = 1) {
	
	if (polygonA.isStatic && polygonB.isStatic) {
		return;
	}else if(polygonA.isStatic){
		var displacement = Vec2.sub(contactPositionB, contantPositionA);
		polygonB.position.sub(displacement);
		return;
	}else if(polygonB.isStatic){
		var displacement = Vec2.sub(contactPositionB, contantPositionA);
		polygonA.position.add(displacement);
		return;
	}

	var displacement = Vec2.sub(contactPositionB, contantPositionA);
	displacement.mul(factor);
	var translationalCollisionMass = 1/(1/polygonA.mass + 1/polygonB.mass);
	var translatinalImpulse = Vec2.mul(displacement, translationalCollisionMass);

	var displacementA = Vec2.div(translatinalImpulse, polygonA.mass);
	var displacementB = Vec2.div(translatinalImpulse, -polygonB.mass);
	var positionA2 = Vec2.add(polygonA.position, displacementA);
	var positionB2 = Vec2.add(polygonB.position, displacementB);

	var amd = Vec2.det(
		Vec2.sub(polygonA.position, positionB2),
		Vec2.sub(positionA2, positionB2)
	) * polygonA.mass; // Displacement of angular momentum. (Angular momentum integrated over one tick).

	var centerOfMass = Vec2.add(
		Vec2.mul(polygonA.position, polygonA.mass),
		Vec2.mul(polygonB.position, polygonB.mass)
	).div(polygonA.mass + polygonB.mass);

	var momentOfInertiaOfSystem =
		Vec2.sub(positionA2, centerOfMass).magSqr() * polygonA.mass +
		Vec2.sub(positionB2, centerOfMass).magSqr() * polygonB.mass +
		polygonA.momentOfInertia + polygonB.momentOfInertia; // Moment of inertia around the contact point.
	var angularDisplacement = amd / momentOfInertiaOfSystem;

	polygonA.position = Vec2.rotateAround(positionA2, centerOfMass, -angularDisplacement);
	polygonB.position = Vec2.rotateAround(positionB2, centerOfMass, -angularDisplacement);
	polygonA.orientation += -angularDisplacement;
	polygonB.orientation += -angularDisplacement;
}
Polygon.prototype.localToWorldCoordinates = function (localCoordinate) {
	var r = Vec2.rotate(localCoordinate, this.orientation);
	r.add(this.position);
	return r;
}
Polygon.prototype.worldToLocalCoordinates = function (worldCoordinate) {
	var r = Vec2.sub(worldCoordinate, this.position);
	r.rotate(-this.orientation);
	return r;
}
Polygon.prototype.getVelocityAtPosition = function (position) {
	var localPosition = Vec2.sub(position, this.position);
	var rotationComponent = Vec2.rotate90CounterClockwise(localPosition).mul(this.angularVelocity);
	return Vec2.add(this.velocity, rotationComponent);
}
Polygon.prototype.setVelocityAtPosition = function (position, targetVelocity) {
	// Sets the velocity at the "position" to be equal to "targetVelocity"

	var deltaVel = Vec2.sub(targetVelocity, this.getVelocityAtPosition(position));

	if(deltaVel.hasZeroMag()){
		return;
	}

	var normal = Vec2.unit(deltaVel);

	var r = Vec2.sub(position, this.position);
	
	var d = Vec2.det(r, normal);

	var relVel = Vec2.dot(normal, deltaVel);

	// -Calculate impulse-
	var collisionMass = 1/(this.mass) + d*d/this.momentOfInertia;
	
	var i = relVel / collisionMass;

	var impulse = Vec2.mul(normal, i);

	this.applyImpulse(position, impulse);
}
Polygon.prototype.setPosition = function (position) {
	this.position = position.clone();

	if(this.spawnTime == this.phx.tick){ // If this polygon just spawned.
		this.updateVertexWorldPositions();
		this.calculateCollisionBoxes();
		this.savePreviousCoordinates();
	}
}
Polygon.prototype.setOrientation = function (orientation) {
	this.orientation = orientation;

	if(this.spawnTime == this.phx.tick){ // If this polygon just spawned.
		this.updateVertexWorldPositions();
		this.calculateCollisionBoxes();
		this.savePreviousCoordinates();
	}
}
Polygon.prototype.getPosition = function (position) {
	return this.position.clone();
}
Polygon.prototype.setDensity = function (newDensity) {
	this.density = newDensity;
	this.mass = this.area * this.density;
	this.momentOfInertia = this.relativeMomentOfInertia * this.density;
}
Polygon.prototype.getDensity = function () {
	return this.density;
}
Polygon.prototype.setMass = function (newMass) {
	var newDensity = newMass / this.area;
	this.setDensity(newDensity);
}
Polygon.prototype.getMass = function () {
	return this.mass;
}
Polygon.prototype.setIsStatic = function (isStatic) {
	this.isStatic = isStatic;
	//this.updateEnableCollision();
}
Polygon.prototype.setDynamicFrictionConstant = function (newConstant) {
	this.dynamicFrictionConstant = Math.sqrt(newConstant);
	if (this.staticFrictionConstant < this.dynamicFrictionConstant) {
		this.staticFrictionConstant = this.dynamicFrictionConstant;
	}
}
Polygon.prototype.getDynamicFrictionConstant = function () {
	return this.dynamicFrictionConstant * this.dynamicFrictionConstant;
}
Polygon.prototype.setStaticFrictionConstant = function (newConstant) {
	this.staticFrictionConstant = Math.sqrt(newConstant);
	if (this.dynamicFrictionConstant > this.staticFrictionConstant) {
		this.dynamicFrictionConstant = this.staticFrictionConstant;
	}
}
Polygon.prototype.getStaticFrictionConstant = function () {
	return this.staticFrictionConstant * this.staticFrictionConstant;
}
Polygon.prototype.setBounceFactor = function (newFactor) {
	this.bounceFactor = Math.sqrt(newFactor);
}
Polygon.prototype.getBounceFactor = function () {
	return this.bounceFactor * this.bounceFactor;
}
Polygon.prototype.updateEnableCollision = function () {
	outer:
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		var other = cg.getOther(this);
		// Static.
		if (other.isStatic && this.isStatic) {
			cg.enableCollision = false;
			continue outer;
		}
		// Hinge.
		for (let i = 0; i < other.hingeConstraints.length; i++) {
			const hc = other.hingeConstraints[i];
			if(hc.polygonA == this || hc.polygonB == this){
				cg.enableCollision = false;
				continue outer;
			}
		}
		//
		cg.enableCollision = true;
	}
}
Polygon.prototype.getForceVectors = function () {

	/*
	Format:
	[
		...,
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
				...,
				{
					"point": point,
					"force": force,
				},
				...,
			],
		},
		...,
	]

	The outer list is of each pair of objects. The next object is normal and friction forces between one object. The next two list is the individual forces at contact points.
	*/

	var interactions = [];
	for (let i = 0; i < this.collisionGroups.length; i++) {
		const cg = this.collisionGroups[i];
		interactions.push(cg.getForceVectors(this));
	}

	return interactions;
}
Polygon.areOverlapping = function (pA, pB) {
	// Are the position of theese polygons overlapping?
	//
	if(!Polygon.collisionBoxesAreOverlapping(pA, pB)){
		return false;
	}
	// Test if one point of one polygon is inside the other polygon ant the other way. This deals with the special case when one polygon is completely inside another, as that situation would be missed in the next test.
	if(pA.positionDetect(pB.geometry[0][0].worldPosition) || pB.positionDetect(pA.geometry[0][0].worldPosition)){
		return true;
	}

	// Check if the surfaces of the polygons overlap.
	for (let i = 0; i < pA.geometry.length; i++) {
		const gA = pA.geometry[i];
		var prevVertA = gA[gA.length-1];
		for (let j = 0; j < gA.length; j++) {
			const vertA = gA[j];

			var segStartA = prevVertA.worldPosition;
			var segEndA = vertA.worldPosition;
			for (let k = 0; k < pB.geometry.length; k++) {
				const gB = pB.geometry[k];
				var prevVertB = gB[gB.length-1];
				for (let l = 0; l < gB.length; l++) {
					const vertB = gB[l];

					var segStartB = prevVertB.worldPosition;
					var segEndB = vertB.worldPosition;

					// Segment segment collision detection.
					if(Tool.segmentsIntersectInclusive(segStartA, segEndA, segStartB, segEndB)){
						return true;
					}
					
					prevVertB = vertB;
				}
			}
			prevVertA = vertA;
		}
	}
	
	return false;
}
Polygon.areOverlappingPrevFrame = function (pA, pB) {
	// Are the position of theese polygons overlapping?
	//
	if(!Polygon.collisionBoxesAreOverlappingPrevFrame(pA, pB)){
		return false;
	}
	// Test if one point of one polygon is inside the other polygon ant the other way. This deals with the special case when one polygon is completely inside another, as that situation would be missed in the next test.
	if(pA.positionDetect(pB.geometry[0][0].previousWorldPosition) || pB.positionDetect(pA.geometry[0][0].previousWorldPosition)){
		return true;
	}

	// Check if the surfaces of the polygons overlap.
	for (let i = 0; i < pA.geometry.length; i++) {
		const gA = pA.geometry[i];
		var prevVertA = gA[gA.length-1];
		for (let j = 0; j < gA.length; j++) {
			const vertA = gA[j];

			var segStartA = prevVertA.previousWorldPosition;
			var segEndA = vertA.previousWorldPosition;
			for (let k = 0; k < pB.geometry.length; k++) {
				const gB = pB.geometry[k];
				var prevVertB = gB[gB.length-1];
				for (let l = 0; l < gB.length; l++) {
					const vertB = gB[l];

					var segStartB = prevVertB.previousWorldPosition;
					var segEndB = vertB.previousWorldPosition;

					// Segment segment collision detection.
					if(Tool.segmentsIntersectInclusive(segStartA, segEndA, segStartB, segEndB)){
						return true;
					}
					
					prevVertB = vertB;
				}
			}
			prevVertA = vertA;
		}
	}
	
	return false;
}
Polygon.collisionBoxesAreOverlapping = function (pA, pB) {
	if(
		// If both boxes are seperated horizontally.
		pA.right < pB.left ||
		pA.left > pB.right ||
		// If both boxes are seperated vertically.
		pA.top < pB.bottom ||
		pA.bottom > pB.top
	){
		return false; // No collision happened.
	}else{
		return true;
	}
}
Polygon.collisionBoxesAreOverlappingPrevFrame = function (pA, pB) {
	if(
		// If both boxes are seperated horizontally.
		pA.previousRight < pB.previousLeft ||
		pA.previousLeft > pB.previousRight ||
		// If both boxes are seperated vertically.
		pA.previousTop < pB.previousBottom ||
		pA.previousBottom > pB.previousTop
	){
		return false; // No collision happened.
	}else{
		return true;
	}
}
Polygon.collisionBoxesAreColliding = function (pA, pB) {
	// Test is inclusive and assumes linear motion in between ticks.
	/*if(pA.spawnTime == pA.phx.tick || pB.spawnTime == pB.phx.tick){
		if(
			// If both boxes are seperated horizontally.
			pA.right < pB.left ||
			pA.left > pB.right ||
			// If both boxes are seperated vertically.
			pA.top < pB.bottom ||
			pA.bottom > pB.top
		){
			return false; // No collision happened.
		}else{
			return true;
		}
	}else */if(
		// If both boxes were seperated horizontally now and the previous tick.
		pA.right < pB.left && pA.previousRight < pB.previousLeft ||
		pA.left > pB.right && pA.previousLeft > pB.previousRight ||
		// If both boxes were seperated vertically now and the previous tick.
		pA.top < pB.bottom && pA.previousTop < pB.previousBottom ||
		pA.bottom > pB.top && pA.previousBottom > pB.previousTop
	){
		return false; // No collision happened.
	}else{
		return true;
	}
}
Polygon.collisionBoxCollidingIsDetected = function (polygonA, polygonB) {
	for (var i = 0; i < polygonA.collisionGroups.length; i++) {
		var cg = polygonA.collisionGroups[i];
		if(cg.polygonA == polygonB || cg.polygonB == polygonB){
			return true;
		}
	}
	return false;
}
Polygon.prototype.fracture = function (segment, impulse) {
	
	// Test if impulse is too small.
	if (impulse < 1) { // TODO: Abstract break threshold.
		return false;
	}
	// Get fracture pattern.
	var pattern = Fracture.getStandardFracture(impulse*3);
	// Generate new circumferences.
	



}
Polygon.prototype.toGeogebra = function (name) {
	var s = "";
	for (let i = 0; i < this.geometry.length; i++) {
		const c = this.geometry[i];
		for (let j = 0; j < c.length; j++) {
			const v = c[j];
			s += (name + i) + j + " = (" + v.worldPosition.x + ", " + v.worldPosition.y + ")\n";
		}
	}
	return s;
}
Polygon.prototype.toGeogebraPrevious = function (name) {
	var s = "";
	for (let i = 0; i < this.geometry.length; i++) {
		const c = this.geometry[i];
		for (let j = 0; j < c.length; j++) {
			const v = c[j];
			s += (name + i) + j + " = (" + v.previousWorldPosition.x + ", " + v.previousWorldPosition.y + ")\n";
		}
	}
	return s;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.polygon', true);