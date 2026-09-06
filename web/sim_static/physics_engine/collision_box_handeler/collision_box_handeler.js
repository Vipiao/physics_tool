
function CollisionBoxHandeler(){
	this.tick = -1;
	this.nrOfCollisionBoxes = 0;

	this.topLevel = new CollisionBox(this);

	this.collisionEndQueue = []; // Boxes that has stopped overlapping will the next tick be tested if they are not overlapping and that a new collision has not happened, if so, collision data will be removed and injected collision boxes will be removed.
	this.extraCollisionsQueue = new Queue(); // Due to a possibility that some collisions might not be detected during the first collision detection, some extra tests is qued in this list.

	this.collisionStartEventListeners = [];
	this.collisionEndEventListeners = [];
}
CollisionBoxHandeler.unitTest = function (params) {
	testNr = 0;
	function fail(testNr) {
		return "Failed unit test at test nr: " + testNr + ".\n";
	}

	testNr++;
	try{
		var q = new CollisionBoxHandeler();
		var tick = 0;
		var a = new CollisionBox();
		a.setRight(200);
		a.setLeft(100);
		a.setTop(200);
		a.setBottom(100);
		var b = new CollisionBox();
		b.setRight(400);
		b.setLeft(300);
		b.setTop(400);
		b.setBottom(300);
		for(var i=0; i<100; i++){
			tick++;
			

		}
		
		/*if(!isCorrect(q, [6,7,8,9,10,11,12,13,14])){
			console.error(fail(testNr));
		}*/
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}
}
CollisionBoxHandeler.prototype.addCollisionStartEventListener = function (f) {
	this.collisionStartEventListeners.push(f);
}
CollisionBoxHandeler.prototype.addCollisionEndEventListener = function (f) {
	this.collisionEndEventListeners.push(f);
}
CollisionBoxHandeler.prototype.run = function () {

	// End previous collisions.
	if(physicsSimulator.tick == 7){
		//debugger;
	}
	while (this.collisionEndQueue.length > 0) {
		//debugger;
		var cbA = this.collisionEndQueue.pop();
		var cbB = this.collisionEndQueue.pop();
		this.handleCollisionEndings(cbA, cbB);
		//this.topLevel.detectEndingOfCollisionsOfChildren(cbA, cbB, this.collisionEndQueue);
	}
	// Perform new collision detection.
	this.topLevel.recursiveCollisionDetection();
	this.handleCollisionExtraQue();
	// Save previous coordinates.
	this.topLevel.recursiveSavePreviousCoordinates();
	
	this.tick++;
}
CollisionBoxHandeler.prototype.handleCollisionExtraQue = function () {
	while (!this.extraCollisionsQueue.isEmpty()) {
		var into = this.extraCollisionsQueue.peek().into;
		var injection = this.extraCollisionsQueue.peek().injection;
		var injectedCollisionBox = this.extraCollisionsQueue.dequeue().injectedCollisionBox;

		// -Inject "injection" into "into"-
		function placeNode(node){
			// Insert the node into the sorted list by coordinate.
			while(node.next != null &&
				node.next.content.edge.coordinate < node.content.edge.coordinate
			){
				LinkedList.swapNodeWithNext(node);
			}
		}
		// Top.
		injectedCollisionBox.topNode = into.edgesVertical.addFirst(new EdgeCapsule(injection.top, injectedCollisionBox));
		placeNode(injectedCollisionBox.topNode);
		// Bottom.
		injectedCollisionBox.bottomNode = into.edgesVertical.addFirst(new EdgeCapsule(injection.bottom, injectedCollisionBox));
		placeNode(injectedCollisionBox.bottomNode);
		// Right.
		injectedCollisionBox.rightNode = into.edgesHorizontal.addFirst(new EdgeCapsule(injection.right, injectedCollisionBox));
		placeNode(injectedCollisionBox.rightNode);
		// Left.
		injectedCollisionBox.leftNode = into.edgesHorizontal.addFirst(new EdgeCapsule(injection.left, injectedCollisionBox));
		placeNode(injectedCollisionBox.leftNode);

		// -Test for collision-
		function collisionDetect(node, edges, collisionBoxHandeler){
			var cbA = node.content.injector;
			for (var compareNode = edges.first; compareNode != null; compareNode = compareNode.next) {
				if(compareNode == node){
					continue;
				}
				var cbB = compareNode.content.injector;
				if(cbA == cbB ||
					cbA.isInjection && cbB.isInjection){
					continue;
				}
				// Compare for collision.
				physicsSimulator.d0++;
				collisionBoxHandeler.testAndHandleCollision(cbA, cbB);
				// Queue for collision ending.
				collisionBoxHandeler.collisionEndQueue.push(cbA); // Them being added after each other means they will compare. It is not wrong that cbA is added many times.
				collisionBoxHandeler.collisionEndQueue.push(cbB);
			}
		}
		// Top.
		collisionDetect(injectedCollisionBox.topNode, into.edgesVertical, this);
		// Bottom.
		collisionDetect(injectedCollisionBox.bottomNode, into.edgesVertical, this);
		// Right.
		collisionDetect(injectedCollisionBox.rightNode, into.edgesHorizontal, this);
		// Left.
		collisionDetect(injectedCollisionBox.leftNode, into.edgesHorizontal, this);
	}
}
CollisionBoxHandeler.prototype.testAndHandleCollision = function (cbA, cbB) {
	if(CollisionBox.isColliding(cbA, cbB) && !CollisionBox.collisionIsDetected(cbA, cbB)){
		// Create collision data.
		var referenceA;
		var referenceB;
		if(cbA.isInjection){
			referenceA = cbA.collisionBoxReference;
		}else{
			referenceA = cbA;
		}
		if(cbB.isInjection){
			referenceB = cbB.collisionBoxReference;
		}else{
			referenceB = cbB;
		}
		referenceA.collidingCollisionBoxes.push(referenceB);
		referenceB.collidingCollisionBoxes.push(referenceA);
		if(
			!cbA.isInjection && !cbB.isInjection ||
			!cbA.isInjection && cbB.canInject ||
			!cbB.isInjection && cbA.canInject
		){
			// Inject collision boxes into each other.
			var injetionB;
			var injetionA;
			if(referenceA.children.length > 0){
				injetionB = referenceA.injectCollisionBox(cbB);
			}
			if(referenceB.children.length > 0){
				injetionA = referenceB.injectCollisionBox(cbA);
			}
			// If both injections can create further injections, duplicate collisions would be detected. To prevent this, one injection cannot further inject. The biggest one is disabled for performance reasons.
			/*if(CollisionBox.isBiggerThan(cbA, cbB)){ // cbA ">" cbB.
				injetionA.canInject = false;
			}else{
				injetionB.canInject = false;
			}*/
		}
		// Callbacks.
		for (var i = 0; i < this.collisionStartEventListeners.length; i++) {
			this.collisionStartEventListeners[i](referenceA, referenceB);
		}
	}
}
CollisionBoxHandeler.prototype.handleCollisionEndings = function (cbA, cbB) {
	// Has collision box A (cbA) or cbB stopped colliding? If so, remove all spawned injections.
	if(!CollisionBox.isColliding(cbA, cbB)){
		// Remove collision data.
		
		var referenceA;
		if(cbA.isInjection){
			referenceA = cbA.collisionBoxReference;
		}else{
			referenceA = cbA;
		}
		var referenceB;
		if(cbB.isInjection){
			referenceB = cbB.collisionBoxReference;
		}else{
			referenceB = cbB;
		}
		if(CollisionBox.collisionIsDetected(cbA, cbB)){
			//
			var indexB = referenceA.collidingCollisionBoxes.indexOf(referenceB);
			if(indexB == -1){
				debugger;
			}
			referenceA.collidingCollisionBoxes.splice(indexB, 1);
			
			var indexA = referenceB.collidingCollisionBoxes.indexOf(referenceA);
			if(indexA == -1){
				debugger;
			}
			referenceB.collidingCollisionBoxes.splice(indexA, 1);
			// Callbacks.
			for (var i = 0; i < this.collisionEndEventListeners.length; i++) {
				this.collisionEndEventListeners[i](referenceA, referenceB);
			}
		}

		// Recursively remove injections. // TODO: Can be optimized using hash table.
		for (var node = cbA.spawnedInjections.first; node != null; node = node.next) {
			var injectedCollisionBox = node.content;
			if(injectedCollisionBox.injectedIntoReference == referenceB){
				injectedCollisionBox.deleteInjected();
			}
		}
		for (var node = cbB.spawnedInjections.first; node != null; node = node.next) {
			var injectedCollisionBox = node.content;
			if(injectedCollisionBox.injectedIntoReference == referenceA){
				injectedCollisionBox.deleteInjected();
			}
		}
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.collision_box_handeler', true);