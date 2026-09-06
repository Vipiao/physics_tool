

ContactPoint.MAX_LIFETIME = 10;
function ContactPoint (vertexA, vertexB, nextVertexA, nextVertexB){
	
	this.lifeTime = ContactPoint.MAX_LIFETIME;

	this.vertexA = vertexA;
	this.vertexB = vertexB;

	this.nextVertexA = nextVertexA;
	this.nextVertexB = nextVertexB;

	this.shadowVertexA = vertexA.previousWorldPosition;
	this.shadowNextVertexA = nextVertexA.previousWorldPosition;
	this.shadowVertexB = vertexB.previousWorldPosition;
	this.shadowNextVertexB = nextVertexB.previousWorldPosition;

	this.potentialShadowVertexA;
	this.potentialShadowNextVertexA;
	this.potentialShadowVertexB;
	this.potentialShadowNextVertexB;

	this.collisionGroup;

	this.cornerAIsColliding = false;
	this.cornerBIsColliding = false;

	this.previousCornerAIsColliding = false;
	this.previousCornerBIsColliding = false;

	this.collisionNodeA;
	this.collisionNodeB;

	// The normals of the collision. They point in the direction of the corners.
	this.normalA;
	this.normalB;

	// Used in friction calculation. Points in the counter clockwise direction.
	this.tangentA;
	this.tangentB;

	// Records of normal impulses.
	this.normalImpulseA;
	this.normalImpulseB;

	// Records of friction impulses.
	this.frictionImpulseA;
	this.frictionImpulseA;

	// If true, impulse will be applied. If the corner is on the inside of the segment, impulse is applied.
	this.applyImpulseA;
	this.applyImpulseB;

	// How much friction can be applied this tick?
	//this.frictionMeterA = 0;
	//this.frictionMeterB = 0;

	// Force compensators.
	this.normalCompensatorA = 0;
	this.normalCompensatorB = 0;

	//
	this.frictionCompensatorA = 0;
	this.frictionCompensatorB = 0;

	// Collision times.
	this.collisionTimeA;
	this.collisionTimeB;

	// Bouncing remover.
	this.bouncingCounterA = 0; // Used to make collisions more inelastic the more often they collide.
	this.bouncingCounterB = 0;
}
ContactPoint.unitTest = function () {
	var testNr = 0;
	
	// -ContactPoint.cornerSegmentAreColliding-
	
	/*if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3,3), new Vec2(3,4), // Point motion.
		new Vec2(3,2), new Vec2(2,2), // Segment start motion.
		new Vec2(4,2), new Vec2(2,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;
	
	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3,4), new Vec2(3,3), // Point motion.
		new Vec2(3,2), new Vec2(2,2), // Segment start motion.
		new Vec2(4,2), new Vec2(2,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3,3.01), new Vec2(3,4), // Point motion.
		new Vec2(3,2), new Vec2(2,2), // Segment start motion.
		new Vec2(4,2), new Vec2(2,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3.5,2.5), new Vec2(4,4), // Point motion.
		new Vec2(3,2), new Vec2(2,2), // Segment start motion.
		new Vec2(4,2), new Vec2(2,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,1), new Vec2(5,4), // Point motion.
		new Vec2(4,2), new Vec2(2,2), // Segment start motion.
		new Vec2(6,3), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,1), new Vec2(5.1,4), // Point motion.
		new Vec2(4,2), new Vec2(2,2), // Segment start motion.
		new Vec2(6,3), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,1), new Vec2(6,2), // Point motion.
		new Vec2(4,2), new Vec2(2,2), // Segment start motion.
		new Vec2(6,3), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3,2), new Vec2(2,4), // Point motion.
		new Vec2(4,2), new Vec2(2,2), // Segment start motion.
		new Vec2(6,3), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5.5,3.5), new Vec2(5,5), // Point motion.
		new Vec2(4,2), new Vec2(2,2), // Segment start motion.
		new Vec2(6,3), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,1), new Vec2(1,2), // Point motion.
		new Vec2(4,2), new Vec2(2,2), // Segment start motion.
		new Vec2(6,3), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4.5,3), new Vec2(3,5), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4.5,3.1), new Vec2(3,5), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4.5,2.9), new Vec2(3,5), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,4), new Vec2(2.5,4), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,4), new Vec2(2.5,4.1), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,4), new Vec2(2.5,3.9), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,3), new Vec2(3,5), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,3), new Vec2(1,5), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3,4), new Vec2(2,4), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,2.5), new Vec2(3,3), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3.9,2.6), new Vec2(3,3), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,2), new Vec2(2.4,3.7), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,2), new Vec2(2.4,3.6), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,3), new Vec2(5,5), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5.2,3.1), new Vec2(5,5), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3,2), new Vec2(-1,2), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(2.8,1.9), new Vec2(-1,2), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,3), new Vec2(2,4), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4.6, 2.8), new Vec2(2.6, 3.8), // Point motion.
		new Vec2(3,2), new Vec2(1,3), // Segment start motion.
		new Vec2(5,3), new Vec2(2,3.5), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(2,2), new Vec2(1,3), // Point motion.
		new Vec2(1,3), new Vec2(2,3), // Segment start motion.
		new Vec2(2,5), new Vec2(4,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(2,2), new Vec2(0,5), // Point motion.
		new Vec2(1,3), new Vec2(2,3), // Segment start motion.
		new Vec2(2,5), new Vec2(4,4), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(6,2), new Vec2(4,3), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,4), new Vec2(5,2), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,5), new Vec2(5,2), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(1,5), new Vec2(0,4), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(2,6), new Vec2(0,4), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(2,6), new Vec2(1.5,3.5), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(2,6), new Vec2(1.4,3.5), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(1,2), new Vec2(1,2), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(1,2), new Vec2(1,1.9), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(1,2), new Vec2(0.9,2), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(1,2), new Vec2(0.9,1.9), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(4,5), new Vec2(4,5), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3.5,5), new Vec2(4,5), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3.5,4.9), new Vec2(4,5), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3.5,5.1), new Vec2(4,5), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(3,5), new Vec2(4,5), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!ContactPoint.cornerSegmentAreColliding(
		//   Previous,           now,
		new Vec2(5,6), new Vec2(2,4), // Point motion.
		new Vec2(2,3), new Vec2(1,2), // Segment start motion.
		new Vec2(3,6), new Vec2(3,3), // Segment end motion.
	)){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;*/

	// -ContactPoint.calculateNormalDirection-

	function testCalculateNormalDirection (direction, answer) {
		return Vec2.dot(direction, answer) > 0 && Vec2.det(direction, answer) == 0;
	}

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(2,1), // corner.
		new Vec2(1,3), // cornerPrevious.
		new Vec2(3,3), // cornerNext.
		new Vec2(3,1), // segmentStart.
		new Vec2(1,1), // segmentEnd.
	), new Vec2(0,2))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(4,5), // cornerPrevious.
		new Vec2(6,3), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(3,3))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(4,5), // cornerPrevious.
		new Vec2(4,0.5), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(1.5, 1))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(1,3), // cornerPrevious.
		new Vec2(4.5,1.5), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(1,2))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(1,3), // cornerPrevious.
		new Vec2(2.5,0.5), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(3,3))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(1,3), // cornerPrevious.
		new Vec2(4,2), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(1,2))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(1,3), // cornerPrevious.
		new Vec2(5,0.5), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(1.5,2))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(0.5,1.5), // cornerPrevious.
		new Vec2(1,3), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(-0.5, 2.5))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(0.5,1.5), // cornerPrevious.
		new Vec2(1.5,3.5), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(-0.5, 2.5))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;

	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(3.5,1.5), // cornerPrevious.
		new Vec2(2,0.5), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(1.5, -1))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;
	
	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(3.5,0.5), // cornerPrevious.
		new Vec2(1,1), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(1,-2))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;
	
	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(3.5,0.5), // cornerPrevious.
		new Vec2(3.5,4), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(-2,0.5))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;
	
	if(!testCalculateNormalDirection(ContactPoint.calculateNormalDirection(
		new Vec2(3,2), // corner.
		new Vec2(2.5,4), // cornerPrevious.
		new Vec2(2,0.5), // cornerNext.
		new Vec2(4,1), // segmentStart.
		new Vec2(1,4), // segmentEnd.
	), new Vec2(2,0.5))){
		console.error("The test failed at test nr: " + testNr);
		return;
	}
	testNr++;
	
	// Success
	console.log("TEST WAS SUCCESSFUL!");
	
}
ContactPoint.prototype.handleCollisionDetection = function () {
	// This will perform collision detection between the two vertices. First, one will be considered a corner, and the other a segment, after that the roles will switch.

	// Check for collison.
	this.previousCornerAIsColliding = this.cornerAIsColliding;
	this.previousCornerBIsColliding = this.cornerBIsColliding;

	if(this.collisionGroup.previousNumberOfContacts == 0){
		this.collisionTimeA = ContactPoint.cornerSegmentAreColliding(
			this.vertexA.previousWorldPosition, this.vertexA.worldPosition,
			this.vertexB.previousWorldPosition, this.vertexB.worldPosition,
			this.nextVertexB.previousWorldPosition, this.nextVertexB.worldPosition,
			this.collisionGroup.collisionMargin,
		);
		this.cornerAIsColliding = this.collisionTimeA != -1;
		
		this.collisionTimeB = ContactPoint.cornerSegmentAreColliding(
			this.vertexB.previousWorldPosition, this.vertexB.worldPosition,
			this.vertexA.previousWorldPosition, this.vertexA.worldPosition,
			this.nextVertexA.previousWorldPosition, this.nextVertexA.worldPosition,
			this.collisionGroup.collisionMargin,
		);
		this.cornerBIsColliding = this.collisionTimeB != -1;
	}else{
		this.collisionTimeA = ContactPoint.cornerSegmentAreColliding(
			this.shadowVertexA, this.vertexA.worldPosition,
			this.shadowVertexB, this.vertexB.worldPosition,
			this.shadowNextVertexB, this.nextVertexB.worldPosition,
			this.collisionGroup.collisionMargin,
		);
		this.cornerAIsColliding = this.collisionTimeA != -1;
		
		this.collisionTimeB = ContactPoint.cornerSegmentAreColliding(
			this.shadowVertexB, this.vertexB.worldPosition,
			this.shadowVertexA, this.vertexA.worldPosition,
			this.shadowNextVertexA, this.nextVertexA.worldPosition,
			this.collisionGroup.collisionMargin,
		);
		this.cornerBIsColliding = this.collisionTimeB != -1;
	}
	
	// For example: true + true is evaluated as 2.
	this.collisionGroup.numberOfContacts += this.cornerAIsColliding + this.cornerBIsColliding;

	if (this.cornerAIsColliding && this.collisionNodeA == null) {
		this.collisionNodeA = this.collisionGroup.phx.contactList.addLast({
			"isA": true,
			"contactPoint": this,
		});
	}else if(!this.cornerAIsColliding && this.collisionNodeA != null){
		this.collisionNodeA.remove();
		this.collisionNodeA = null;
	}
	if (this.cornerBIsColliding && this.collisionNodeB == null) {
		this.collisionNodeB = this.collisionGroup.phx.contactList.addLast({
			"isA": false,
			"contactPoint": this,
		});
	}else if(!this.cornerBIsColliding && this.collisionNodeB != null){
		this.collisionNodeB.remove();
		this.collisionNodeB = null;
	}

	// DEBUG START
	/*if(this.cornerAIsColliding || this.cornerBIsColliding){
		physicsSimulator.infect(this.collisionGroup.polygonA, this.collisionGroup.polygonB);
	}*/
	// DEBUG END

	// DEBUG START
	if(this.cornerAIsColliding){
		window.debugRender.addCross(this.vertexA.worldPosition, 0.2, new Vec3(1,1,1));
	}
	if(this.cornerBIsColliding){
		window.debugRender.addCross(this.vertexB.worldPosition, 0.2, new Vec3(1,1,1));
	}
	// DEBUG END
}
ContactPoint.prototype.potentialShadowsCollides = function () {
	if(this.collisionGroup.previousNumberOfContacts == 0){
		return ContactPoint.cornerSegmentAreColliding(
			this.vertexA.previousWorldPosition, this.potentialShadowVertexA,
			this.vertexB.previousWorldPosition, this.potentialShadowVertexB,
			this.nextVertexB.previousWorldPosition, this.potentialShadowNextVertexB,
			this.collisionGroup.collisionMargin,
		) != -1
		||
		ContactPoint.cornerSegmentAreColliding(
			this.vertexB.previousWorldPosition, this.potentialShadowVertexB,
			this.vertexA.previousWorldPosition, this.potentialShadowVertexA,
			this.nextVertexA.previousWorldPosition, this.potentialShadowNextVertexA,
			this.collisionGroup.collisionMargin,
		) != -1;
	}else{
		return ContactPoint.cornerSegmentAreColliding(
			this.shadowVertexA, this.potentialShadowVertexA,
			this.shadowVertexB, this.potentialShadowVertexB,
			this.shadowNextVertexB, this.potentialShadowNextVertexB,
			this.collisionGroup.collisionMargin,
		) != -1
		||
		ContactPoint.cornerSegmentAreColliding(
			this.shadowVertexB, this.potentialShadowVertexB,
			this.shadowVertexA, this.potentialShadowVertexA,
			this.shadowNextVertexA, this.potentialShadowNextVertexA,
			this.collisionGroup.collisionMargin,
		) != -1;
	}
}
ContactPoint.prototype.getDisplacementA = function () {
	// Return the vector the vertex A has to be displaced with to be in the same axis as, or on the outside, the segment B.

	/*return this.getDisplacementX(
		this.vertexA.worldPosition,
		this.vertexB.worldPosition,
		this.nextVertexB.worldPosition
	);*/

	return this.getDisplacementX(
		this.vertexA.worldPosition,
		this.shadowVertexB,
		this.shadowNextVertexB
	).add(this.getDisplacementX(
		this.vertexA.worldPosition,
		this.vertexB.worldPosition,
		this.nextVertexB.worldPosition
	));

	// OLD
	// RETURN THE BIGGEST FROM SHADDOW AND NOW FOR BOTH A AND B!!!

	/*var shaddowAlternative = this.getDisplacementX(
		this.vertexA.worldPosition,
		this.shadowVertexB,
		this.shadowNextVertexB
	);

	var polygonAlternative = this.getDisplacementX(
		this.vertexA.worldPosition,
		this.vertexB.worldPosition,
		this.nextVertexB.worldPosition
	);

	if(polygonAlternative.magApprox() > shaddowAlternative.magApprox()){
		return polygonAlternative;
	}else{
		return shaddowAlternative;
	}*/
}
ContactPoint.prototype.getDisplacementB = function () {
	// Return the vector the vertex B has to be displaced with to be in the same axis as, or on the outside, the segment A.
	
	/*return this.getDisplacementX(
		this.vertexB.worldPosition,
		this.vertexA.worldPosition,
		this.nextVertexA.worldPosition
	);*/
	
	return this.getDisplacementX(
		this.vertexB.worldPosition,
		this.shadowVertexA,
		this.shadowNextVertexA
	).add(this.getDisplacementX(
		this.vertexB.worldPosition,
		this.vertexA.worldPosition,
		this.nextVertexA.worldPosition
	));

	// OLD
	/*var shaddowAlternative = this.getDisplacementX(
		this.vertexB.worldPosition,
		this.shadowVertexA,
		this.shadowNextVertexA
	);

	var polygonAlternative = this.getDisplacementX(
		this.vertexB.worldPosition,
		this.vertexA.worldPosition,
		this.nextVertexA.worldPosition
	);

	if(polygonAlternative.magApprox() > shaddowAlternative.magApprox()){
		return polygonAlternative;
	}else{
		return shaddowAlternative;
	}*/
}
ContactPoint.prototype.getDisplacementX2 = function (shadowCorner, corner, segmentStart, shadowSegmentStart, segmentEnd, shadowSegmentEnd) {
	
	// ((shadowSegmentEnd - shadowSegmentStart) (shadowCorner - shadowSegmentStart)) / (segmentEnd - segmentStart)² (segmentEnd - segmentStart) + segmentStart
	
	var shadowSegmentDir = Vec2.sub(shadowSegmentEnd, shadowSegmentStart);
	var relativeShadowCorner = Vec2.sub(shadowCorner, shadowSegmentStart);
	var segmentDir = Vec2.sub(segmentEnd, segmentStart);

	var reconstructedContactPoint = 3;
	var m = Vec2.dot(shadowSegmentDir, relativeShadowCorner) / segmentDir.magSqr();
}
ContactPoint.prototype.getDisplacementX = function (corner, segmentStart, segmentEnd) {
	var segmentDirection = Vec2.sub(segmentEnd, segmentStart);
	// Check if the corner is on the outside of the segment.
	if(Vec2.det(Vec2.sub(corner, segmentStart), segmentDirection) >= 0){
		return new Vec2();
	}
	// Check if the segment is on the wrong side of the corner.
	/*if(
		Vec2.det(segmentDirection, Vec2.sub(corner, cornerPrevious)) < 0
		||
		Vec2.det(segmentDirection, Vec2.sub(cornerNext, corner)) > 0
	){
		return new Vec2();
	}*/
	var pointOnLine = Vec2.projectPointToLine(corner, segmentStart, segmentDirection);
	// Check if.
	/*if(){

	}*/

	result = pointOnLine.sub(corner);
	
	return result;
}
ContactPoint.cornerSegmentAreColliding = function (pointPrevious, pointNow, segStartPrevious, segStartNow, segEndPrevious, segEndNow, margin = 0) {

	// Assumes linear motion of segment and point. Every point of the segment will move in a straight line. Outputs whether the point intersects (inclusively) the segment or not.

	// Calculate movement in a coordinate system where the point is not moving in the origin.

	// Collision box detection.
	/*if(
		pointPrevious.x < segStartPrevious.x && pointPrevious.x < segEndPrevious.x && pointNow.x < segStartNow && pointNow.x < segEndNow ||
		pointPrevious.x > segStartPrevious.x && pointPrevious.x > segEndPrevious.x && pointNow.x > segStartNow && pointNow.x > segEndNow ||
		pointPrevious.y < segStartPrevious.y && pointPrevious.y < segEndPrevious.y && pointNow.y < segStartNow && pointNow.y < segEndNow ||
		pointPrevious.y > segStartPrevious.y && pointPrevious.y > segEndPrevious.y && pointNow.y > segStartNow && pointNow.y > segEndNow
	){
		return false;
	}*/

	//
	if(margin > 0){
		/*var pointDiff = Vec2.sub(pointNow, pointPrevious).mul(margin);
		pointNow = pointNow.clone().add(pointDiff);
		pointPrevious = pointPrevious.clone().sub(pointDiff);*/

		var segNowDiff = Vec2.sub(segEndNow, segStartNow).mul(margin);
		segEndNow = segEndNow.clone().add(segNowDiff);
		segStartNow = segStartNow.clone().sub(segNowDiff);

		var segPreviousDiff = Vec2.sub(segEndPrevious, segStartPrevious).mul(margin);
		segEndPrevious = segEndPrevious.clone().add(segPreviousDiff);
		segStartPrevious = segStartPrevious.clone().sub(segPreviousDiff);


		/*var segStartDiff = Vec2.sub(segStartNow, segStartPrevious).mul(margin);
		segStartNow = segStartNow.clone().add(segStartDiff);
		segStartPrevious = segStartPrevious.clone().sub(segStartDiff);

		var segEndDiff = Vec2.sub(segEndNow, segEndPrevious).mul(margin);
		segEndNow = segEndNow.clone().add(segEndDiff);
		segEndPrevious = segEndPrevious.clone().sub(segEndDiff);*/
	}

	var s00 = Vec2.sub(segStartPrevious, pointPrevious);
	var s01 = Vec2.sub(segStartNow, pointNow);

	var s10 = Vec2.sub(segEndPrevious, pointPrevious);
	var s11 = Vec2.sub(segEndNow, pointNow);

	var s0v = Vec2.sub(s01, s00);
	var s1v = Vec2.sub(s11, s10);

	// s0 = s00 + (s01-s00)*t
	// s1 = s10 + (s11-s10)*t
	// Calculate when det(s0, s1) = 0. That is when the intersection happens. Time variable is "t". 0 <= t <= 1.
	var a = Vec2.det(s0v, s1v);
	var b = Vec2.det(s00, s1v) + Vec2.det(s0v, s10);
	var c = Vec2.det(s00, s10);

	function testTime (t) {
		// Is the segment intersecting origo at the time t where 0 <= t <= 1?
		if(t < 0 || t > 1){
			return false;
		}
		// s0 = s00 + (s01 - s00) * t.
		var s0 = new Vec2(
			s00.x + (s01.x - s00.x) * t,
			s00.y + (s01.y - s00.y) * t,
		);
		var s1 = new Vec2(
			s10.x + (s11.x - s10.x) * t,
			s10.y + (s11.y - s10.y) * t,
		);
		if(Vec2.dot(s0, s1) > 0){
			return false;
		}else{
			return true;
		}
	}
	function isInwardCollision (){
		// If there is only one solution (intersection) and if the corner ends up on the outside of the segment, ignore collision.
		if(Vec2.det(s01, Vec2.sub(s11, s01)) < 0){
			return false;
		}else{
			return true;
		}
	}

	// 2*c/(-b -+sqrt(b*b - 4*a*c))
	var discriminant = b*b - 4*a*c;
	if(discriminant < 0){
		return -1;
	}
	if(a == 0){
		if(!isInwardCollision.call(this)){
			return -1;
		}
		if(b == 0){ // The axis through the segment is always the same.
			if(c == 0){ // The axis through the segment always intersects with the origin.
				if(Vec2.dot(s00, s01) > 0 && Vec2.dot(s00, s10) > 0 && Vec2.dot(s00, s11) > 0){
					return -1;
				}else{
					return 0;
				}
			}else{ // The axis through the segment never intersects with the origin.
				return -1;
			}
		}else{
			var t = -c / b;
			if (testTime.call(this, t)) {
				return t;
			}else{
				return -1;
			}
		}
	}else{
		var sqr = Math.sqrt(discriminant);
		if(b < 0){
			var t0 = 2*c/(-b + sqr);
		}else{
			var t0 = 2*c/(-b -sqr);
		}
		var t1 = c / a / t0;
		if((t0 < 0 || t0 > 1) != (t1 < 0 || t1 > 1)){ // There is only one solution.
			if(!isInwardCollision.call(this)){
				return -1;
			}
		}
		var alpha = testTime(t0);
		var beta = testTime(t1);
		if (alpha) {
			if (beta) {
				return -1;
			}else{
				return t0;
			}
		}else{
			if (beta) {
				return t1;
			}else{
				return -1;
			}
		}
		//return testTime(t0) != testTime(t1); // Return true if there is exactly one intersection.
	}
}
ContactPoint.prototype.calculateCompensatorNormal = function (corner, segmentStart, segmentEnd, normal, aIsColliding){
	
	if (this.collisionGroup.isFrictionless()) {
		return;
	}

	// 
	var polygonA = corner.polygon; // Note: this.polygonA might not be the same as polygonA.
	var polygonB = segmentStart.polygon;

	//
	var contactPoint = corner.worldPosition;

	var rA = Vec2.sub(contactPoint, polygonA.position);
	var rB = Vec2.sub(contactPoint, polygonB.position);

	// -Relative velocity-
	// What is the velocity of B at the contact point relative to the velocity of A At the contact point. The contact point is the position of the corner.
	var dA = Vec2.det(rA, normal);
	var dB = Vec2.det(rB, normal);

	var relVel = Vec2.dot(normal, Vec2.sub(polygonB.velocity, polygonA.velocity)) + dB * polygonB.angularVelocity - dA * polygonA.angularVelocity;

	// -Calculate impulse-
	var invCollisionMass;
	// Both being static is not possible, as collision would be cancelled at the collision group level.		if (polygonA.isStatic) {
	if (polygonA.isStatic) {
		invCollisionMass = 1/(polygonB.mass) + dB*dB/polygonB.momentOfInertia;
	}else if(polygonB.isStatic){
		invCollisionMass = 1/(polygonA.mass) + dA*dA/polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(polygonA.mass) + 1/(polygonB.mass) + dA*dA/polygonA.momentOfInertia + dB*dB/polygonB.momentOfInertia;
	}

	var i = relVel / invCollisionMass;

	//i /= this.collisionGroup.phx.collisionResolutionImpulsePrecision;

	//i *= 0.5;

	// Add error to compensator.
	if(aIsColliding){
		this.normalCompensatorA += i;
		window.debugRender.addVector(
			Vec2.mul(normal, this.normalCompensatorA * 10),
			contactPoint,
			new Vec3(0,1,1)
		);
	}else{
		this.normalCompensatorB += i;
		window.debugRender.addVector(
			Vec2.mul(normal, this.normalCompensatorB * 10),
			contactPoint,
			new Vec3(0,1,1)
		);
	}
}
ContactPoint.prototype.calculateCompensatorNormalA = function () {

	if(!this.collisionGroup.enableCollision){
		return;
	}

	// The corner must both be colliding, and be on the inside of the segment. for collision detection do be done. Also, if compensations calculation is to be done, the corner must have collided at least one frame before as well.
	if(this.cornerAIsColliding /*&& this.previousCornerAIsColliding*/ && this.applyImpulseA){
		this.calculateCompensatorNormal.call(this, this.vertexA, this.vertexB, this.nextVertexB, this.normalA, true);
	}
	if(!this.cornerAIsColliding && !this.previousCornerAIsColliding){
		this.normalCompensatorA *= 0.;
	}
	// Reduce compensator due to rotating normals.
	if(this.normalA != null && this.previousNormalA != null){
		var reconstuctedPreviousNormal = Vec2.rotate(
			this.previousNormalA,
			this.vertexB.polygon.orientation - this.vertexB.polygon.previousOrientation
		);
		this.normalCompensatorA *= Vec2.dot(this.normalA, reconstuctedPreviousNormal);
	}
}
ContactPoint.prototype.calculateCompensatorNormalB = function () {

	if(!this.collisionGroup.enableCollision){
		return;
	}

	// The corner must both be colliding, and be on the inside of the segment. for collision detection do be done. Also, if compensations calculation is to be done, the corner must have collided at least one frame before as well.
	if(this.cornerBIsColliding /*&& this.previousCornerBIsColliding*/ && this.applyImpulseB){
		this.calculateCompensatorNormal.call(this, this.vertexB, this.vertexA, this.nextVertexA, this.normalB, false);
	}
	if(!this.cornerBIsColliding && !this.previousCornerBIsColliding){
		this.normalCompensatorB *= 0.;
	}
	// Reduce compensator due to rotating normals.
	if(this.normalB != null && this.previousNormalB != null){
		var reconstuctedPreviousNormal = Vec2.rotate(
			this.previousNormalB,
			this.vertexA.polygon.orientation - this.vertexA.polygon.previousOrientation
		);
		this.normalCompensatorB *= Vec2.dot(this.normalB, reconstuctedPreviousNormal);
	}
}
ContactPoint.prototype.calculateCompensatorFriction = function (corner, segmentStart, segmentEnd, tangent, aIsColliding){

	if (this.collisionGroup.isFrictionless()) {
		return;
	}

	// Check of the corner is on the outside of the segment.
	var polygonA = corner.polygon; // Note: this.polygonA might not be the same as polygonA.
	var polygonB = segmentStart.polygon;

	//
	var contactPoint = corner.worldPosition;

	var rA = Vec2.sub(contactPoint, polygonA.position);
	var rB = Vec2.sub(contactPoint, polygonB.position);

	// -Relative velocity-
	// What is the velocity of B at the contact point relative to the velocity of A At the contact point. The contact point is the position of the corner.
	var dA = Vec2.det(rA, tangent);
	var dB = Vec2.det(rB, tangent);

	var relVel = Vec2.dot(tangent, Vec2.sub(polygonB.velocity, polygonA.velocity)) + dB * polygonB.angularVelocity - dA * polygonA.angularVelocity;

	// -Calculate impulse-
	var invCollisionMass;
	// Both being static is not possible, as collision would be cancelled at the collision group level.
	if (polygonA.isStatic) {
		invCollisionMass = 1/(polygonB.mass) + dB*dB/polygonB.momentOfInertia;
	}else if(polygonB.isStatic){
		invCollisionMass = 1/(polygonA.mass) + dA*dA/polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(polygonA.mass) + 1/(polygonB.mass) + dA*dA/polygonA.momentOfInertia + dB*dB/polygonB.momentOfInertia;
	}

	var i = relVel / invCollisionMass;

	//i /= this.collisionGroup.phx.collisionResolutionImpulsePrecision;

	// Limit friction by the constant and normal impulse.
	var previousSumOfnormalImpulses;
	var isStaticFriction; // Or rather, would be static friction last tick.
	if (aIsColliding) {
		previousSumOfnormalImpulses = this.previousSumOfnormalImpulsesA;
		isStaticFriction = this.collisionGroup.isStaticFrictionA;
	}else{
		previousSumOfnormalImpulses = this.previousSumOfnormalImpulsesB;
		isStaticFriction = this.collisionGroup.isStaticFrictionB;
	}
	var maxFriction;
	// If the friction would be too powerful locally, then use dynamic friction.
	if (isStaticFriction) {
		maxFriction = this.collisionGroup.polygonA.staticFrictionConstant * this.collisionGroup.polygonB.staticFrictionConstant * previousSumOfnormalImpulses;
		if(i < -maxFriction || i > maxFriction){
			isStaticFriction = false;
		}
	}

	/*var staticNormalImpulse;
	if(aIsColliding){
		staticNormalImpulse = this.collisionGroup.sumOfnormalImpulsesA;
	}else{
		staticNormalImpulse = this.collisionGroup.sumOfnormalImpulsesB;
	}
	var maxStatic = this.collisionGroup.polygonA.staticFrictionConstant * this.collisionGroup.polygonB.staticFrictionConstant * staticNormalImpulse;
	var isDynamic = false;
	if(i < -maxStatic){
		isDynamic = true;
	}else if(i > maxStatic){
		isDynamic = true;
	}*/

	// Add error to compensator.
	if(isStaticFriction){
		if(aIsColliding){
			this.frictionCompensatorA += i;
		}else{
			this.frictionCompensatorB += i;
		}
	}else{ // Friction is applied statically.
		if(aIsColliding){
			this.frictionCompensatorA = 0;
		}else{
			this.frictionCompensatorB = 0;
		}
	}
}
ContactPoint.prototype.calculateCompensatorFrictionA = function () {

	if(!this.collisionGroup.enableCollision){
		return;
	}

	// The corner must both be colliding, and be on the inside of the segment. for collision detection do be done. Also, if compensations calculation is to be done, the corner must have collided at least one frame before as well.
	if(this.cornerAIsColliding && this.previousCornerAIsColliding && this.applyImpulseA){
		this.calculateCompensatorFriction.call(this, this.vertexA, this.vertexB, this.nextVertexB, this.tangentA, true);
	}
	if(!this.cornerAIsColliding && !this.previousCornerAIsColliding){
		this.frictionCompensatorA *= 0.;
	}
	// Reduce compensator due to rotating normals.
	if(this.normalA != null && this.previousNormalA != null){
		var reconstuctedPreviousNormal = Vec2.rotate(
			this.previousNormalA,
			this.vertexB.polygon.orientation - this.vertexB.polygon.previousOrientation
		);
		this.frictionCompensatorA *= Vec2.dot(this.normalA, reconstuctedPreviousNormal);
	}
}
ContactPoint.prototype.calculateCompensatorFrictionB = function () {

	if(!this.collisionGroup.enableCollision){
		return;
	}
	
	// The corner must both be colliding, and be on the inside of the segment. for collision detection do be done. Also, if compensations calculation is to be done, the corner must have collided at least one frame before as well.
	if(this.cornerBIsColliding && this.previousCornerBIsColliding && this.applyImpulseB){
		this.calculateCompensatorFriction.call(this, this.vertexB, this.vertexA, this.nextVertexA, this.tangentB, false);
	}
	if(!this.cornerBIsColliding && !this.previousCornerBIsColliding){
		this.frictionCompensatorB *= 0.;
	}
	// Reduce compensator due to rotating normals.
	if(this.normalB != null && this.previousNormalB != null){
		var reconstuctedPreviousNormal = Vec2.rotate(
			this.previousNormalB,
			this.vertexA.polygon.orientation - this.vertexA.polygon.previousOrientation
		);
		this.frictionCompensatorB *= Vec2.dot(this.normalB, reconstuctedPreviousNormal);
	}
}
ContactPoint.prototype.resolveByImpulseNormal = function (corner, segmentStart, segmentEnd, normal, bounceCount, doCompensation, aIsColliding) {

	// Check of the corner is on the outside of the segment.
	//
	var polygonA = corner.polygon; // Note: this.polygonA might not be the same as polygonA.
	var polygonB = segmentStart.polygon;

	//
	var contactPoint = corner.worldPosition;

	var rA = Vec2.sub(contactPoint, polygonA.position);
	var rB = Vec2.sub(contactPoint, polygonB.position);

	// -Relative velocity-
	// What is the velocity of B at the contact point relative to the velocity of A At the contact point. The contact point is the position of the corner.
	var dA = Vec2.det(rA, normal);
	var dB = Vec2.det(rB, normal);
	
	var relVel = Vec2.dot(normal, Vec2.sub(polygonB.velocity, polygonA.velocity)) + dB * polygonB.angularVelocity - dA * polygonA.angularVelocity;

	// -Calculate impulse-
	var invCollisionMass;
	// Both being static is not possible, as collision would be cancelled at the collision group level.
	if (polygonA.isStatic) {
		invCollisionMass = 1/(polygonB.mass) + dB*dB/polygonB.momentOfInertia;
	}else if(polygonB.isStatic){
		invCollisionMass = 1/(polygonA.mass) + dA*dA/polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(polygonA.mass) + 1/(polygonB.mass) + dA*dA/polygonA.momentOfInertia + dB*dB/polygonB.momentOfInertia;
	}
	
	var i = relVel / invCollisionMass;

	//var iOriginal = i;
	
	var bounceFactor = polygonA.bounceFactor * polygonB.bounceFactor; // 0 is inelastic, 1 is elastic.

	// Corner did collide previous frame.
	if(
		doCompensation &&
		!this.collisionGroup.isFrictionless() && (
		aIsColliding && this.previousCornerAIsColliding || !aIsColliding && this.previousCornerBIsColliding
	)){
		// Add compensator to impulse
		if(aIsColliding){
			i += this.normalCompensatorA;
			//window.debugRender.addVector(Vec2.mul(normal, this.normalCompensatorA), contactPoint, new Vec3(0,0,1));
		}else{
			i += this.normalCompensatorB;
			//window.debugRender.addVector(Vec2.mul(normal, this.normalCompensatorB), contactPoint, new Vec3(0,0,1));
		}
		bounceFactor = 0;
	}else{
		// Reduce bouncing if multiple collisions happen fast.
		/*if(bounceCount > 1){
			bounceFactor /= (1 + 0.1 * bounceCount);
		}*/
	}

	/*if (doCompensation) {
		if (aIsColliding) {
			if (!this.previousCornerAIsColliding) {
				//this.normalCompensatorA += i;
			}
		}else{
			if (!this.previousCornerBIsColliding) {
				//this.normalCompensatorB += i;
			}
		}
	}*/

	i *= (1 + bounceFactor);
	
	// -Test if the point is moving (and compensator) outwards of the segment-
	if(i <= 0/* && iOriginal <= 0*/){
		return;
	}

	// Test for fracturing.
	

	// Store impulse.
	if(aIsColliding){
		this.normalImpulseA += i;
		this.collisionGroup.sumOfnormalImpulsesA += i;
	}else{
		this.normalImpulseB += i;
		this.collisionGroup.sumOfnormalImpulsesB += i;
	}

	//
	var impulse = Vec2.mul(normal, i);

	// -Apply impulse-
	polygonA.applyImpulse(contactPoint, impulse);
	polygonB.applyImpulse(contactPoint, impulse.neg());
}
ContactPoint.prototype.resolveByImpulseNormalA = function (doCompensation) {

	if(!this.collisionGroup.enableCollision){
		return;
	}

	if (doCompensation && !this.previousCornerAIsColliding) {
		//return;
	}

	if(this.cornerAIsColliding && this.applyImpulseA){
		this.resolveByImpulseNormal(this.vertexA, this.vertexB, this.nextVertexB, this.normalA, this.bouncingCounterA, doCompensation, true);
	}
}
ContactPoint.prototype.resolveByImpulseNormalB = function (doCompensation) {

	if(!this.collisionGroup.enableCollision){
		return;
	}

	if (doCompensation && !this.previousCornerBIsColliding) {
		//return;
	}

	if(this.cornerBIsColliding && this.applyImpulseB){
		this.resolveByImpulseNormal(this.vertexB, this.vertexA, this.nextVertexA, this.normalB, this.bouncingCounterB, doCompensation, false);
	}
}
ContactPoint.prototype.resolveByImpulseFriction = function (corner, segmentStart, segmentEnd, tangent, aIsColliding){
	// Check of the corner is on the outside of the segment.
	var polygonA = corner.polygon; // Note: this.polygonA might not be the same as polygonA.
	var polygonB = segmentStart.polygon;

	//
	var contactPoint = corner.worldPosition;

	var rA = Vec2.sub(contactPoint, polygonA.position);
	var rB = Vec2.sub(contactPoint, polygonB.position);

	// -Relative velocity-
	// What is the velocity of B at the contact point relative to the velocity of A At the contact point. The contact point is the position of the corner.
	var dA = Vec2.det(rA, tangent);
	var dB = Vec2.det(rB, tangent);

	var relVel = Vec2.dot(tangent, Vec2.sub(polygonB.velocity, polygonA.velocity)) + dB * polygonB.angularVelocity - dA * polygonA.angularVelocity;

	// -Calculate impulse-
	var invCollisionMass;
	// Both being static is not possible, as collision would be cancelled at the collision group level.
	if (polygonA.isStatic) {
		invCollisionMass = 1/(polygonB.mass) + dB*dB/polygonB.momentOfInertia;
	}else if(polygonB.isStatic){
		invCollisionMass = 1/(polygonA.mass) + dA*dA/polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(polygonA.mass) + 1/(polygonB.mass) + dA*dA/polygonA.momentOfInertia + dB*dB/polygonB.momentOfInertia;
	}

	var i = relVel / invCollisionMass;
	
	// Add compensator to impulse.
	if(!this.collisionGroup.isFrictionless() && (
		aIsColliding && this.previousCornerAIsColliding || !aIsColliding && this.previousCornerBIsColliding
	)){
		if(aIsColliding){
			i += this.frictionCompensatorA;
		}else{
			i += this.frictionCompensatorB;
		}
	}

	// Limit friction by the constant and normal impulse.
	var previousSumOfnormalImpulses;
	var isStaticFriction; // Or rather, would be static friction last tick.
	var normalImpulse;
	if (aIsColliding) {
		previousSumOfnormalImpulses = this.collisionGroup.previousSumOfnormalImpulsesA;
		isStaticFriction = this.collisionGroup.isStaticFrictionA;
		normalImpulse = this.normalImpulseA;
	}else{
		previousSumOfnormalImpulses = this.collisionGroup.previousSumOfnormalImpulsesB;
		isStaticFriction = this.collisionGroup.isStaticFrictionB;
		normalImpulse = this.normalImpulseB;
	}
	var maxFriction;
	if (isStaticFriction) {
		maxFriction = this.collisionGroup.polygonA.staticFrictionConstant * this.collisionGroup.polygonB.staticFrictionConstant * previousSumOfnormalImpulses;
		if(i < -maxFriction || i > maxFriction){
			isStaticFriction = false;
			if (aIsColliding) {
				this.collisionGroup.isStaticFrictionA = false;
			}else{
				this.collisionGroup.isStaticFrictionB = false;
			}
		}
	}
	if(!isStaticFriction){
		maxFriction = this.collisionGroup.polygonA.dynamicFrictionConstant * this.collisionGroup.polygonB.dynamicFrictionConstant * normalImpulse / this.collisionGroup.phx.collisionResolutionImpulsePrecision;
	}
	if(i < -maxFriction){
		i = -maxFriction;
	}else if(i > maxFriction){
		i = maxFriction;
	}

	//
	if(aIsColliding){
		this.frictionImpulseA += i;
		this.collisionGroup.sumOffrictionImpulsesA += i;
	}else{
		this.frictionImpulseB += i;
		this.collisionGroup.sumOffrictionImpulsesB += i;
	}

	//
	var impulse = Vec2.mul(tangent, i);

	// -Apply impulse-
	polygonA.applyImpulse(contactPoint, impulse);
	polygonB.applyImpulse(contactPoint, impulse.neg());
}
ContactPoint.prototype.resolveByImpulseFrictionA = function () {

	if(!this.collisionGroup.enableCollision){
		return;
	}

	if(this.cornerAIsColliding && this.applyImpulseA){
		this.resolveByImpulseFriction.call(this, this.vertexA, this.vertexB, this.nextVertexB, this.tangentA, true);
	}
}
ContactPoint.prototype.resolveByImpulseFrictionB = function () {

	if(!this.collisionGroup.enableCollision){
		return;
	}
	
	if(this.cornerBIsColliding && this.applyImpulseB){
		this.resolveByImpulseFriction.call(this, this.vertexB, this.vertexA, this.nextVertexA, this.tangentB, false);
	}
}
ContactPoint.prototype.resolveByDisplacement = function (corner, segStart, segEnd, normal, polygonA, polygonB){

	// The penetration will be reduced by approximately 30%.
	// Idea... average out all overlap reductions...

	// B -> X--------x-------X <- next B
	//              /|\
	//               |  <- displacement
	//               |
	//               X A

	if (this.collisionGroup.isFrictionless() && (this.collisionGroup.polygonA.isStatic || this.collisionGroup.polygonB.isStatic)) {
		return;
	}

	var displacement = Vec2.projectPointToLine(
		corner,
		segStart,
		Vec2.sub(segEnd, segStart)
	).sub(corner);
	if (displacement.hasZeroMag()) {
		return;
	}
	displacement.mul(0.3);
	// TEST
	normal = Vec2.unit(displacement);
	// TEST
	displacement.sub(Vec2.mul(normal, 0.01));
	if(Vec2.dot(displacement, normal) <= 0){
		//return; // Cannot pull.
		displacement.mul(0.01);
	}

	var rA = Vec2.sub(corner, polygonA.position);
	var rB = Vec2.sub(corner, polygonB.position);

	var dA = Vec2.det(rA, normal);
	var dB = Vec2.det(rB, normal);

	var relVel = Vec2.dot(normal, displacement);
	
	var invCollisionMass;
	// Both being static is not possible, as collision would be cancelled at the collision group level.
	if (polygonA.isStatic) {
		invCollisionMass = 1/(polygonB.mass) + dB*dB/polygonB.momentOfInertia;
	}else if(polygonB.isStatic){
		invCollisionMass = 1/(polygonA.mass) + dA*dA/polygonA.momentOfInertia;
	}else{
		invCollisionMass = 1/(polygonA.mass) + 1/(polygonB.mass) + dA*dA/polygonA.momentOfInertia + dB*dB/polygonB.momentOfInertia;
	}

	var i = relVel / invCollisionMass;

	var impulse = Vec2.mul(normal, i);

	polygonA.displaceByImpulse(corner, impulse);
	polygonB.displaceByImpulse(corner, impulse.neg());
}
ContactPoint.prototype.resolveByDisplacementA = function () {

	if(!this.collisionGroup.enableCollision){
		return;
	}

	if(this.cornerAIsColliding /*&& this.previousCornerAIsColliding*/ && this.applyImpulseA){
		this.resolveByDisplacement.call(this, this.vertexA.worldPosition, this.vertexB.worldPosition, this.nextVertexB.worldPosition, this.normalA, this.collisionGroup.polygonA, this.collisionGroup.polygonB);
	}
}
ContactPoint.prototype.resolveByDisplacementB = function () {

	if(!this.collisionGroup.enableCollision){ // TODO: if the new method is discarded, remove this test and similar ones.
		return;
	}

	if(this.cornerBIsColliding /*&& this.previousCornerBIsColliding*/ && this.applyImpulseB){
		this.resolveByDisplacement.call(this, this.vertexB.worldPosition, this.vertexA.worldPosition, this.nextVertexA.worldPosition, this.normalB, this.collisionGroup.polygonB, this.collisionGroup.polygonA);
	}
}
ContactPoint.prototype.updateVertexWorldPositionOfCorners = function () {
	// Update world positions of vertices.
	this.vertexA.updateVertexWorldPosition();
	this.nextVertexA.updateVertexWorldPosition();
	this.vertexB.updateVertexWorldPosition();
	this.nextVertexB.updateVertexWorldPosition();
}
ContactPoint.calculateNormalDirection = function (corner, cornerPrevious, cornerNext, segmentStart, segmentEnd){
	
	var cornerNextDir = Vec2.sub(cornerNext, corner);
	var cornerPreviousDir = Vec2.sub(cornerPrevious, corner);

	var segmentDir = Vec2.sub(segmentEnd, segmentStart);

	var segmentNormal = Vec2.rotate90Clockwise(segmentDir);

	// Check if the corner is concave or convex.
	var detNext = Vec2.det(segmentDir, cornerNextDir);
	var detPrevious = Vec2.det(segmentDir, cornerPreviousDir);
	if(Vec2.det(cornerNextDir, cornerPreviousDir) > 0){ // The corner is convex.
		// Simple collision.
		if(detNext <= 0 && detPrevious <= 0){
			return segmentNormal;
		}
		// Look for the corner direction pointing the most inwards in the segment.
		if(detNext <= 0 && detPrevious >= 0){ // Previous points more inwards.
			return cornerPreviousDir.rotate90Clockwise();
		}else if(detNext >= 0 && detPrevious <= 0){ // Next points more inwards.
			return cornerNextDir.rotate90CounterClockwise();
		}
		var tanNext = Math.abs(Vec2.tanOfAngle(segmentNormal, cornerNextDir));
		var tanPrevious = Math.abs(Vec2.tanOfAngle(segmentNormal, cornerPreviousDir));
		// They both point inwards.
		if(tanNext < tanPrevious){ // Next points more inwards.
			return cornerNextDir.rotate90CounterClockwise();
		}else{ // Previous points more inwards.
			return cornerPreviousDir.rotate90Clockwise();
		}
	}else{ // The corner is concave.
		// Simple collision.
		if(detNext <= 0 && detPrevious <= 0 || detNext >= 0 && detPrevious >= 0){
			return segmentNormal;
		}
		// Look for the corner direction pointing the most outwards in the segment.
		if(detNext >= 0 && detPrevious <= 0){
			// Previous points more outwards.
			return cornerPreviousDir.rotate90Clockwise();
		}else{ // detNext <= 0 && detPrevious >= 0
			// Next points more outwards.
			return cornerNextDir.rotate90CounterClockwise();
		}
	}
}
ContactPoint.calculateNormalDirection2 = function (corner, cornerPrevious, cornerNext, segmentStart, segmentEnd) {
	/*
	      ---SS---SE---
				C
			   / \
			  /   \
		  ---CN    CP---
	*/

	//
	var alternative1 = ContactPoint.calculateNormalDirection(corner, cornerPrevious, cornerNext, segmentStart, segmentEnd);
	
	//
	var segmentDir = Vec2.sub(segmentEnd, segmentStart);
	var segmentNormal = Vec2.rotate90Clockwise(segmentDir);
	var alternative2 = segmentNormal;
	if(alternative2.hasZeroMag()){
		return null;
	}

	//
	var tangens = Math.abs(Vec2.tanOfAngle(alternative1, alternative2));
	if(tangens > 0.5){ // ≈ 28 degrees.
		return null;
	}else{
		return alternative2;
	}

}
ContactPoint.calculateNormalDirection3 = function (corner, cornerPrevious, cornerNext, segmentStartPrevious, segmentStart, segmentEnd, segmentEndNext) {
	/*
	         SS---SE
		    / 	C   \
	  ---SSP   / \   SEN---
			  /   \
		  ---CN    CP---
	*/
	var alternative1 = ContactPoint.calculateNormalDirection2(corner, cornerPrevious, cornerNext, segmentStart, segmentEnd);
	if(alternative1 == null){
		return null;
	}

	var segDir = Vec2.sub(segmentEnd, segmentStart);

	// Check for sliding forward.
	if(Vec2.dot(segDir, Vec2.sub(corner, segmentStart)) < 0){ // Is sliding backwards.
		if(Vec2.det(Vec2.sub(segmentEnd, segmentStart), Vec2.sub(segmentStartPrevious, segmentStart)) > 0){ // If the passed corner is convex.
			return alternative1;
		}
		if(Vec2.dot(
			Vec2.sub(segmentStartPrevious, segmentStart),
			Vec2.sub(corner, segmentStart)
		) < 0){ // Is sliding forwards again.
			var normal = Vec2.sub(segmentStart, corner);
		}else{ // Normal is calculated based on the previous segment.
			var normal = Vec2.sub(segmentStart, segmentStartPrevious).rotate90Clockwise();
		}
		if(normal.hasZeroMag()){
			return null;
		}
		return normal;
	}else if(Vec2.dot(segDir, Vec2.sub(corner, segmentEnd)) > 0){ // Is sliding forwards.
		if(Vec2.det(Vec2.sub(segmentEndNext, segmentEnd), segDir) < 0){ // If the passed corner is convex.
			return alternative1;
		}
		if(Vec2.dot(
			Vec2.sub(segmentEndNext, segmentEnd),
			Vec2.sub(corner, segmentEnd)
		) < 0){ // Is sliding backwards again.
			var normal = Vec2.sub(segmentEnd, corner);
		}else{ // Normal is calculated based on the next segment.
			var normal = Vec2.sub(segmentEndNext, segmentEnd).rotate90Clockwise();
		}
		if(normal.hasZeroMag()){
			return null;
		}
		return normal;
	}else{
		// Is not sliding.
		return alternative1;
	}

}
ContactPoint.prototype.calculateNormals = function () {
	// vertexA as corner, and vertexB and nextVertexB as segment
	if(!this.cornerAIsColliding || Vec2.det(Vec2.sub(this.vertexA.worldPosition, this.vertexB.worldPosition), Vec2.sub(this.nextVertexB.worldPosition, this.vertexB.worldPosition)) > 0){
		this.applyImpulseA = false;
	}else{
		// this.calculateNormalDirection(corner, cornerPrevious, cornerNext, segmentStart, segmentEnd);
		normal = ContactPoint.calculateNormalDirection3(
			this.vertexA.worldPosition,
			this.vertexA.getPrevious().worldPosition,
			this.vertexA.getNext().worldPosition,
			this.vertexB.getPrevious().worldPosition,
			this.vertexB.worldPosition,
			this.nextVertexB.worldPosition,
			this.nextVertexB.getNext().worldPosition,
		);
		if(normal == null){
			this.applyImpulseA = false;
		}else{
			this.previousNormalA = this.normalA;
			this.normalA = normal.unit();
			this.tangentA = Vec2.rotate90Clockwise(this.normalA);
			this.applyImpulseA = true;
			window.debugRender.addVector(
				Vec2.mul(this.normalA, 1),
				this.vertexA.worldPosition,
				new Vec3(0,0,1)
			);
		}
	}

	// vertexB as corner, and vertexA and nextVertexA as segment
	if(!this.cornerBIsColliding || Vec2.det(Vec2.sub(this.vertexB.worldPosition, this.vertexA.worldPosition), Vec2.sub(this.nextVertexA.worldPosition, this.vertexA.worldPosition)) > 0){
		this.applyImpulseB = false;
	}else{
		// this.calculateNormalDirection(corner, cornerPrevious, cornerNext, segmentStart, segmentEnd);
		normal = ContactPoint.calculateNormalDirection3(
			this.vertexB.worldPosition,
			this.vertexB.getPrevious().worldPosition,
			this.vertexB.getNext().worldPosition,
			this.vertexA.getPrevious().worldPosition,
			this.vertexA.worldPosition,
			this.nextVertexA.worldPosition,
			this.nextVertexA.getNext().worldPosition,
		);
		if(normal == null){
			this.applyImpulseB = false;
		}else{
			this.previousNormalB = this.normalB;
			this.normalB = normal.unit();
			this.tangentB = Vec2.rotate90Clockwise(this.normalB);
			this.applyImpulseB = true;
			window.debugRender.addVector(
				Vec2.mul(this.normalB, 1),
				this.vertexB.worldPosition,
				new Vec3(0,1,0)
			);
		}
	}
}
ContactPoint.prototype.countBouncing = function () {
	if(this.cornerAIsColliding && this.applyImpulseA){
		this.bouncingCounterA ++;
	}else{
		this.bouncingCounterA *= 0.99;
		if(this.bouncingCounterA < 0){
			this.bouncingCounterA = 0;
		}
	}
	if(this.cornerBIsColliding && this.applyImpulseB){
		this.bouncingCounterB ++;
	}else{
		this.bouncingCounterB *= 0.99;
		if(this.bouncingCounterB < 0){
			this.bouncingCounterB = 0;
		}
	}
}
ContactPoint.prototype.delete = function () {
	
	var indexInVertexA = this.vertexA.contactPoints.indexOf(this);
	if(indexInVertexA == -1){
		debugger;
	}
	this.vertexA.contactPoints.splice(indexInVertexA, 1);
	if(indexInVertexB == -1){
		debugger;
	}
	
	var indexInVertexB = this.vertexB.contactPoints.indexOf(this);
	this.vertexB.contactPoints.splice(indexInVertexB, 1);

	var indexInCollisionGroup = this.collisionGroup.contactPoints.indexOf(this);
	this.collisionGroup.contactPoints.splice(indexInCollisionGroup, 1);

	if (this.collisionNodeA != null) {
		this.collisionNodeA.remove();
		this.collisionNodeA = null;
	}
	if (this.collisionNodeB != null) {
		this.collisionNodeB.remove();
		this.collisionNodeB = null;
	}
}
ContactPoint.prototype.getOther = function (vertex) {
	if(this.vertexA == vertex){
		return vertexB;
	}else{
		return vertexA;
	}
}
ContactPoint.prototype.vertexIsA = function (vertex) {
	if(this.vertexA == vertex){
		return true;
	}else{
		return false;
	}
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.contact_point', true);