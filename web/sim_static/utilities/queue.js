/*
Example:
	var q = new Queue();
	console.log(q.size); // 0
	q.enqueue(1);
	q.enqueue(2);
	q.enqueue(3);
	q.enqueue(4);
	console.log(q.size); // 4
	console.log(q.dequeue()) // 1
	console.log(q.dequeue()) // 2
	console.log(q.peek()) // 3
	console.log(q.peek()) // 3
	console.log(q.isEmpty()); // false
	q.dequeue();
	q.dequeue();
	console.log(q.isEmpty()); // true
	debugger;
	q.enqueueArray([1,2,3,4]);
	console.log(q.dequeue()); // 1
	console.log(q.dequeue()); // 2
*/

function Queue(){
	this.list = [];
	this.firstIndex = null;
	this.lastIndex = null;
	this.size = 0;
}
Queue.unitTest = function () {
	var testNr = 0;
	function isCorrect(q, l){
		if(q.size != l.length){
			return false;
		}
		var queArray = q.toArray();
		if(queArray.length != l.length){
			return false;
		}
		for (var i = 0; i < l.length; i++) {
			var element = l[i];
			if(queArray[i] != l[i]){
				return false;
			}
		}
		return true;
	}
	function fail(testNr) {
		return "Failed unit test at test nr: " + testNr + ".\n";
	}

	testNr++;
	try{
		var q = new Queue();
		q.enqueue(1);
		if(!isCorrect(q, [1])){
			console.error(fail(testNr));
		}
		q.enqueue(2);
		q.enqueue(3);
		q.enqueue(4);
		q.enqueue(5);
		q.enqueue(6);
		if(!isCorrect(q, [1,2,3,4,5,6])){
			console.error(fail(testNr));
		}
		if(q.dequeue() != 1){
			console.error(fail(testNr));
		}
		if(q.dequeue() != 2){
			console.error(fail(testNr));
		}
		if(q.dequeue() != 3){
			console.error(fail(testNr));
		}
		if(q.dequeue() != 4){
			console.error(fail(testNr));
		}
		if(!isCorrect(q, [5,6])){
			console.error(fail(testNr));
		}
		q.enqueue(7);
		q.enqueue(8);
		q.enqueue(9);
		q.enqueue(10);
		if(!isCorrect(q, [5,6,7,8,9,10])){
			console.error(fail(testNr));
		}
		q.enqueue(11);
		q.enqueue(12);
		q.enqueue(13);
		if(q.dequeue() != 5){
			console.error(fail(testNr));
		}
		q.enqueue(14);
		if(!isCorrect(q, [6,7,8,9,10,11,12,13,14])){
			console.error(fail(testNr));
		}
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	testNr++;
	try{
		var q = new Queue();
		q.enqueue(1);
		q.enqueue(2);
		q.enqueue(3);
		q.enqueue(4);
		q.enqueue(5);
		q.dequeue();
		q.dequeue();
		q.dequeue();
		q.enqueue(6);
		q.enqueueArray([7]);
		q.enqueueArray([8,9]);
		if(!isCorrect(q, [4,5,6,7,8,9])){
			console.error(fail(testNr));
		}
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	testNr++;
	try{
		var q = new Queue();
		if(q.size != 0){
			console.error(fail(testNr));
		}
		q.enqueue(1);
		q.enqueue(2);
		q.enqueue(3);
		q.enqueue(4);
		if(q.size != 4){
			console.error(fail(testNr));
		}
		if(q.dequeue() != 1){
			console.error(fail(testNr));
		}
		if(q.dequeue() != 2){
			console.error(fail(testNr));
		}
		if(q.peek() != 3){
			console.error(fail(testNr));
		}
		if(q.peek() != 3){
			console.error(fail(testNr));
		}
		if(q.isEmpty() != false){
			console.error(fail(testNr));
		}
		q.dequeue();
		q.dequeue();
		if(q.isEmpty() != true){
			console.error(fail(testNr));
		}
		q.enqueueArray([1,2,3,4]);
		if(q.dequeue() != 1){
			console.error(fail(testNr));
		}
		if(q.dequeue() != 2){
			console.error(fail(testNr));
		}
		if(!isCorrect(q, [3,4])){
			console.error(fail(testNr));
		}
		
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	testNr++;
	try{
		var q = new Queue();
		q.enqueueArray([]);
		if(!isCorrect(q, []) || q.size != 0){
			console.error(fail(testNr));
		}
		
	} catch(e){
		console.error(fail(testNr) + e.stack);
	}

	// Success
	console.log("TEST SUCCESSFUL");
}
Queue.prototype.isEmpty = function () {
	if(this.size == 0){
		return true;
	}else{
		return false;
	}
}
Queue.prototype.dequeue = function () {
	if(this.isEmpty()){
		return null;
	}
	var item = this.list[this.firstIndex];
	this.list[this.firstIndex] = null;
	if(this.firstIndex == this.list.length - 1){
		this.firstIndex = 0;
	}else{
		this.firstIndex++;
	}
	this.size--;
	if(this.isEmpty()){
		this.firstIndex = null;
		this.lastIndex = null;
	}

	return item;
}
Queue.prototype.enqueue = function (item) {
	if(this.isEmpty()){
		this.firstIndex = 0;
		this.lastIndex = -1;
	}
	this.lastIndex++;
	if(this.lastIndex > this.firstIndex && this.firstIndex * 2 > this.list.length){
		this.lastIndex = 0;
	} else if(this.lastIndex == this.firstIndex && !this.isEmpty()){ // The que has bitten itself in its tail and need to be reset.
		this.list = this.list.slice(this.firstIndex).concat(this.list.slice(0, this.firstIndex));
		this.firstIndex = 0;
		this.lastIndex = this.list.length; // The this.list.length will increase, see below.
	}
	if(this.lastIndex == this.list.length){
		this.list.push(item);
	}else{
		this.list[this.lastIndex] = item; // TODO: Optimize if push() can be used.
	}
	this.size++;
}
Queue.prototype.enqueueArray = function (list) {
	for(var i=0; i<list.length; i++){
		this.enqueue(list[i]);
	}
}
Queue.prototype.peek = function () {
	if(this.isEmpty()){
		return null;
	}else{
		return this.list[this.firstIndex];
	}
}
Queue.prototype.toArray = function () {
	var l;
	if(this.firstIndex <= this.lastIndex){
		l = this.list.slice(this.firstIndex, this.list.length);
	}else{
		l = this.list.slice(this.firstIndex).concat(this.list.slice(0, this.lastIndex + 1));
	}
	return l;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.queue', true);