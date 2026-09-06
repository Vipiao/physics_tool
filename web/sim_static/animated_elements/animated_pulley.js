
AnimatedPulley.nrCreatedAnimatedPulley = 0;

function AnimatedPulley (animator, pulley, mesh, ropeA, ropeB, useFirstEndOfA, useFirstEndOfB) {

	this.id = AnimatedPulley.nrCreatedAnimatedPulley++;

	this.animator = animator;

	this.pulley = pulley;
	this.mesh = mesh;

	this.ropeA = ropeA;
	this.ropeB = ropeB;

	this.useFirstEndOfA = useFirstEndOfA;
	this.useFirstEndOfB = useFirstEndOfB;

	if (useFirstEndOfA) {
		this.ropeA.pulleyA = this;
	}else{
		this.ropeA.pulleyB = this;
	}
	if (useFirstEndOfB) {
		this.ropeB.pulleyA = this;
	}else{
		this.ropeB.pulleyB = this;
	}

	this.isDeleted = false;
}
AnimatedPulley.prototype.delete = function () {
	if (this.isDeleted) {
		return;
	}
	this.isDeleted = true;

	var index = this.animator.pulleys.indexOf(this);
	this.animator.pulleys.splice(index, 1);
	
	if (this.ropeA != null) {
		if (this.useFirstEndOfA) {
			this.ropeA.pulleyA = null;
		} else {
			this.ropeA.pulleyB = null;
		}
	}
	if (this.ropeB != null) {
		if (this.useFirstEndOfB) {
			this.ropeB.pulleyA = null;
		} else {
			this.ropeB.pulleyB = null;
		}
	}

	this.pulley.delete();
	this.mesh.delete();
}
/*AnimatedPulley.prototype.attachRopesA = function (ropeA, useFirstEndOfA) {
	if (useFirstEndOfA) {
		if (ropeA.pulleyA != null) {
			return false;
		}
		ropeA.pulleyA = this;
	}else{
		if (ropeA.pulleyB != null) {
			return false;
		}
		ropeA.pulleyB = this;
	}

	this.pulley.attachRopesA(ropeA, useFirstEndOfA);
	this.ropeA = ropeA;
	this.useFirstEndOfA = useFirstEndOfA;

	return true;
}
AnimatedPulley.prototype.attachRopesB = function (ropeB, useFirstEndOfB) {
	if (useFirstEndOfB) {
		if (ropeB.pulleyA != null) {
			return false;
		}
		ropeB.pulleyA = this;
	}else{
		if (ropeB.pulleyB != null) {
			return false;
		}
		ropeB.pulleyB = this;
	}

	this.pulley.attachRopesB(ropeB, useFirstEndOfB);
	this.ropeB = ropeB;
	this.useFirstEndOfB = useFirstEndOfB;

	return true;
}*/
AnimatedPulley.prototype.getContactWorldA = function () {
	return this.pulley.getContactWorldA();
}
AnimatedPulley.prototype.getContactWorldB = function () {
	return this.pulley.getContactWorldB();
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.animated_pulley', true);