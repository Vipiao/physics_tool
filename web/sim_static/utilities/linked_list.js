
function LinkedList(){
	this.first;
	this.last;
	this.size = 0;
}
LinkedList.unitTest = function () {
	var testNr = 0;
	function isCorrect(linkedList, arrayList){
		if(linkedList.size != arrayList.length){
			return false;
		}
		if(linkedList.size == 0){
			if(linkedList.first == null && linkedList.last == null){
				return true;
			}else{
				return false;
			}
		}
		if(linkedList.first.previous != null || linkedList.last.next != null){
			return false;
		}
		if(linkedList.size == 0){
			if(linkedList.first == null && linkedList.last == null){
				return true;
			}else{
				return false;
			}
		}
		var node = linkedList.first;
		for (var i = 0; i < arrayList.length; i++) {
			var element = arrayList[i];
			if(node == null || node.content != element || node.list != linkedList){
				return false;
			}
			if(node.next != null){
				if(node.next.previous != node){
					return false;
				}
			}else{
				if(linkedList.last != node){
					return false;
				}
			}
			node = node.next;
		}
		return true;
	}
	function fail(testNr) {
		return "Failed unit test at test nr: " + testNr + ".\n";
	}

	testNr++;
	try{
		var l = new LinkedList();
		l.addFirst("First");
		if(!isCorrect(l, ["First"])){
			console.error(fail(testNr));
		}
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	testNr++;
	try{
		var l = new LinkedList();
		l.addFirst("First");
		l.addLast("Second");
		l.addLast("Third");
		l.addFirst("SuperFirst");

		if(!isCorrect(l, ["SuperFirst", "First", "Second", "Third"])){
			console.error(fail(testNr));
		}
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	testNr++;
	try{
		var l = new LinkedList();
		l.setFromArrayList(["A","B","C","D","E"]);

		if(!isCorrect(l, ["A","B","C","D","E"])){
			console.error(fail(testNr));
		}
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	// swapNodeWithPrevious and swapNodeWithNext test.
	testNr++;
	try{
		var l = new LinkedList();
		l.setFromArrayList(["A", "C", "D", "B", "E"]);
		if(!LinkedList.swapNodeWithPrevious(l.last.previous)){
			console.error(fail(testNr));
		}
		// Current starte: ["A", "C", "B", "D", "E"]
		if(!LinkedList.swapNodeWithNext(l.first.next)){
			console.error(fail(testNr));
		}
		// Current starte: ["A", "B", "C", "D", "E"]
		if(LinkedList.swapNodeWithNext(l.last)){
			console.error(fail(testNr));
		}
		// Current starte: ["A", "B", "C", "D", "E"]
		if(LinkedList.swapNodeWithPrevious(l.first)){
			console.error(fail(testNr));
		}
		// Current starte: ["A", "B", "C", "D", "E"]
		if(!LinkedList.swapNodeWithNext(l.first)){
			console.error(fail(testNr));
		}
		// Current starte: ["B", "A", "C", "D", "E"]
		if(!LinkedList.swapNodeWithPrevious(l.first.next)){
			console.error(fail(testNr));
		}
		// Current starte: ["A", "B", "C", "D", "E"]
		if(!LinkedList.swapNodeWithNext(l.last.previous)){
			console.error(fail(testNr));
		}
		// Current starte: ["A", "B", "C", "E", "D"]
		if(!LinkedList.swapNodeWithPrevious(l.last)){
			console.error(fail(testNr));
		}
		// Current starte: ["A", "B", "C", "D", "E"]

		if(!isCorrect(l, ["A","B","C","D","E"])){
			console.error(fail(testNr));
		}
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	// Node.prototype.remove test
	testNr++;
	try{
		var l = new LinkedList();
		l.setFromArrayList(["A","B","C","D","E"]);

		var nodeE =  l.last;
		nodeE.remove();
		if(!isCorrect(l, ["A","B","C","D"])){
			console.error(fail(testNr));
		}

		var nodeA =  l.first;
		nodeA.remove();
		if(!isCorrect(l, ["B","C","D"])){
			console.error(fail(testNr));
		}

		var nodeC =  l.first.next;
		nodeC.remove();
		if(!isCorrect(l, ["B","D"])){
			console.error(fail(testNr));
		}

		var node =  l.first;
		node.remove();
		node.next.remove();
		if(!isCorrect(l, [] || l.size != 0)){
			console.error(fail(testNr));
		}
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	// Success
	console.log("TEST SUCCESSFUL");
}
function Node(){
	this.list;

	this.next;
	this.previous;
	this.content;

	this.isRemoved = false;
}
Node.prototype.remove = function (){
	if(this.isRemoved){
		console.log("Tried to delete already deleted node!");
		return false;
	}else{
		this.isRemoved = true;
	}
	if(this.previous != null){
		this.previous.next = this.next;
	}else{
		this.list.first = this.next;
	}
	if(this.next != null){
		this.next.previous = this.previous;
	}else{
		this.list.last = this.previous;
	}
	this.list.size--;
}
LinkedList.hasEqualContent = function (listA, listB) {
	if(listA.size != listB.size){
		return false;
	}
	var nodeA = listA.first;
	var nodeB = listB.first;
	while(nodeA != null){
		if(nodeA.content != nodeB.content){
			return false;
		}
		nodeA = nodeA.next;
		nodeB = nodeB.next;
	}
	return true;
}
LinkedList.prototype.setFromArrayList = function (arrayList) {
	if(arrayList.length == 0){
		this.first = this.last = null;
	}
	this.first = new Node();
	this.first.list = this;
	this.first.content = arrayList[0];
	var previousNode = this.first;
	for (var i = 1; i < arrayList.length; i++) {
		var nextNode = new Node();
		nextNode.list = this;
		nextNode.content = arrayList[i];
		nextNode.previous = previousNode;
		previousNode.next = nextNode;

		previousNode = nextNode;
	}
	this.last = nextNode;
	this.size = arrayList.length;
}
LinkedList.prototype.toArrayList = function () {
	var arrayList = [];
	for(var n = this.first; n != null; n = n.next){
		arrayList.push(n.content);
	}
	return arrayList;
}
LinkedList.prototype.addFirst = function(content){
	var newNode = new Node();
	newNode.list = this;
	newNode.content = content;
	if(this.first == null){
		this.first = newNode;
		this.last = newNode;
	}else{
		this.first.previous = newNode;
		newNode.next = this.first;
		this.first = newNode;
	}
	this.size++;
	return newNode;
}
LinkedList.prototype.addLast = function(content){
	var newNode = new Node();
	newNode.list = this;
	newNode.content = content;
	if(this.first == null){
		this.first = newNode;
		this.last = newNode;
	}else{
		this.last.next = newNode;
		newNode.previous = this.last;
		this.last = newNode;
	}
	this.size++;
	return newNode;
}
LinkedList.swapNodeWithPrevious = function (node) {
	// Nodes will be swapped as below. A, prev, node and B are the nodes in order. The line below that show how it is after the swap. If the node has no previous, nothing will be done and false will be returned, otherwise the swap will happen and true will be returned.
	// A prev node B
	// A node prev B 

	var previousNode = node.previous;
	if(previousNode == null){
		return false;
	}
	
	// Set references.
	// Outer nodes and in.
	if(previousNode.previous == null){
		node.list.first = node;
	}else{
		previousNode.previous.next = node;
	}
	if(node.next == null){
		node.list.last = previousNode;
	}else{
		node.next.previous = previousNode;
	}
	// Inner nodes and out.
	node.previous = previousNode.previous;
	previousNode.next = node.next;
	// Between inner nodes.
	node.next = previousNode;
	previousNode.previous = node;

	return true;
}
LinkedList.swapNodeWithNext = function (node) {
	// Nodes will be swapped as below. A, node, next and B are the nodes in order. The line below that show how it is after the swap. If the node has no next, nothing will be done and false will be returned, otherwise the swap will happen and true will be returned.
	// A node next B
	// A next node B 

	var nextNode = node.next;
	if(nextNode == null){
		return false;
	}
	
	// Set references.
	// Outer nodes and in.
	if(nextNode.next == null){
		node.list.last = node;
	}else{
		nextNode.next.previous = node;
	}
	if(node.previous == null){
		node.list.first = nextNode;
	}else{
		node.previous.next = nextNode;
	}
	// Inner nodes and out.
	node.next = nextNode.next;
	nextNode.previous = node.previous;
	// Between inner nodes.
	node.previous = nextNode;
	nextNode.next = node;

	return true;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.linked_list', true);