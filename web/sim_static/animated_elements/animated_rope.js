
AnimatedRope.nrCreatedAnimatedRopes = 0;

function AnimatedRope(rope, mesh, animator, animatedGameOjbectA, animatedGameOjbectB) {

	this.id = AnimatedRope.nrCreatedAnimatedRopes++;

	this.rope = rope;
	this.mesh = mesh;
	this.animator = animator;

	this.animatedGameOjbectA = animatedGameOjbectA;
	this.animatedGameOjbectB = animatedGameOjbectB;
	
	this.animatedGameOjbectA.ropes.push(this);
	this.animatedGameOjbectB.ropes.push(this);

	this.pulleyA;
	this.pulleyB;

	this.isDeleted = false;
}
AnimatedRope.prototype.delete = function () {
	if (this.isDeleted) {
		return;
	}
	this.isDeleted = true;
	
	var index = this.animator.ropes.indexOf(this);
	this.animator.ropes.splice(index, 1);
	
	var index = this.animatedGameOjbectA.ropes.indexOf(this);
	this.animatedGameOjbectA.ropes.splice(index, 1);

	var index = this.animatedGameOjbectB.ropes.indexOf(this);
	this.animatedGameOjbectB.ropes.splice(index, 1);



	// RANDOM NUMBER GENERATOR NO STRINGS ONLY NUMBEWRS!!!!!





	if (this.pulleyA != null) {
		this.pulleyA.delete();
	}
	if (this.pulleyB != null) {
		this.pulleyB.delete();
	}

	this.rope.delete();
	this.mesh.delete();
}
AnimatedRope.prototype.setLength = function (newLength) {
	this.rope.setLength(newLength);
}
AnimatedRope.prototype.resetLength = function () {
	this.rope.resetLength();
}
AnimatedRope.prototype.getLength = function () {
	return this.rope.getLength();
}
AnimatedRope.prototype.getContactWorldA = function () {
	return this.rope.getContactWorldA();
}
AnimatedRope.prototype.getContactWorldB = function () {
	return this.rope.getContactWorldB();
}
AnimatedRope.prototype.hasPulleyA = function () {
	return this.rope.pulleyA != null;
}
AnimatedRope.prototype.hasPulleyB = function () {
	return this.rope.pulleyB != null;
}
AnimatedRope.prototype.getPulleyA = function () {
	return this.rope.pulleyA;
}
AnimatedRope.prototype.getPulleyB = function () {
	return this.rope.pulleyB;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.animated_rope', true);