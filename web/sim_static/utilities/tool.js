
function Tool(){

}
Tool.unitTest = function () {
	var testNr = 0;
	
	// positionInsidePolygonInclusive
	if(!Tool.positionInsidePolygonInclusive(new Vec2(3,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,3]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(3,1.5), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,3]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(6,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,3]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(5,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,3]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(5.999,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,3]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(3,3.5), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,3]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(5,3.5), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,3]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(4,4), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(1,4), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(3,6), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(4,6), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(6,4), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(1,5), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(8,4), Tool.listToVec2([4,6,2,5,2,2,4,1,7,4,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(5,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,3,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(5,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,3,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(7,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,3,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(7.001,3), Tool.listToVec2([4,6,2,5,2,2,4,1,7,3,5,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(4,4), Tool.listToVec2([]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(4,4), Tool.listToVec2([3,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsidePolygonInclusive(new Vec2(4,4), Tool.listToVec2([4,5]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsidePolygonInclusive(new Vec2(4,4), Tool.listToVec2([4,4]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	// pointSegmentIntersectionInclusive
	if(Tool.pointSegmentIntersectionInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(3,2))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.pointSegmentIntersectionInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(2.5,2))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.pointSegmentIntersectionInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(5.5,0))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.pointSegmentIntersectionInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(-0.5,4))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.pointSegmentIntersectionInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(1,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.pointSegmentIntersectionInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(4,1))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.pointSegmentIntersectionInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(4,1))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	// segmentsIntersectInclusive
	if(!Tool.segmentsIntersectInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(1,1), new Vec2(4,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(4,0), new Vec2(4,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(new Vec2(1,3), new Vec2(4,1), new Vec2(1,1), new Vec2(1,4))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(new Vec2(0,1), new Vec2(5,1), new Vec2(1,1), new Vec2(4,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(new Vec2(2,2), new Vec2(5,1), new Vec2(2,2), new Vec2(4,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(new Vec2(1,1), new Vec2(4,3), new Vec2(2,4), new Vec2(4,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.segmentsIntersectInclusive(new Vec2(1,1), new Vec2(4,3), new Vec2(2,4), new Vec2(2,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.segmentsIntersectInclusive(new Vec2(1,1), new Vec2(4,3), new Vec2(4,1), new Vec2(5,1))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.segmentsIntersectInclusive(new Vec2(1,1), new Vec2(4,3), new Vec2(4,4), new Vec2(6,3))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.segmentsIntersectInclusive(new Vec2(1,1), new Vec2(4,3), new Vec2(-1,1), new Vec2(1,-1))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(
		new Vec2(0,2), new Vec2(2,2),
		new Vec2(1,2), new Vec2(3,2),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	if(!Tool.segmentsIntersectInclusive(
		new Vec2(1,2), new Vec2(3,2),
		new Vec2(0,2), new Vec2(2,2),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.segmentsIntersectInclusive(
		new Vec2(0,2), new Vec2(2,2),
		new Vec2(3,2), new Vec2(4,2),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.segmentsIntersectInclusive(
		new Vec2(3,2), new Vec2(4,2),
		new Vec2(0,2), new Vec2(2,2),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(
		new Vec2(0,2), new Vec2(2,2),
		new Vec2(2,2), new Vec2(4,2),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.segmentsIntersectInclusive(
		new Vec2(2,2), new Vec2(4,2),
		new Vec2(0,2), new Vec2(2,2),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.segmentsIntersectInclusive(
		new Vec2(1.6874091002910858, 12.119083272202221), new Vec2(3.297165814495533, 13.305962929570104),
		new Vec2(6.516679242904426, 15.679722244305868), new Vec2(8.126435957108873, 16.86660190167375),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	// positionInsideOrientedPolygonInclusive
	if(!Tool.positionInsideOrientedPolygonInclusive(new Vec2(3,3), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(1,0), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(1,1), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsideOrientedPolygonInclusive(new Vec2(2,1), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsideOrientedPolygonInclusive(new Vec2(1.5,2.5), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(1.4,2.5), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsideOrientedPolygonInclusive(new Vec2(1.6,2.5), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsideOrientedPolygonInclusive(new Vec2(3,3), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(0,4), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(2,5), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsideOrientedPolygonInclusive(new Vec2(3.1,6), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(2,7), Tool.listToVec2([3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6,3,7]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(2,7), Tool.listToVec2([3,7,3,5,1,4,2,1,5,1,7,4,5,3,4,3,5,6,4,6]))){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(!Tool.positionInsideOrientedPolygonInclusive(new Vec2(2,7), Tool.listToVec2([3,7,4,6,5,6,4,3,5,3,7,4,5,1,2,1,1,4,3,5]))){ // Note, the polygon is inverted.
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.positionInsideOrientedPolygonInclusive(new Vec2(3,3), Tool.listToVec2([3,7,4,6,5,6,4,3,5,3,7,4,5,1,2,1,1,4,3,5]))){ // Note, the polygon is inverted.
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	// lists2DContentEqual
	if(!Tool.lists2DContentEqual([[1,2],[2]],[[1,2],[2]])){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.lists2DContentEqual([[1,2],[2]],[[1,2,3],[2]])){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	if(Tool.lists2DContentEqual([[1],[2]],[[1,2],[2]])){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	// triangulatePolygon().
	function compareResultTriangulatePolygon (l1, l2) {
		if(l1.length != l2.length){
			return false;
		}
		for (var i = 0; i < l1.length; i++) {
			if(l1[i].length != l2[i].length){
				return false;
			}
			for (var j = 0; j < l1[i].length; j++) {
				if(l2[i][j].x != l1[i][j].x || l2[i][j].y != l1[i][j].y){
					return false;
				}
			}
		}
		return true;
	}
	function format(list){
		var retList = [];
		for (var i = 0; i < list.length; i+=2) {
			retList.push(new Vec2(list[i], list[i+1]));
		}
		return retList;
	}

	var result = Tool.triangulatePolygon([Tool.listToVec2([1,1,4,1,2,4])]);
	var correctAnswer = [new Vec2(1,1),new Vec2(4,1),new Vec2(2,4)];
	if(!compareResultTriangulatePolygon(result, correctAnswer)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	
	var result = Tool.triangulatePolygon([Tool.listToVec2([1,1,4,1,3,3,3,5,1,3])]);
	var correctAnswer = [new Vec2(1,1),new Vec2(3,5),new Vec2(1,3),new Vec2(1,1),new Vec2(3,3),new Vec2(3,5),new Vec2(1,1),new Vec2(4,1),new Vec2(3,3)];
	if(!compareResultTriangulatePolygon(result, correctAnswer)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	
	var result = Tool.triangulatePolygon([Tool.listToVec2([1,1,4,1,3,3,1,4,0,2]),Tool.listToVec2([1,2,1,3,2,3,2,2])]);
	var correctAnswer = format([1,1,1,2,0,2,1,2,1,3,0,2,1,3,1,4,0,2,1,3,2,3,1,4,2,3,3,3,1,4,2,3,4,1,3,3,2,3,2,2,4,1,2,2,1,1,4,1,2,2,1,2,1,1]);
	if(!compareResultTriangulatePolygon(result, correctAnswer)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	
	var result = Tool.triangulatePolygon([Tool.listToVec2([1,1,3,2,4,1,6,3,3,3,2,6,1,3,-1,3]),Tool.listToVec2([1,2,2,3,2,2]),Tool.listToVec2([4,2,4,2.5,4.5,2.5,4.5,2])]);
	var correctAnswer = format([4,2,4,1,4.5,2,4,1,6,3,4.5,2,6,3,4.5,2.5,4.5,2,6,3,4,2.5,4.5,2.5,6,3,3,3,4,2.5,3,3,4,2,4,2.5,3,3,2,3,4,2,3,3,2,6,2,3,2,6,1,2,2,3,2,6,1,3,1,2,1,3,-1,3,1,2,-1,3,1,1,1,2,4,2,3,2,4,1,4,2,2,3,3,2,2,3,2,2,3,2,2,2,1,1,3,2,2,2,1,2,1,1]);
	if(!compareResultTriangulatePolygon(result, correctAnswer)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	
	var result = Tool.triangulatePolygon([Tool.listToVec2([2,2,4,1,4,2,10,2,7,6,5,4,6,3,3,2,2,4,4,4,4,7,1,7,1,1]),Tool.listToVec2([2,5,2,6,3,6,3,5]),Tool.listToVec2([7,3,7,4,8,4,8,3])]);
	var correctAnswer = format([2,2,1,7,1,1,2,2,2,4,1,7,2,2,3,2,2,4,2,4,2,5,1,7,2,5,2,6,1,7,2,6,4,7,1,7,2,6,3,6,4,7,3,6,4,4,4,7,3,6,3,5,4,4,3,5,2,4,4,4,3,5,2,5,2,4,2,2,4,1,3,2,4,1,4,2,3,2,4,2,6,3,3,2,4,2,7,3,6,3,7,3,5,4,6,3,7,3,7,4,5,4,7,4,7,6,5,4,7,4,8,4,7,6,8,4,10,2,7,6,8,4,8,3,10,2,8,3,4,2,10,2,8,3,7,3,4,2]);
	if(!compareResultTriangulatePolygon(result, correctAnswer)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	
	var result = Tool.triangulatePolygon([
		Tool.listToVec2([
			0,-2,4,-1,2,1,2,3,-1,2,-3,3,-4,-2,-2,-2,-3,-3,0,-3
		]),
		Tool.listToVec2([
			-1,1,0,2,1,1,-1,-1,
		]),
		Tool.listToVec2([
			0,-1,1,0,1,-1
		]),
		Tool.listToVec2([
			-3,0,-2,1,-1,-2
		])
	]);
	var correctAnswer = format([0,-2,-3,-3,0,-3,-3,0,-2,-2,-1,-2,-2,-2,-3,-3,-1,-2,-3,-3,0,-2,-1,-2,0,-2,-1,-1,-1,-2,-1,-1,-2,1,-1,-2,-1,-1,-1,1,-2,1,-1,1,-3,3,-2,1,-3,3,-3,0,-2,1,-1,1,-1,2,-3,3,-1,1,0,2,-1,2,0,2,2,3,-1,2,0,2,2,1,2,3,0,2,4,-1,2,1,0,2,1,1,4,-1,1,1,1,0,4,-1,1,0,1,-1,4,-1,1,-1,0,-2,4,-1,1,-1,0,-1,0,-2,0,-1,-1,-1,0,-2,0,-1,1,1,-1,-1,1,1,0,-1,1,0,-3,0,-4,-2,-2,-2,-3,0,-3,3,-4,-2]);
	if(!compareResultTriangulatePolygon(result, correctAnswer)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;
	
	var result = Tool.triangulatePolygon([
		Tool.listToVec2([
			1,1,4,3,1,4,5,4,5,1,
		]),
		Tool.listToVec2([
			0,0,6,0,6,6,0,6,
		]),
		Tool.listToVec2([
			2,2,2,3,3,3,
		]),
	]);
	var correctAnswer = format([1,1,6,0,5,1,6,0,5,4,5,1,6,0,6,6,5,4,6,6,1,4,5,4,6,6,0,6,1,4,0,6,1,1,1,4,0,6,0,0,1,1,1,1,0,0,6,0,1,1,2,3,1,4,2,3,3,3,1,4,3,3,4,3,1,4,3,3,2,2,4,3,2,2,1,1,4,3,1,1,2,2,2,3]);
	if(!compareResultTriangulatePolygon(result, correctAnswer)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	// increaseValueMinimum() and decreaseValueMinimum.
	var max = 10000;
	for(var i=0;i<max;i++){
		var a;
		if(i < max * 1 / 4){
			a = Number.MAX_VALUE * Math.random();
		}else if(i < max * 2 / 4){
			a = -Number.MAX_VALUE * Math.random();
		}else if(i < max * 3 / 4){
			a = 100 * Number.MIN_VALUE * Math.random();
		}else{
			a = - 100 * Number.MIN_VALUE * Math.random();
		}
		if(a == 0){
			//console.log("test");
		}
		var more = Tool.increaseValueMinimum(a);
		var less = Tool.decreaseValueMinimum(a);
		if(i < 10){
			//console.log("a: " + a);
			//console.log("more: " + more);
			//console.log("less: " + less);
			//console.log("");
		}
		if(more <= a){
			console.log("FAIL 0: " + a);
			break;
		}
		if(less >= a){
			console.log("FAIL 1: " + a);
			break;
		}
		var same = Tool.decreaseValueMinimum(more);
		if(same != a){
			console.log("FAIL 2: " + a);
			break;
		}
		var same = Tool.increaseValueMinimum(less);
		if(same != a){
			console.log("FAIL 3: " + a);
			break;
		}
	}
	if(i<max){
		console.log("Test failed at test nr " + testNr + ".");
	}
	testNr++;

	// -movingSegmentAndPointIsIntersecting-

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(8,14), new Vec2(12,8),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,14), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(8,14), new Vec2(14,8),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,14), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(8,14), new Vec2(14,8.0000001),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,14), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(8,14), new Vec2(16,6),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,14), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(10,12), new Vec2(16,6),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,14), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(10,16), new Vec2(22,10),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,16), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(10,16.000001), new Vec2(22,10),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,16), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(10,15.999999), new Vec2(22,10),
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(12,16), new Vec2(18,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(6,18), new Vec2(6,6),
		new Vec2(6,10), new Vec2(4,10),
		new Vec2(12,16), new Vec2(4,16),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(6,18), new Vec2(8,14),
		new Vec2(6,10), new Vec2(4,10),
		new Vec2(12,16), new Vec2(4,16),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(6,18), new Vec2(8,15),
		new Vec2(6,10), new Vec2(4,10),
		new Vec2(12,16), new Vec2(4,16),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(8,8), new Vec2(12,14),
		new Vec2(12,8), new Vec2(8,4),
		new Vec2(8,12), new Vec2(4,8),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(12,14), new Vec2(8,8),
		new Vec2(12,8), new Vec2(8,4),
		new Vec2(8,12), new Vec2(4,8),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(12,14), new Vec2(8,8),
		new Vec2(12,8), new Vec2(6,14),
		new Vec2(8,12), new Vec2(2,18),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(12,14), new Vec2(8,8),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(6,14), new Vec2(4,6),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(5.9,14), new Vec2(3.9,6),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(12,8), new Vec2(10,0),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(0,20), new Vec2(-2,12),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(-0.1,20.1), new Vec2(-2.1,12.1),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(0.1,19.9), new Vec2(-1.9,11.9),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(!Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(11.9,8.1), new Vec2(9.9,0.1),
		new Vec2(12,8), new Vec2(2,8),
		new Vec2(8,12), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(12.1,7.9), new Vec2(10.1,-0.1),
		new Vec2(14,10), new Vec2(6,8),
		new Vec2(10,14), new Vec2(2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(12,8), new Vec2(10,0),
		new Vec2(10,10), new Vec2(2,8),
		new Vec2(6,14), new Vec2(-2,12),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	if(Tool.movingSegmentAndPointIsIntersecting(
		new Vec2(6,10), new Vec2(10,6),
		new Vec2(10,10), new Vec2(6,8),
		new Vec2(4,14), new Vec2(0,10),
	)){
		console.log("Test failed at test nr " + testNr + ".");
		return false;
	}
	testNr++;

	
	// Success
	console.log("TEST SUCCESSFUL");
}
Tool.printError = function (message, level = 0){
	// level >= 0
	// Prints out an error with stack trace. The level is how many functions up the stack will start.
	// Standard is the layer where the function is called
	console.error(message + "\n" + Tool.getStackTrace(level + 1));
}
Tool.getStackTrace = function (level = 0){
	var error = Error().stack.split("\n");
	error.splice(1, level + 1);
	return error.join("\n");
}
Tool.clamp = function (v, min, max){
	if(v > max){
		return max;
	}else if(v < min){
		return min;
	}else{
		return v
	}
}
Tool.degToRad = function (deg){
	return deg * Math.PI / 180;
}
Tool.modulo = function (v, m) {
	// Alternative modulo
	return v - m * Math.floor(v / m);
}
Tool.radToDeg = function (rad){
	return rad * 180 / Math.PI;
}
Tool.lerp = function (from, to, factor) {
	return from + (to - from) * factor;
}
Tool.isPowerOf2 = function (number){
	return (number & (number - 1)) == 0;
}
// Sources for the two functions below.
// https://stackoverflow.com/questions/48330463/javascript-increase-or-decrease-float-as-little-as-possible/48332286#48332286
Tool.increaseValueMinimum = function (v) {
	// Will increase value by as little as possibe.
	var m = 1 - Number.EPSILON * 0.5;
	if (v >= Number.MIN_VALUE / Number.EPSILON) {
		// Positive normal.
		return (v / m);
	} else if (v > - Number.MIN_VALUE / Number.EPSILON) {
		// Subnormal or zero.
		return (v + Number.MIN_VALUE);
	} else {
		// Negative normal or NaN.
		return (v * m);
	}
}
Tool.decreaseValueMinimum = function (v) {
	// Will decrease value by as little as possible.
	var m = 1 - Number.EPSILON * 0.5;
	if (v >= Number.MIN_VALUE / Number.EPSILON) {
		// Positive normal.
		return (v * m);
	} else if (v > - Number.MIN_VALUE / Number.EPSILON) {
		// Subnormal or zero.
		return (v - Number.MIN_VALUE);
	} else {
		// Negative normal or NaN.
		return (v / m);
	}
}
Tool.cloneArray = function (arrayToClone){
	if(!(arrayToClone instanceof Array)){
		if(arrayToClone == null){
			Tool.printError("ERROR::Tool.cloneArray: Argument in null.", 1);
			return null;
		}
		Tool.printError("ERROR::Tool.cloneArray: Wrong argument type. Expected arraylist, got \"" + typeof arrayToClone + "\".", 1);
		return null;
	}
	var newArray = new Array(arrayToClone.length);
	for(var i=0; i<arrayToClone.length;i++){
		newArray[i] = arrayToClone[i];
	}
	return newArray;
}
Tool.ajaxGet = function (address, callback, callbackFail){
	// "address" is the address the http requst is requesting. "Callback"
	// will recieve the response from the server.
	// "CallbackFail" is called if an error occurs.


	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function(){
		if(this.readyState == 4){
			if(this.status == 200){
				callback(this.responseText);
			}else{
				if(callbackFail){
					callbackFail();
				}
			}
		}
	};
	xhttp.open("GET", '/'+address, true);
	xhttp.send();

}
Tool.imgToPixelData = function (img){
	// copy img to canvas
	var canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	// get pixelData
	var pixelData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;

	return pixelData;
}
Tool.objectsEqual = function (a, b){
	var aAttr = Object.keys(a);
	var bAttr = Object.keys(b);

	if(aAttr.length != bAttr.length){
		return false;
	}
	for(var i=0; i<aAttr.length; i++){
		if(a[aAttr[i]] != b[bAttr[i]]){
			return false;
		}
	}
	return true;
}
Tool.triangulatePolygon = function (circumferences) {
	// "Circumferences" is a 2d array of Vec2s that describe the corners of a polygon with holes in it. Innwards is to the left as you move forward through the second dimension of the list.
	// Example ("(a,b)" is a vector): [[(0,0), (3,0), (3,3), (0,3)], [(1,1),(1,2),(2,2),(2,1)]] is a box with a box shaped hole in it.
	// A list of triangles (lists of length 3) of references to the Vec2s given as input is returned.
	function getTriangles(circumferences, triangleArray){
		if(circumferences.length == 1 && circumferences[0].length == 3){
			//triangleArray.push([circumferences[0][0], circumferences[0][1], circumferences[0][2]]);
			triangleArray.push(circumferences[0][0]);
			triangleArray.push(circumferences[0][1]);
			triangleArray.push(circumferences[0][2]);
			return;
		}
		// Split the shape in two less complex shapes by connecting two corners that has no geometry in between them.
		// Compare all points to all other points for potetial spilts:
		for (var i = 0; i < circumferences.length; i++) {
			var c1 = circumferences[i];
			for (var j = 0; j < c1.length; j++) {
				var p1 = c1[j];
				for (var k = i; k < circumferences.length; k++) {
					var c2 = circumferences[k]
					var jInitial;
					if(i == k){
						jInitial = j + 1;
					}else{
						jInitial = 0;
					}
					nextPosition:
					for (var l = jInitial; l < c2.length; l++) {
	 					var p2 = c2[l];
						// If the new potential linesegment (split) (p1 to p2) is pointing outwards of the geometry, skip this segment.
						function isOutwards(corner, otherCorner, next, previous){
							var prevDir = Vec2.sub(previous,corner);
							var nextDir = Vec2.sub(next, corner);
							var fromCornerToOther = Vec2.sub(otherCorner, corner);
							if(Vec2.det(nextDir, prevDir) > 0){ // The corner is convex.
								if(Vec2.det(nextDir, fromCornerToOther) <= 0 || Vec2.det(fromCornerToOther, prevDir) <= 0){
									return true;
								}
							}else{ // The corner is straight or concave.
								if(Vec2.det(nextDir, fromCornerToOther) <= 0 && Vec2.det(fromCornerToOther, prevDir) <= 0){
									return true;
								}
							}
							return false;
						}
						var p1Prev, p1Next; // move this calculation a bit uppwards
						if(j == 0){
							p1Prev = c1[c1.length - 1];
							p1Next = c1[1];
						}else if(i == c1.length - 1){
							p1Prev = c1[j - 1];
							p1Next = c1[0];
						}else{
							p1Prev = c1[j - 1];
							p1Next = c1[j + 1]
						}
						var p2Prev, p2Next;
						if(l == 0){
							p2Prev = c2[c2.length - 1];
							p2Next = c2[1];
						}else if(l == c2.length - 1){
							p2Prev = c2[l - 1];
							p2Next = c2[0];
						}else{
							p2Prev = c2[l - 1];
							p2Next = c2[l + 1];
						}
						if(isOutwards(p2, p1, p2Next, p2Prev)){
							continue nextPosition;
						}
						if(isOutwards(p1, p2, p1Next, p1Prev)){
							continue nextPosition;
						}
						// If It tries to split the polygon from a corner to an adjacent corner, skip.
						if(p2 == p1Next || p2 == p1Prev){ // TODO: move test uppwards? test
							continue nextPosition;
						}
						// Compare new linesegment (split) (p1 to p2) to the rest of the geometry. If there is no intersection, split geometry.
						
						for (var m = 0; m < circumferences.length; m++) {
							var c3 = circumferences[m];
							var p3Prev = c3[c3.length - 1];
							for (var n = 0; n < c3.length; n++) {
								var p3 = c3[n];
								if(p1 == p3Prev || p1 == p3 || p2 == p3Prev || p2 == p3){
									p3Prev = p3;
									continue;
								}
								if(Tool.segmentsIntersectInclusive(p3Prev, p3, p1, p2)){
									p3Prev = p3; // TODO: Remove this line and test.
									continue nextPosition;
								}
								p3Prev = p3;
							}
						}
						// All the tests passed so split the geometry here.
						if(c1 == c2){ // The new split is within the same circumference
							var newCircumferencesA = [c1.slice(0, j + 1).concat(c1.slice(l, c1.length))];
							var newCircumferencesB = [c1.slice(j, l + 1)];
							for (var m = 0; m < circumferences.length; m++) {
								var c3 = circumferences[m];
								if(c3 == c1){
									continue;
								}
								if(Tool.positionInsideOrientedPolygonInclusive(c3[0], newCircumferencesA[0])){
									newCircumferencesA.push(c3);
								}else{
									newCircumferencesB.push(c3);
								}
							}
							getTriangles(newCircumferencesA, triangleArray);
							getTriangles(newCircumferencesB, triangleArray);
						}else{ // The new split is between different circumferences.
							var newCircumference = c1.slice(0, j + 1).concat(c2.slice(l, c2.length)).concat(c2.slice(0, l + 1)).concat(c1.slice(j, c1.length)); // TODO: simplify?
							//var newCircumference = c1.slice(0, j + 1).concat();
							circumferences.splice(circumferences.indexOf(c1), 1);
							circumferences.splice(circumferences.indexOf(c2), 1);
							circumferences.push(newCircumference);
							getTriangles(circumferences, triangleArray);
						}
						return;
					}
				}
			}
		}
		// TODO: handle illegal  shapes
		console.error("Illegal shape in \"triangulatePolygon\".");
	}
	var triangleArray = [];
	getTriangles(circumferences, triangleArray);
	return triangleArray;
}
Tool.pointSegmentIntersectionInclusive = function (start, end, position){
	var positionDir = Vec2.sub(position, start);
	var startEndDir = Vec2.sub(end, start);
	if(Vec2.det(startEndDir, positionDir) == 0 && Vec2.dot(positionDir, startEndDir) >= 0 && (Math.abs(positionDir.x) + Math.abs(positionDir.y)) <= (Math.abs(startEndDir.x) + Math.abs(startEndDir.y))){
		return true;
	}else{
		return false;
	}
}
Tool.segmentsIntersectInclusive = function(p0, p1, q0, q1) {
	var dirP = Vec2.sub(p1, p0);
	var dirQ = Vec2.sub(q1, q0);
	if(Vec2.det(dirP, Vec2.sub(q1, p0)) * Vec2.det(dirP, Vec2.sub(q0, p0)) > 0){
		return false;
	}
	if(Vec2.det(dirQ, Vec2.sub(p1, q0)) * Vec2.det(dirQ, Vec2.sub(p0, q0)) > 0){
		return false;
	}
	/*if(Vec2.det(dirP, dirQ) != 0){
		return true;
	}*/
	// At this point, both segments are in the same axis.
	if(Vec2.dot(dirP, Vec2.sub(q1, p0)) < 0 && Vec2.dot(dirP, Vec2.sub(q0, p0)) < 0){
		return false;
	}
	if(Vec2.dot(dirP, Vec2.sub(q1, p1)) > 0 && Vec2.dot(dirP, Vec2.sub(q0, p1)) > 0){
		return false;
	}

	return true;
}
Tool.positionInsidePolygonInclusive = function (position, polygon) {
	// The polygon is an array of vec2. The position is a vec2. If the length of the polygon is 0, false will be returned. If the length is 1, it will be treated as a point.
	// A horizontal ray from position to the right will intersect the circumference of the polygon an even number of times if it is inside the polygon. Otherwise it is inside. To deal with the special cases, for example if a corner of the polygon itersects with the position, the following technique is used when checking for intersections between the ray and position: If the ray intersects with a segment of the polygon that has some part of it above the ray (inclusively), then the intersection test between the point and the ray will be done exclusively, otherwise exclusively.
	//debugger;
	if(polygon.length == 0){ // 52
		return false;
	}
	if(polygon.length == 1){
		if(polygon[0].x == position.x && polygon[0].y == position.y){
			return true;
		}
		return false;
	}
	var nrOfIntersections = 0;
	var start = polygon[polygon.length - 1];
	for (var i = 0; i < polygon.length; i++) {
		var end = polygon[i];
		// If segment is all to the left.
		if(start.x < position.x && end.x < position.x){
			start = end;
			continue;
		}
		// If segment is all above or all below.
		if(start.y > position.y && end.y > position.y || start.y < position.y && end.y < position.y){
			start = end;
			continue;
		}
		// If position is intersecting with the segment.
		if(Tool.pointSegmentIntersectionInclusive(start, end, position)){
			return true;
		}
		// If the line segment is horizontal.
		if(start.y == end.y){ // This is part of the rules to fix the edge cases. The line segment is to the right of the position and at the same height and thus does not have any part of it above the ray, so even if it is an intersection, it is not counted.
			start = end;
			continue;
		}
		// Where does the line segment intersect with the ray.
		// x(S) - (y(S) - y(P)) (x(E) - x(S)) / (y(E) - y(S))
		var intersectionPosition = start.x - (start.y - position.y) * (end.x - start.x) / (end.y - start.y);
		if(intersectionPosition < position.x){
			start = end;
			continue;
		}
		// Rule to fix edge cases.
		if(start.y == position.y && end.y < position.y || end.y == position.y && start.y < position.y){
			start = end;
			continue;
		}
		nrOfIntersections++;
		start = end;
	}
	if(nrOfIntersections % 2 == 0){
		return false;
	}else{
		return true;
	}
}
Tool.positionInsideOrientedPolygonHolesInclusive = function (position, circumferences) {
	// The position is a Vec2. Circumferences is a 2d array list that has Vec2s in its inner dimention. If the inner circumference is clockwise, it is a hole, of it is counter clockwise it is an outer surface.
	/*var sum = [];
	for (var i = 0; i < circumferences.length; i++) {
		var c = circumferences[i];
		sum = sum.concat(c);
	}
	Tool.positionInsideOrientedPolygonInclusive(position, sum);*/
	for (var i = 0; i < circumferences.length; i++) {
		var c = circumferences[i];
		if(!Tool.positionInsideOrientedPolygonInclusive(position, c)) {
			return false;
		}
	}
	return true;
}
Tool.movingSegmentAndPointIsIntersecting = function (pointPrevious, pointNow, segStartPrevious, segStartNow, segEndPrevious, segEndNow, directional = false, margin = 0) {

	// Assumes linear motion of segment and point. Every point of the segment will move in a straight line. Outputs whether the point intersects (inclusively) the segment or not.

	// Calculate movement in a coordinate system where the point is not moving in the origin.

	// TODO! TEST CASES WHEN a, b, c is zero in various scenarios. AND MARGIN!!!

	if(margin > 0){
		var pointDiff = Vec2.sub(pointNow, pointPrevious).mul(margin);
		pointNow = pointNow.clone().add(pointDiff);
		pointPrevious = pointPrevious.clone().sub(pointDiff);

		var segStartDiff = Vec2.sub(segStartNow, segStartPrevious).mul(margin);
		segStartNow = segStartNow.clone().add(segStartDiff);
		segStartPrevious = segStartPrevious.clone().sub(segStartDiff);

		var segEndDiff = Vec2.sub(segEndNow, segEndPrevious).mul(margin);
		segEndNow = segEndNow.clone().add(segEndDiff);
		segEndPrevious = segEndPrevious.clone().sub(segEndDiff);
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

	// a*t^2 + b*t + c = 0.
	if(Tool.isZero(a, 100)){ // The segment has the same orientation and length at the beginning and at the end of the motion.
		if(Tool.isZero(b, 100)){ // The axis through the segment is always the same.
			if(Tool.isZero(c, 100)){ // The axis through the segment always intersects with the origin.
				if(Vec2.dot(s00, s01) > 0 && Vec2.dot(s00, s10) > 0 && Vec2.dot(s00, s11) > 0){
					return false;
				}else{
					return true;
				}
			}else{ // The axis through the segment never intersects with the origin.
				return false;
			}
		}else{
			var t = -c / b;
			return testTime.call(this, t);
		}
	}else{
		// t = (-b +-sqrt(b^2 - 4 * a * c)) / (2 * a).
		var discriminant = b*b - 4*a*c;
		if(discriminant < 0){
			return false;
		}
		// TODO: Optimize square root, testing if 0 <= t <= 1.
		var sqr = Math.sqrt(discriminant);
		var t0 = (-b + sqr) / (2 * a);
		var t1 = (-b - sqr) / (2 * a);

		return testTime.call(this, t0) || testTime.call(this, t1);
	}
}
Tool.isZero = function (number, presicion = 1) {
	return -Number.EPSILON * presicion <= number && number <= Number.EPSILON * presicion;
}
Tool.positionInsideOrientedPolygonInclusive = function (position, polygon) {
	// Same as positionInsidePolygonInclusive but the polygon is oriented counter clockwise. This allows for polygons that are inside out.
	
	if(polygon.length == 0){ // 67
		return false;
	}
	if(polygon.length == 1){
		if(polygon[0].x == position.x && polygon[0].y == position.y){
			return true;
		}
		return false;
	}
	var nearestSegmentStart;
	var nearestSegmentEnd;
	var nearestXPosition = Infinity;
	var start = polygon[polygon.length - 1];
	for (var i = 0; i < polygon.length; i++) {
		var end = polygon[i];
		// If segment is all to the left.
		if(start.x < position.x && end.x < position.x){
			start = end;
			continue;
		}
		// If segment is all above or all below.
		if(start.y > position.y && end.y > position.y || start.y < position.y && end.y < position.y){
			start = end;
			continue;
		}
		// If position is intersecting with the segment.
		if(Tool.pointSegmentIntersectionInclusive(start, end, position)){
			return true;
		}
		// special case rule, skip horizontal segments.
		if(start.y == end.y){
			start = end;
			continue;
		}
		// If the ray does not intersect with the segment.
		var intersectionPosition = start.x - (start.y - position.y) * (end.x - start.x) / (end.y - start.y);
		if(intersectionPosition < position.x){
			start = end;
			continue;
		}
		if(intersectionPosition < nearestXPosition){
			nearestXPosition = intersectionPosition;
			nearestSegmentStart = start;
			nearestSegmentEnd = end;
		}else if(intersectionPosition == nearestXPosition){
			var v1 = Vec2.sub(nearestSegmentEnd, nearestSegmentStart).unit();
			var v2 = Vec2.sub(end, start).unit();
			if(end == nearestSegmentStart){
				v2.neg();
			}else{
				v1.neg();
			}
			if(v1.x > v2.x){
				nearestXPosition = intersectionPosition;
				nearestSegmentStart = start;
				nearestSegmentEnd = end;
			}
		}
		//
		start = end;
	}
	if(nearestXPosition == Infinity){
		return this.areaOfOrientedPolygon(polygon) < 0; // If the area is negative, the polygon is in the clockwise direction and therefore, inverted.
	}
	if(nearestSegmentEnd.y < nearestSegmentStart.y){ // Entering into polygon.
		return false;
	}else{ // Exiting polygon.
		return true;
	}
}
Tool.areaOfOrientedPolygon = function (circumference) {
	// "circumference" is a list of Vec2 that describe a polygon. Green's theorem is used to calculate the area. Robert A. Adams and Christopher Essex. 8th edition, page 921-922.
	var area = 0; // area of circumference
	var prev = circumference[circumference.length-1];
	for (var i = 0; i < circumference.length; i++) {
		var corner = circumference[i];
		area += (corner.y - prev.y) * (corner.x + prev.x);
		//
		prev = corner;
	}
	area *= 0.5;
	return area;
}
Tool.listToVec2 = function (list) {
	var retList = [];
	for (var i = 0; i < list.length; i += 2) {
		retList.push(new Vec2(list[i], list[i+1]));
	}
	return retList;
}
Tool.lists2DContentEqual = function (l1, l2) {
	if(l1.length != l2.length){
		return false;
	}
	for (var i = 0; i < l1.length; i++) {
		if(l1[i].length != l2[i].length){
			return false;
		}
		for (var j = 0; j < l1[i].length; j++) {
			if(l2[i][j] != l1[i][j]){
				return false;
			}
		}
	}
	return true;
}
Tool.listsContentEqual = function (l1, l2) {
	if(l1.length !== l2.length){
		return false;
	}
	for (var i = 0; i < l1.length; i++) {
		if(l2[i] !== l1[i]){
			return false;
		}
	}
	return true;
}
Tool.reverseDecomposeVectors = function (vectors) {
	// Will find the shortest vector possible, if it exists, that has a positive dot product with all vectors in the list.

	// THIS IS NOT TESTED!!!!

	var possibleSolutions = [];
	for (let i = 0; i < vectors.length; i++) {
		const vA = vectors[i];
		for (let j = i+1; j < vectors.length; j++) {
			const vB = vectors[j];
			var t = (-vB.y^2+vA.y*vB.y-cB.x^2+vA.x*vB.x)/(vA.x*vB.y-vA.y*vB.x);
			var solution = Vec2.add(
				vA,
				Vec2.rotate90Clockwise(vA).mul(t)
			);
			possibleSolutions.push(solution);
		}
	}
	nextSolution:
	for (let i = 0; i < possibleSolutions.length; i++) {
		const solution = possibleSolutions[i];
		for (let j = 0; j < vectors.length; j++) {
			const vector = vectors[j];
			if(Vec2.dot(vector, Vec2.sub(solution, vector)) < 0){
				possibleSolutions.splice(i, 1);
				i--;
				continue nextSolution;
			}
		}
	}
	if(possibleSolutions.length == 0){
		return null;
	}
	var minimum = possibleSolutions[0];
	var minMagSqr = minimum.magSqr();
	for (let i = 0; i < possibleSolutions.length; i++) {
		const solution = possibleSolutions[i];
		var newMagSqr = solution.magSqr();
		if(newMagSqr < minMagSqr){
			minMagSqr = newMagSqr;
			minimum = soltion;
		}
	}
	return solution;
}
Tool.getRandomColor = function (brightness = 1) {
	while(true){
		var r = Math.random();
		var g = Math.random();
		var b = Math.random();

		var divisor = r+g+b;
		if (divisor > 0) {
			break;
		}
	}

	var f = brightness/divisor;

	return new Vec3(r,g,b).mul(f);
}
Tool.stringify = function (objectToCopy, maxDepth = Infinity, excludeClasses = [], includeClasses = []) {
	// TODO: Make support for non-objects.
	/*
	c.constructor.name; // Class name
	Object.getOwnPropertyNames(c); // Property names.
	c["propertyName"] = ...; // Set property name.
	var Object.create(SomeClass.prototype);
	var c2 = Object.create(c.__proto__);
	*/

	// Listify.
	var objects = [];

	var que = [objectToCopy];
	var depths = [0];
	while(que.length > 0){
		var o = que.pop();
		var depth = depths.pop();
		objects.push(o);
		var propNames = Object.getOwnPropertyNames(o);
		for (let i = 0; i < propNames.length; i++) {
			const n = propNames[i];
			var property = o[n];
			if (
				depth < maxDepth &&
				typeof property == "object" && property != null &&
				objects.indexOf(property) == -1 &&
				que.indexOf(property) == -1 &&
				excludeClasses.indexOf(property.constructor.name) == -1 &&
				(includeClasses.length == 0 || includeClasses.indexOf(property.constructor.name) != -1)
			) {
				que.push(property);
				depths.push(depth + 1);
			}
		}
	}

	// Stringify.
	var stringifiedList = [];
	var names = []; // Names will be replaced with their index in this list.

	for (let i = 0; i < objects.length; i++) {
		const o = objects[i];

		var classNameReplacement;
		var index = names.indexOf(o.constructor.name);
		if (index == -1) {
			classNameReplacement = names.length;
			names.push(o.constructor.name);
		}else{
			classNameReplacement = index;
		}

		var temp = {
			"c": classNameReplacement, // className.
			"p": [], // properties
		};

		var propNames = Object.getOwnPropertyNames(o);
		for (let j = 0; j < propNames.length; j++) {
			const name = propNames[j];
			
			var nameReplacement;
			var index = names.indexOf(name);
			if (index == -1) {
				propertyNameReplacement = names.length;
				names.push(name);
			}else{
				propertyNameReplacement = index;
			}

			var property = o[name];
			if (typeof property == "object" && property != null){
				if (
					excludeClasses.indexOf(property.constructor.name) == -1 &&
					(includeClasses.length == 0 || includeClasses.indexOf(property.constructor.name) != -1)
				) {
					temp.p.push({ // properties.
						"i": 1, // isObject.
						"n": propertyNameReplacement, // name.
						"o": objects.indexOf(property), // content will here refer to the index of where the object is. // o = content.
					});
				}
			}else{
				var content = JSON.stringify(property);
				if (content == null) {
					content = null; // Converts from undefined to null.
				}
				temp.p.push({ // properties
					//"i": 0, // isObject
					"n": propertyNameReplacement, // name.
					"o": content,
				});
			}
		}

		stringifiedList.push(temp);
	}

	//
	var stringifiedData = {
		"names": names,
		"stringifiedList": stringifiedList,
	};

	return JSON.stringify(stringifiedData);
}
Tool.deStringify = function (string) {
	var stringifiedData = JSON.parse(string);
	var stringifiedList = stringifiedData.stringifiedList;
	var names = stringifiedData.names; // Names is replaced with their index in this list.

	// Listify.
	var objects = [];
	for (let i = 0; i < stringifiedList.length; i++) {
		const data = stringifiedList[i];
		
		var className = names[data.c];

		var cleanName = /[a-zA-Z_$][0-9a-zA-Z_$]*/.exec(className).toString(); // className

		if (cleanName != className) { // className
			throw "ERROR: Class name validation failed."
		}

		var newObject = Object.create(eval(cleanName).prototype);
		objects.push(newObject);
	}

	// Destringify
	for (let i = 0; i < stringifiedList.length; i++) {
		const data = stringifiedList[i];
		const obj = objects[i];
		
		for (let j = 0; j < data.p.length; j++) { // properties
			const property = data.p[j];
			var propertyName = names[property.n];
			if (property.i){ // isObject
				obj[propertyName] = objects[property.o]; // name. // o = content.
			}else{
				obj[propertyName] = JSON.parse(property.o); // name. // o = content.
			}
		}
	}

	return objects[0];
}
Tool.deepCopy = function (objectToCopy) {

	if (typeof objectToCopy != "object" || objectToCopy == null) {
		return objectToCopy;
	}

	// Listify.
	var oldObjects = [];

	var newObjectsList = [];

	var que = [objectToCopy];
	while(que.length > 0){
		var o = que.pop();
		oldObjects.push(o);
		newObjectsList.push(Object.create(o.__proto__));
		var propNames = Object.getOwnPropertyNames(o);
		for (let i = 0; i < propNames.length; i++) {
			const n = propNames[i];
			var property = o[n];
			if (
				typeof property == "object" && property != null &&
				oldObjects.indexOf(property) == -1 &&
				que.indexOf(property) == -1
			) {
				que.push(property);
			}
		}
	}

	// Set properties and object references.
	for (let i = 0; i < newObjectsList.length; i++) {
		const newObject = newObjectsList[i];
		var oldObject = oldObjects[i];

		var propNames = Object.getOwnPropertyNames(oldObject);
		for (let j = 0; j < propNames.length; j++) {
			const name = propNames[j];
			var property = oldObject[name];

			if (typeof property == "object" && property != null){
				newObject[name] = newObjectsList[oldObjects.indexOf(property)];
			}else{
				newObject[name] = property;
			}
		}
	}

	return newObjectsList[0];
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.tool', true);