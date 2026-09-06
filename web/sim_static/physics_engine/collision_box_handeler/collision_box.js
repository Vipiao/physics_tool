
function CollisionBox(collisionBoxHandeler){
	if(collisionBoxHandeler == null){
		throw new Error().stack;
	}
	this.id = collisionBoxHandeler.nrOfCollisionBoxes++;

	this.content;

	this.collisionBoxHandeler = collisionBoxHandeler;

	this.right = new Edge(this, true);
	this.left = new Edge(this, false);
	this.top = new Edge(this, true);
	this.bottom = new Edge(this, false);

	this.rightEdgeNodeInParent; // References to nodes in the horizontal and vertical edge lists of the parent collision box. If it has no parent, theese are null;
	this.leftEdgeNodeInParent;
	this.topEdgeNodeInParent;
	this.bottomEdgeNodeInParent;

	this.collidingCollisionBoxes = []; // A list of all the collision boxes this collision box is currently colliding with.

	//
	this.children = [];

	this.edgesHorizontal = new LinkedList();
	this.edgesVertical = new LinkedList();

	this.spawnedTick = this.collisionBoxHandeler.tick;

	
	this.spawnedInjections = new LinkedList(); // Injections spawned directly by this injected collision box.
	
	this.isInjection = false;
}
function EdgeCapsule(edge, injector){
	this.edge = edge;
	this.injector = injector;
}
function Edge(collisionBox, isMaximumEdge) {
	this.coordinate;
	this.previousCoordinate
	this.isMaximumEdge = isMaximumEdge; // A maximum edge has the largest coordinate on the collision box. Examples of maximum edges are top and right.

	this.collisionBox = collisionBox;
}
CollisionBox.prototype.hasPreviousCoordinates = function () {
	// If the collision box was just spawned, then the collision box edges does not have previous coordinates.
	return this.spawnedTick < this.collisionBoxHandeler.tick;
}
CollisionBox.prototype.setRight = function (coordinate) {
	this.right.coordinate = Tool.increaseValueMinimum(coordinate);
}
CollisionBox.prototype.getRight = function (coordinate) {
	return this.right.coordinate;
}
CollisionBox.prototype.setLeft = function (coordinate) {
	this.left.coordinate = Tool.decreaseValueMinimum(coordinate);
}
CollisionBox.prototype.getLeft = function (coordinate) {
	return this.left.coordinate;
}
CollisionBox.prototype.setTop = function (coordinate) {
	this.top.coordinate = Tool.increaseValueMinimum(coordinate);
}
CollisionBox.prototype.getTop = function (coordinate) {
	return this.top.coordinate;
}
CollisionBox.prototype.setBottom = function (coordinate) {
	this.bottom.coordinate = Tool.decreaseValueMinimum(coordinate);
}
CollisionBox.prototype.getBottom = function (coordinate) {
	return this.bottom.coordinate;
}
CollisionBox.prototype.addChild = function (cb) {
	this.children.push(cb);
	if(cb.collisionBoxHandeler == null){ // DEBUG!!!
		debugger;
	}
	// -Place the childs edges into parents edges lists-
	// Horizontal.
	if(CollisionBox.childShouldBePlacedRight(this, cb)){ // Place the new collision box to the right in the this.edgesHorizontal? ...
		cb.leftEdgeNodeInParent = this.edgesHorizontal.addLast(new EdgeCapsule(cb.left, cb));
		cb.rightEdgeNodeInParent = this.edgesHorizontal.addLast(new EdgeCapsule(cb.right, cb));
	}else{ // ... Or to the left?
		cb.rightEdgeNodeInParent = this.edgesHorizontal.addFirst(new EdgeCapsule(cb.right, cb));
		cb.leftEdgeNodeInParent = this.edgesHorizontal.addFirst(new EdgeCapsule(cb.left, cb));
	}
	// Vertical.
	if(CollisionBox.childShouldBePlacedTop(this, cb)){ // Place the new collision box to the top in the this.edgesVertical? ...
		cb.bottomEdgeNodeInParent = this.edgesVertical.addLast(new EdgeCapsule(cb.bottom, cb));
		cb.topEdgeNodeInParent = this.edgesVertical.addLast(new EdgeCapsule(cb.top, cb));
	}else{ // ... Or to the bottom?
		cb.topEdgeNodeInParent = this.edgesVertical.addFirst(new EdgeCapsule(cb.top, cb));
		cb.bottomEdgeNodeInParent = this.edgesVertical.addFirst(new EdgeCapsule(cb.bottom, cb));
	}
}
CollisionBox.prototype.autoScaleCollisionBoxSizeToChildrensCollisionBoxes = function () {
	if(this.children.length == 0){
		return;
	}
	var rightMost = -Infinity;
	var leftMost = Infinity;
	var topMost = -Infinity;
	var bottomMost = Infinity;
	for (var i = 0; i < this.children.length; i++) {
		var cb = this.children[i];
		// Update extremes.
		rightMost = cb.right.coordinate > rightMost? cb.right.coordinate: rightMost;
		leftMost = cb.left.coordinate < leftMost? cb.left.coordinate: leftMost;
		topMost = cb.top.coordinate > topMost? cb.top.coordinate: topMost;
		bottomMost = cb.bottom.coordinate < bottomMost? cb.bottom.coordinate: bottomMost;
	}
	this.right.coordinate = rightMost;
	this.left.coordinate = leftMost;
	this.top.coordinate = topMost;
	this.bottom.coordinate = bottomMost;
}
CollisionBox.prototype.recursiveCollisionDetection = function () {
	// Collsion detection of collision box and its descendants.
	// Width first collision detection.
	var queue = new Queue();
	this.detectCollisionsOfChildren();
	queue.enqueueArray(this.children);
	while (!queue.isEmpty()) {
		var cb = queue.dequeue();
		cb.detectCollisionsOfChildren();
		queue.enqueueArray(cb.children);
	}
}
CollisionBox.prototype.detectCollisionsOfChildren = function () {
	// Detect collisions of child collision boxes and inserted collision boxes amongst themself.
	this.detectAlongDimension(this.edgesHorizontal);
	this.detectAlongDimension(this.edgesVertical);
}
CollisionBox.prototype.detectAlongDimension = function (dimension) {
	// Insertion sort from smallest to largest edge.coordinate.
	if(dimension.size == 0){
		return;
	}
	// Insertion sort edges.
	nextANode:
	for(var nA = dimension.first.next; nA != null; nA = nA.next){
		for(var nB = nA.previous; nB != null; nB = nB.previous){
			var edgeLargeCapsule = nB.next.content; // Note: used to be largest, but is not anymore, same goes for when small is used.
			var edgeSmallCapsule = nB.content;
			var edgeLarge = edgeLargeCapsule.edge; // The edge to the right/top.
			var edgeSmall = edgeSmallCapsule.edge; // The edge to the left/bottom.
			physicsSimulator.d0++;
			if(edgeLarge.coordinate < edgeSmall.coordinate){
				// Swap nodes.
				LinkedList.swapNodeWithPrevious(nB.next); // Previously largest node is moved back.
				nB = nB.previous;

				var cbA = edgeSmallCapsule.injector;
				var cbB = edgeLargeCapsule.injector;
				if(cbA == cbB ||
					cbA.isInjection && cbB.isInjection){
					continue;
				}
				// Test for collision.
				if(edgeSmall.isMaximumEdge && !edgeLarge.isMaximumEdge){ // If a right/top edge is moved to the right/above a left/bottom edge. This means a new collision (overlap) might just have begun.
					this.collisionBoxHandeler.testAndHandleCollision(cbA, cbB);
				}else if(!edgeSmall.isMaximumEdge && edgeLarge.isMaximumEdge){ // If a left/bottom edge is moved to the right/above a right/top edge. This means an overlap might have ended.
					this.collisionBoxHandeler.collisionEndQueue.push(cbA);
					this.collisionBoxHandeler.collisionEndQueue.push(cbB);
				}
			}else{
				continue nextANode;
			}
		}
	}
}
CollisionBox.isBiggerThan = function (cbA, cbB) {
	// If cbA is bigger that cbB, return true else return false. That is, if they are equal in size, return false. Look at the definition to see what is the definition of "bigger".
	if(cbA.right.coordinate - cbA.left.coordinate + cbA.top.coordinate - cbA.bottom.coordinate > cbB.right.coordinate - cbB.left.coordinate + cbB.top.coordinate - cbB.bottom.coordinate){ // TODO: Will a different definition of "bigger" improve performance? Example area instead of circumference * 0.5 (like what is used here)?
		return true;
	}else{
		return false;
	}
}
CollisionBox.prototype.injectCollisionBox = function (cb){
	var injectedCollisionBox = new InjectedCollisionBox(this.collisionBoxHandeler);
	if(cb.isInjection){
		injectedCollisionBox.collisionBoxReference = cb.collisionBoxReference;
	}else{
		injectedCollisionBox.collisionBoxReference = cb;
	}
	if(InjectedCollisionBox.collisionBoxReference instanceof InjectedCollisionBox){
		debugger;
	}
	injectedCollisionBox.right = cb.right;
	injectedCollisionBox.left = cb.left;
	injectedCollisionBox.top = cb.top;
	injectedCollisionBox.bottom = cb.bottom;
	injectedCollisionBox.injectorReference = cb;
	injectedCollisionBox.injectedIntoReference = this;

	this.collisionBoxHandeler.extraCollisionsQueue.enqueue({
		"injection": cb,
		"into": this,
		"injectedCollisionBox": injectedCollisionBox,
	});
	injectedCollisionBox.nodeOfSpawnedInjections = cb.spawnedInjections.addLast(injectedCollisionBox);
	
	return injectedCollisionBox;
}
CollisionBox.childShouldBePlacedRight = function (parent, child) {
	// If the child is to be adopted by the parent, should it be placed to the right or to the left of the parents edgesHorizontal.
	if(parent.edgesHorizontal.size == 0 ||parent.edgesHorizontal.last.content.edge.coordinate - child.right.coordinate < child.left.coordinate - parent.edgesHorizontal.first.content.edge.coordinate){
		return true;
	}else{
		return false;
	}
}
CollisionBox.childShouldBePlacedTop = function (parent, child) {
	// If the child is to be adopted by the parent, should it be placed to the right or to the left of the parents edgesHorizontal.
	if(parent.edgesVertical.size == 0 || parent.edgesVertical.last.content.edge.coordinate - child.top.coordinate < child.bottom.coordinate - parent.edgesVertical.first.content.edge.coordinate){
		return true;
	}else{
		return false;
	}
}
CollisionBox.collisionIsDetected = function (cbA, cbB) {
	var collidingCollisionBoxes;
	if(cbA.isInjection){
		collidingCollisionBoxes = cbA.collisionBoxReference.collidingCollisionBoxes;
	}else{
		collidingCollisionBoxes = cbA.collidingCollisionBoxes;
	}
	var referenceB;
	if(cbB.isInjection){
		referenceB = cbB.collisionBoxReference;
	}else{
		referenceB = cbB;
	}
	if(collidingCollisionBoxes.indexOf(referenceB) == -1){ // Could have swapped cbA and cbB.
		return false;
	}else{
		return true;
	}
}
CollisionBox.isColliding = function (cbA, cbB) {
	// Detects if two collision boxes collided. If an overlap happens from the last tick to this tick, the function will return true, even if it is not overlapping in this instant.
	if(!cbA.hasPreviousCoordinates() || !cbB.hasPreviousCoordinates()){
		if(
			// If both boxes is seperated horizontally.
			cbA.right.coordinate < cbB.left.coordinate ||
			cbA.left.coordinate > cbB.right.coordinate ||
			// If both boxes is seperated vertically.
			cbA.top.coordinate < cbB.bottom.coordinate ||
			cbA.bottom.coordinate > cbB.top.coordinate
		){
			return false; // No collision happened.
		}else{
			return true;
		}
	}else if(
		// If both boxes were seperated horizontally now and the previous tick.
		cbA.right.coordinate < cbB.left.coordinate && cbA.right.previousCoordinate < cbB.left.previousCoordinate ||
		cbA.left.coordinate > cbB.right.coordinate && cbA.left.previousCoordinate > cbB.right.previousCoordinate ||
		// If both boxes were seperated vertically now and the previous tick.
		cbA.top.coordinate < cbB.bottom.coordinate && cbA.top.previousCoordinate < cbB.bottom.previousCoordinate ||
		cbA.bottom.coordinate > cbB.top.coordinate && cbA.bottom.previousCoordinate > cbB.top.previousCoordinate
	){
		return false; // No collision happened.
	}else{
		return true;
	}
}
CollisionBox.prototype.recursiveSavePreviousCoordinates = function () {
	this.right.previousCoordinate = this.right.coordinate;
	this.left.previousCoordinate = this.left.coordinate;
	this.top.previousCoordinate = this.top.coordinate;
	this.bottom.previousCoordinate = this.bottom.coordinate;
	for (var i = 0; i < this.children.length; i++) {
		var c = this.children[i];
		c.recursiveSavePreviousCoordinates();
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.collision_box', true);