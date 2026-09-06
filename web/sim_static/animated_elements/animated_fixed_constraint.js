
AnimatedFixedConstraint.nrCreatedAnimatedFixedConstraint = 0;

function AnimatedFixedConstraint(constraint, mesh, animator, animatedGameOjbect) {

	this.id = AnimatedFixedConstraint.nrCreatedAnimatedFixedConstraint++;

	this.constraint = constraint;
	this.mesh = mesh;
	this.animator = animator;
	
	this.animatedGameOjbect = animatedGameOjbect

	this.animatedGameOjbect.fixedConstraints.push(this);
	
	this.isDeleted = false;
}
AnimatedFixedConstraint.prototype.delete = function () {
	if (this.isDeleted) {
		return;
	}
	this.isDeleted = true;

	var index = this.animator.fixedConstraints.indexOf(this);
	this.animator.fixedConstraints.splice(index, 1);
	
	var index = this.animatedGameOjbect.fixedConstraints.indexOf(this);
	this.animatedGameOjbect.fixedConstraints.splice(index, 1);
	
	this.constraint.delete();
	this.mesh.delete();
}
AnimatedFixedConstraint.prototype.getVelocity = function () {
	return this.constraint.velocity.clone();
}
AnimatedFixedConstraint.prototype.setVelocity = function (newVelocity) {
	this.constraint.velocity = newVelocity.clone();
}
AnimatedFixedConstraint.prototype.getWorldPosition = function () {
	return this.constraint.worldPosition.clone();
}
AnimatedFixedConstraint.prototype.setWorldPosition = function (newWorldPostition) {
	this.constraint.worldPosition = newWorldPostition.clone();
}
AnimatedFixedConstraint.prototype.setFriction = function (newFriction) {
	this.constraint.friction = newFriction;
}
AnimatedFixedConstraint.prototype.getFriction = function () {
	return this.constraint.friction;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.animated_fixed_constraint', true);