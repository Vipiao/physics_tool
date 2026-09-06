
AnimatedObject.nrOfAnimatedObjects = 0;
function AnimatedObject (polygon, mesh, animator){
	this.id = AnimatedObject.nrOfAnimatedObjects++;

	this.polygon = polygon;
	this.mesh = mesh;
	this.animator = animator;

	//
	this.fixedConstraints = [];
	this.hingeConstraints = [];
	this.ropes = [];

	this.isDeleted = false;
}
AnimatedObject.prototype.delete = function () {
	if(this.isDeleted){
		return;
	}
	this.isDeleted = true;

	this.polygon.delete();
	this.mesh.delete();
	this.animator.animatedObjects.splice(this.animator.animatedObjects.indexOf(this), 1);

	// Delete hinges.
	for (let i = this.fixedConstraints.length-1; i >= 0; i--) {
		const fc = this.fixedConstraints[i];
		fc.delete();
	}
	for (let i = this.hingeConstraints.length-1; i >= 0; i--) {
		const hc = this.hingeConstraints[i];
		hc.delete();
	}

	// Delete ropes.
	for (let i = this.ropes.length-1; i >= 0; i--) {
		const r = this.ropes[i];
		r.delete();
	}
}
AnimatedObject.prototype.getId = function () {
	return this.id;
}
AnimatedObject.prototype.setColor = function (color) {
	this.mesh.color = color.clone();
}
AnimatedObject.prototype.getColor = function () {
	return this.mesh.color.clone();
}
AnimatedObject.prototype.setPosition = function (position) {
	this.polygon.setPosition(position);
}
AnimatedObject.prototype.getPosition = function () {
	return this.polygon.getPosition();
}
AnimatedObject.prototype.setVelocity = function (velocity) {
	this.polygon.velocity = velocity.clone();
}
AnimatedObject.prototype.getVelocity = function () {
	return this.polygon.velocity.clone();
}
AnimatedObject.prototype.setVelocityAtPosition = function (position, targetVelocity) {
	this.polygon.setVelocityAtPosition(position, targetVelocity);
}
AnimatedObject.prototype.getOrientation = function () {
	return this.polygon.orientation;
}
AnimatedObject.prototype.setOrientation = function (orientation) {
	this.polygon.setOrientation(orientation);
}
AnimatedObject.prototype.setAngularVelocity = function (a) {
	this.polygon.angularVelocity = a;
}
AnimatedObject.prototype.getAngularVelocity = function () {
	return this.polygon.angularVelocity;
}
AnimatedObject.prototype.isAffectedByGravity = function () {
	return this.polygon.isAffectedByGravity;
}
AnimatedObject.prototype.setIsAffectedByGravity = function (isAffectedByGravity) {
	this.polygon.isAffectedByGravity = isAffectedByGravity;
}
AnimatedObject.prototype.getIsAffectedByGravity = function (isAffectedByGravity) {
	return this.polygon.isAffectedByGravity;
}
AnimatedObject.prototype.setDensity = function (newDensity) {
	this.polygon.setDensity(newDensity);
}
AnimatedObject.prototype.getDensity = function () {
	return this.polygon.getDensity();
}
AnimatedObject.prototype.setMass = function (newMass) {
	this.polygon.setMass(newMass);
}
AnimatedObject.prototype.getMass = function () {
	return this.polygon.getMass();
}
AnimatedObject.prototype.getMomentOfInertia = function () {
	return this.polygon.momentOfInertia;
}
AnimatedObject.prototype.setIsStatic = function (isStatic) {
	this.polygon.setIsStatic(isStatic);
}
AnimatedObject.prototype.getIsStatic = function () {
	return this.polygon.isStatic;
}
AnimatedObject.prototype.setDynamicFrictionConstant = function (newConstant) {
	this.polygon.setDynamicFrictionConstant(newConstant);
}
AnimatedObject.prototype.getDynamicFrictionConstant = function () {
	return this.polygon.getDynamicFrictionConstant();
}
AnimatedObject.prototype.setStaticFrictionConstant = function (newConstant) {
	this.polygon.setStaticFrictionConstant(newConstant);
}
AnimatedObject.prototype.getStaticFrictionConstant = function () {
	return this.polygon.getStaticFrictionConstant();
}
AnimatedObject.prototype.setBounceFactor = function (newBounceFactor) {
	this.polygon.setBounceFactor(newBounceFactor);
}
AnimatedObject.prototype.getBounceFactor = function () {
	return this.polygon.getBounceFactor();
}
AnimatedObject.prototype.positionDetect = function (position) {
	return this.polygon.positionDetect(position);
}
AnimatedObject.prototype.applyImpulse = function (position, impulse) {
	this.polygon.applyImpulse(position, impulse);
}
AnimatedObject.prototype.applyDisplacement = function (position, displacement) {
	this.polygon.applyDisplacement(position, displacement);
}
AnimatedObject.prototype.localToWorldCoordinates = function (localCoordinate) {
	return this.polygon.localToWorldCoordinates(localCoordinate);
}
AnimatedObject.prototype.worldToLocalCoordinates = function (worldCoordinate) {
	return this.polygon.worldToLocalCoordinates(worldCoordinate);
}
AnimatedObject.prototype.getVelocityAtPosition = function (position) {
	return this.polygon.getVelocityAtPosition(position);
}
AnimatedObject.prototype.getAverageForces = function () {

	/*
	Format:
	[
		...,
		{
			"force": force,
			"normalForce": normalForce,
			"frictionForce": frictionForce,
			"point": point,
		},
		...,
	]
	*/

	var forceData = this.polygon.getForceVectors();

	var averageForcesData = [];

	for (let i = 0; i < forceData.length; i++) {
		const interaction = forceData[i];
		
		if (interaction.normalForces.length == 0) {
			continue;
		}

		var averagePoint = new Vec2();
		var sumForce = new Vec2();
		var sumNormalForce = new Vec2();
		var sumFrictionForce = new Vec2();
		var sumForceMagnitudes = 0;

		for (let k = 0; k < interaction.normalForces.length; k++) {
			const nf = interaction.normalForces[k].force;
			const point = interaction.normalForces[k].point;
			sumNormalForce.add(nf);
			sumForce.add(nf);
			averagePoint.add(Vec2.mul(point, nf.mag()));
			sumForceMagnitudes += nf.mag();
		}
		for (let k = 0; k < interaction.frictionForces.length; k++) {
			const ff = interaction.frictionForces[k].force;
			const point = interaction.frictionForces[k].point;
			sumFrictionForce.add(ff);
			sumForce.add(ff);
			averagePoint.add(Vec2.mul(point, ff.mag()));
			sumForceMagnitudes += ff.mag();
		}
		if (sumForceMagnitudes == 0) {
			continue;
		}
		averagePoint.div(sumForceMagnitudes);

		averageForcesData.push({
			"force": sumForce,
			"normalForce": sumNormalForce,
			"frictionForce": sumFrictionForce,
			"point": averagePoint,
		});
	}

	return averageForcesData;
}
AnimatedObject.areOverlapping = function (gA, gB) {
	return Polygon.areOverlapping(gA.polygon, gB.polygon);
}
AnimatedObject.areOverlappingPrevFrame = function (gA, gB) {
	return Polygon.areOverlappingPrevFrame(gA.polygon, gB.polygon);
}
AnimatedObject.prototype.stringify = function () {
	/*var r = {
		"positionX": this.getPosition().x,
		"positionY": this.getPosition().y,
		"orientation": this.getOrientation(),
		""
		"velocity": this.getVelocity().x,
		"velocity": this.getVelocity().y,
		"colorR:": this.getColor().x,
		"colorG:": this.getColor().y,
		"colorB:": this.getColor().z,
	};*/
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.animated_object', true);