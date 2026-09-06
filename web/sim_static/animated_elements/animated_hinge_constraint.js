
AnimatedHingeConstraint.nrCreatedAnimatedHingeConstraints = 0;

function AnimatedHingeConstraint (constraint, mesh, animator, animatedGameOjbectA, animatedGameOjbectB) {
	this.id = AnimatedHingeConstraint.nrCreatedAnimatedHingeConstraints++;

	this.constraint = constraint;
	this.mesh = mesh;
	this.animator = animator;
	
	this.animatedGameOjbectA = animatedGameOjbectA;
	this.animatedGameOjbectB = animatedGameOjbectB;

	this.animatedGameOjbectA.hingeConstraints.push(this);
	this.animatedGameOjbectB.hingeConstraints.push(this);

	this.isDeleted = false;
}
AnimatedHingeConstraint.prototype.delete = function () {
	if (this.isDeleted) {
		return;
	}
	this.isDeleted = true;

	var index = this.animator.hingeConstraints.indexOf(this);
	this.animator.hingeConstraints.splice(index, 1);
	
	var index = this.animatedGameOjbectA.hingeConstraints.indexOf(this);
	this.animatedGameOjbectA.hingeConstraints.splice(index, 1);

	var index = this.animatedGameOjbectB.hingeConstraints.indexOf(this);
	this.animatedGameOjbectB.hingeConstraints.splice(index, 1);

	this.constraint.delete();
	this.mesh.delete();
}
AnimatedHingeConstraint.prototype.getContactPoint = function () {
	this.constraint.calculateContactPoint();
	return this.constraint.contactPoint.clone();
}
AnimatedHingeConstraint.prototype.setFriction = function (newFriction) {
	this.constraint.friction = newFriction;
}
AnimatedHingeConstraint.prototype.getFriction = function () {
	return this.constraint.friction;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.animated_hinge_constraint', true);