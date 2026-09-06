
Pulley.nrOfCreatedPulleys = 0;

function Pulley (phx) {
	this.id = Pulley.nrOfCreatedPulleys++;
	
	this.phx = phx;

	this.ropeA;
	this.ropeB;

	this.overrideRelativeVelocity;
	this.nrOfPulleysInChain;

	this.useFirstEndOfA;
	this.useFirstEndOfB;

	this.hasAttachedA = false;
	this.hasAttachedB = false;

	this.previousOffset = 0;

	this.hasBeenAdjusted = false;

	this.isDeleted = false;
	
}
Pulley.prototype.delete = function () {
	if (this.isDeleted) {
		return;
	}
	this.isDeleted = true;

	var index = this.phx.pulleys.indexOf(this);
	this.phx.pulleys.splice(index, 1);

	if (this.hasAttachedA) {
		if (this.useFirstEndOfA) {
			this.ropeA.pulleyA = null;
		} else {
			this.ropeA.pulleyB = null;
		}
	}
	if (this.hasAttachedB) {
		if (this.useFirstEndOfB) {
			this.ropeB.pulleyA = null;
		} else {
			this.ropeB.pulleyB = null;
		}
	}
}
Pulley.prototype.attachRopesA = function (ropeA, useFirstEndOfA) {
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

	this.ropeA = ropeA;
	this.useFirstEndOfA = useFirstEndOfA;
	this.hasAttachedA = true;

	//this.ropeA.friction = 0.01;

	return true;
}
Pulley.prototype.attachRopesB = function (ropeB, useFirstEndOfB) {
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

	this.ropeB = ropeB;
	this.useFirstEndOfB = useFirstEndOfB;
	this.hasAttachedB = true;

	//this.ropeB.friction = 0.01;

	return true;
}
Pulley.prototype.detachRope = function (rope) {
	if (this.ropeA == rope) {
		this.ropeA == null;
		this.useFirstEndOfA = null;
		this.hasAttachedA = false;
	}else if(this.ropeB == rope){
		this.ropeB == null;
		this.useFirstEndOfB = null;
		this.hasAttachedB = false;
	}
}
Pulley.prototype.adjustRopesLengths = function () {
	if (this.hasBeenAdjusted) {
		return;
	}
	if (!this.hasAttachedA) {
		if (this.hasAttachedB) {
			this.ropeB.length = this.totalLength;
		}
		return;
	}
	if (!this.hasAttachedB) {
		if (this.hasAttachedA) {
			this.ropeA.length = this.totalLength;
		}
		return;
	}

	this.hasBeenAdjusted = true;

	var pulleyChain = [this];
	var ropeChain = [];

	var ropeInFocus;
	for (let i = 0; i < 2; i++) {
		if (i == 0) {
			ropeInFocus = this.ropeA;
		}else{ // i == 1
			ropeInFocus = this.ropeB;
			if (ropeInFocus.pulleyA != null && ropeInFocus.hasBeenAdjusted && ropeInFocus.pulleyB != null && ropeInFocus.hasBeenAdjusted) {
				break; // The pulleys are forming a loop.
			}
		}
		var iterations = 0;
		while (true) {
			iterations++;
			if (iterations > 1000) {
				debugger; // To prevent complete freeze if error happens.
				return;
			}
			ropeChain.push(ropeInFocus);
			if (
				ropeInFocus.pulleyA != null &&
				!ropeInFocus.pulleyA.hasBeenAdjusted &&
				ropeInFocus.pulleyA.hasAttachedA &&
				ropeInFocus.pulleyA.hasAttachedB
			) {
				ropeInFocus.pulleyA.hasBeenAdjusted = true;
				pulleyChain.push(ropeInFocus.pulleyA);
				if (ropeInFocus.pulleyA.ropeA == ropeInFocus) {
					ropeInFocus = ropeInFocus.pulleyA.ropeB;
				}else{
					ropeInFocus = ropeInFocus.pulleyA.ropeA;
				}
			}else if(
				ropeInFocus.pulleyB != null &&
				!ropeInFocus.pulleyB.hasBeenAdjusted &&
				ropeInFocus.pulleyB.hasAttachedA &&
				ropeInFocus.pulleyB.hasAttachedB
			){
				ropeInFocus.pulleyB.hasBeenAdjusted = true;
				pulleyChain.push(ropeInFocus.pulleyB);
				if (ropeInFocus.pulleyB.ropeA == ropeInFocus) {
					ropeInFocus = ropeInFocus.pulleyB.ropeB;
				}else{
					ropeInFocus = ropeInFocus.pulleyB.ropeA;
				}
			}else{
				break;
			}
		}
	}

	// Find total length of rope.
	var totalLength = 0;
	for (let i = 0; i < ropeChain.length; i++) {
		const r = ropeChain[i];
		totalLength += r.length;
	}

	// Find real total length of rope.
	var totalRealLength = 0;
	for (let i = 0; i < ropeChain.length; i++) {
		const r = ropeChain[i];
		totalRealLength += r.getRealLength();
	}

	var totalOffset = totalRealLength - totalLength;
	/*if (totalOffset <= 0) {
		for (let i = 0; i < ropeChain.length; i++) {
			const r = ropeChain[i];
			r.length = Infinity;
		}
		return;
	}*/

	// Get total collision mass.
	var collisionMassProduct = 1;
	for (let i = 0; i < ropeChain.length; i++) {
		const r = ropeChain[i];
		var cm = r.getCollisionMass();
		if (cm == Infinity) {
			continue;
		}
		collisionMassProduct *= cm;
	}
	var divisor = 0;
	for (let i = 0; i < ropeChain.length; i++) {
		const r = ropeChain[i];
		var cm = r.getCollisionMass();
		if (cm == Infinity) {
			continue;
		}
		divisor += collisionMassProduct / cm;
	}

	// Distribute rope length.
	for (let i = 0; i < ropeChain.length; i++) {
		const r = ropeChain[i];
		var cm = r.getCollisionMass();
		if (cm == Infinity) {
			r.length = r.getRealLength();
			continue;
		}
		r.length = r.getRealLength() - totalOffset * collisionMassProduct / cm / divisor;
	}

	// Find total relative velocity.
	var totalRelativeVelocity = 0;
	for (let i = 0; i < ropeChain.length; i++) {
		const r = ropeChain[i];
		totalRelativeVelocity += r.getRelativeVelocity();
	}

	// Apply to all pulleys.
	for (let i = 0; i < pulleyChain.length; i++) {
		const p = pulleyChain[i];
		p.overrideRelativeVelocity = totalRelativeVelocity;
		p.nrOfPulleysInChain = pulleyChain.length;
	}
}
Pulley.prototype.getContactWorldA = function () {
	if (!this.hasAttachedA) {
		return null;
	}else{
		if (this.useFirstEndOfA) {
			return this.ropeA.getContactWorldA();
		}else{
			return this.ropeA.getContactWorldB();
		}
	}
}
Pulley.prototype.getContactWorldB = function () {
	if (!this.hasAttachedB) {
		return null;
	}else{
		if (this.useFirstEndOfB) {
			return this.ropeB.getContactWorldA();
		}else{
			return this.ropeB.getContactWorldB();
		}
	}
}
/*Pulley.prototype.adjustRopesLengthsOLD = function (forceAdjust = false) {
	// This will adjust the lenths of the ropes so that the offset of the ropes are equal.

	if (!this.hasAttachedA) {
		if (this.hasAttachedB) {
			this.ropeB.length = this.totalLength;
		}
		return;
	}
	if (!this.hasAttachedB) {
		if (this.hasAttachedA) {
			this.ropeA.length = this.totalLength;
		}
		return;
	}

	var realLengthA = Vec2.sub(this.ropeA.getContactWorldA(), this.ropeA.getContactWorldB()).mag();
	var realLengthB = Vec2.sub(this.ropeB.getContactWorldA(), this.ropeB.getContactWorldB()).mag();

	if (!forceAdjust && realLengthA + realLengthB <= this.totalLength) {
		this.ropeA.length = Infinity;
		this.ropeB.length = Infinity;
		return;
	}

	var offset = realLengthA + realLengthB - this.totalLength;

	var collisionMassA = this.ropeA.getCollisionMass();
	var collisionMassB = this.ropeB.getCollisionMass();

	var offsetA = offset * collisionMassB / (collisionMassA + collisionMassB);
	var offsetB = offset - offsetA;

	this.ropeA.length = realLengthA - offsetA;
	this.ropeB.length = realLengthB - offsetB;

	// Adjust friction of ropes to reduce friction over the pulley.
	var offsetDifference = Math.abs(offset - this.previousOffset);
	this.overrideFriction = 1 / (1 + offsetDifference * 500);
	console.log(this.overrideFriction);
	
	
	this.previousOffset = offset;
}*/

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.pulley', true);