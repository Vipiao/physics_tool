
function InjectedCollisionBox(){
	this.rightNode; // References to nodes in the horizontal and vertical edge lists of the collision box this is injected into. Theese nodes contain the edges of the original ancestor of this injected collision box.
	this.leftNode;
	this.topNode;
	this.bottomNode;

	this.right;
	this.left;
	this.top;
	this.bottom;

	// When two boxes collide, a injected version of both boxes will be injected into the other. This will then be set to true...
	this.canInject = true; // ... Only one of the injected boxes need to be able too inject copies of itself furter into collision boxes it collides with. This is always true for collision boxes, not necessarily for injected collision boxes.

	this.collisionBoxReference; // Reference to the original collision box that spawned this chain of injected collision boxes.
	this.injectorReference; // Reference to the collision box or injected collision box that spawned this injected collision box.
	this.injectedIntoReference; // Reference to the collision box or injected collision box that had this injected collision box injected into itself.
	this.nodeOfSpawnedInjections; // ... And this is a reference to the node in that (injected) collision box spawnedInjections linked list.
	this.spawnedInjections = new LinkedList(); // Injections spawned by this injected collision box.

	this.isInjection = true;
}
InjectedCollisionBox.prototype.deleteInjected = function () {
	// Remove edge references.
	this.rightNode.remove();
	this.leftNode.remove();
	this.topNode.remove();
	this.bottomNode.remove();
	// Remove references to the injector of this injectiors containedInjections list.
	this.nodeOfSpawnedInjections.remove();
	// Remove spawned injected collision boxes.
	for(var node = this.spawnedInjections.first; node != null; node = node.next){
		node.content.deleteInjected();
	}
}
InjectedCollisionBox.prototype.hasPreviousCoordinates = function () {
	// If the collision box was just spawned, then the collision box edges does not have previous coordinates.
	return this.collisionBoxReference.spawnedTick < this.collisionBoxReference.collisionBoxHandeler.tick;
}
InjectedCollisionBox.prototype.getRight = function (coordinates) {
	return this.collisionBoxReference.getRight(coordinates);
}
InjectedCollisionBox.prototype.getLeft = function (coordinates) {
	return this.collisionBoxReference.getLeft(coordinates);
}
InjectedCollisionBox.prototype.getTop = function (coordinates) {
	return this.collisionBoxReference.getTop(coordinates);
}
InjectedCollisionBox.prototype.getBottom = function (coordinates) {
	return this.collisionBoxReference.getBottom(coordinates);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.injected_collision_box', true);