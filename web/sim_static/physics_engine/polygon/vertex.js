
function Vertex(collisionBoxHandeler){
	this.index;

	this.polygon; // What polygon is this vertex a part of.
	this.circumference; // What circumference is this vertex a part of.

	this.position; // Local around the polygons center of mass.
	this.worldPosition; // Position in world coordinates.
	this.previousWorldPosition; // Position in world coordinates.

	// Collision box.
	this.right;
	this.left;
	this.top;
	this.bottom;

	this.previousRight;
	this.previousLeft;
	this.previousTop;
	this.previousBottom;

	// Collision related.
	this.contactPoints = [];

	// DEBUG START
	this.testPos;
	this.testPotentialShaddow;
	// DEBUG END
}
/*Vertex.prototype.expandCollisionBoxByShadows = function () {
	for (let i = 0; i < this.polygon.collisionGroups.length; i++) {
		const cg = this.polygon.collisionGroups[i];
		
	}

	for (let i = 0; i < this.contactPoints.length; i++) {
		const cp = this.contactPoints[i];
		// Expand by current and new potential shadow.
		var shadow;
		var shadowNext;
		var potentialShadow;
		var potentialShadowNext;
		if(cp.vertexIsA(this)){
			shadow = cp.shadowVertexA;
			shadowNext = cp.shadowNextVertexA;
			potentialShadow = cp.potentialShadowVertexA;
			potentialShadowNext = cp.potentialShadowNextVertexA;
		}else{
			shadow = cp.shadowVertexB;
			shadowNext = cp.shadowNextVertexB;
			potentialShadow = cp.potentialShadowVertexB;
			potentialShadowNext = cp.potentialShadowNextVertexB;
		}
		this.right = Math.max(this.right, shadow.x, shadowNext.x, potentialShadow.x, potentialShadowNext.x);
		this.left = Math.min(this.left, shadow.x, shadowNext.x, potentialShadow.x, potentialShadowNext.x);
		this.top = Math.max(this.top, shadow.y, shadowNext.y, potentialShadow.y, potentialShadowNext.y);
		this.bottom = Math.min(this.bottom, shadow.y, shadowNext.y, potentialShadow.y, potentialShadowNext.y);
	}

}*/
/*Vertex.calculateCollisionBox = function (vertex, nextVertex) {
	vertex.right = Math.max(
		vertex.worldPosition.x,
		nextVertex.worldPosition.x,
	);
	vertex.left = Math.min(
		vertex.worldPosition.x,
		nextVertex.worldPosition.x,
	);
	vertex.top = Math.max(
		vertex.worldPosition.y,
		nextVertex.worldPosition.y,
	);
	vertex.bottom = Math.min(
		vertex.worldPosition.y,
		nextVertex.worldPosition.y,
	);
}*/
Vertex.prototype.getNext = function () {
	var index = this.index;
	index++;
	if(index > this.circumference.length - 1){
		index = 0;
	}

	return this.circumference[index];
}
Vertex.prototype.getPrevious = function () {
	var index = this.index;
	index--;
	if(index < 0){
		index = this.circumference.length - 1;
	}

	return this.circumference[index];
}
Vertex.prototype.updateVertexWorldPosition = function () {
	this.worldPosition = Vec2.rotate(this.position, this.polygon.orientation).add(this.polygon.position);

	return this.worldPosition;
}
Vertex.collisionBoxesAreColliding = function (vertexA, vertexB) {
	// Test is inclusive and assumes linear motion in between ticks.
	/*if(vertexA.polygon.spawnTime == vertexA.polygon.phx.tick || vertexB.polygon.spawnTime == vertexB.polygon.phx.tick){
		if(
			// If both boxes are seperated horizontally.
			vertexA.right < vertexB.left ||
			vertexA.left > vertexB.right ||
			// If both boxes are seperated vertically.
			vertexA.top < vertexB.bottom ||
			vertexA.bottom > vertexB.top
		){
			return false; // No collision happened.
		}else{
			return true;
		}
	}else */if(
		// If both boxes were seperated horizontally now and the previous tick.
		vertexA.right < vertexB.left && vertexA.previousRight < vertexB.previousLeft ||
		vertexA.left > vertexB.right && vertexA.previousLeft > vertexB.previousRight ||
		// If both boxes were seperated vertically now and the previous tick.
		vertexA.top < vertexB.bottom && vertexA.previousTop < vertexB.previousBottom ||
		vertexA.bottom > vertexB.top && vertexA.previousBottom > vertexB.previousTop
	){
		return false; // No collision happened.
	}else{
		return true;
	}
}
Vertex.collisionBoxCollidingIsDetected = function (vertexA, vertexB) {
	// TODO: Upgrade hash table.
	for (let i = 0; i < vertexA.contactPoints.length; i++) {
		const cp = vertexA.contactPoints[i];
		if(cp.vertexA == vertexB || cp.vertexB == vertexB){
			return true;
		}
	}
	return false;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.vertex', true);