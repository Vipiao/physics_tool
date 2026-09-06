
/*
The matrix is column major
*/

function Matrix3D(){}

Matrix3D.unitTest = function() {
	var a = [
		6,-3,-4,
		2, 6, 4,
		3, 1,-6,
	];
	var b = [
		2, 3, 4,
		3,-6, 1,
		2, 1, 1,
	];
	// formatting
	console.log("--Formatting test--");
	console.log("raw:       \n" + a);
	console.log("formatted: \n" + Matrix3D.toString(a));
	// multiplication
	console.log("\n--Multiplication matrix by matrix test--");
	console.log("a: \n" + Matrix3D.toString(a));
	console.log("b: \n" + Matrix3D.toString(b));
	var product = Matrix3D.multiply(a, b);
	console.log("a x b: \n" + Matrix3D.toString(product));
	var correctAnswer = [30,16,-20,9,-44,-42,17,1,-10];
	for (var i = 0; i < correctAnswer.length; i++) {
		if (correctAnswer[i] != product[i]) {
		console.info("TEST_FAILED: Matrix by matrix multiplication error.");
		return false;
		}
	}
	// Matrix vector multiplication
	console.log("\n--Multiplication matrix by vector test--");
	console.log("matrix: \n" + Matrix3D.toString(a));
	var v = new Vec3(2,3,4);
	console.log("vector: " + v.toString());
	var productVector = Matrix3D.multiplyVector(a, v);
	console.log("matrix x v: " + productVector.toString());
	if(productVector.x != 30 || productVector.y != 16 || productVector.z != -20){
		console.info("TEST_FAILED: Matrix by vector multiplication error.");
		return false;
	}
	// transpose
	console.log("\n--Transpose test--");
	console.log("matrix: \n" + Matrix3D.toString(a));
	var transposed = Matrix3D.transpose(a);
	console.log("transposed: \n" +Matrix3D.toString(transposed));
	var correctAnswer = [6,2,3,-3,6,1,-4,4,-6];
	for (var i = 0; i < correctAnswer.length; i++) {
		if (correctAnswer[i] != transposed[i]) {
		console.info("TEST_FAILED: Transposing error.");
		return false;
		}
	}
	// duplicate
	var duplicate = Matrix3D.duplicate(a);
	for (var i = 0; i < duplicate.length; i++) {
		if (a[i] != duplicate[i]) {
		console.info("TEST_FAILED: Duplicating error.");
		return false;
		}
	}
	for (var i = 0; i < duplicate.length; i++) {
		duplicate[i] += 1; // change duplicate
	}
	for (var i = 0; i < duplicate.length; i++) {
		if (a[i] == duplicate[i]) {
		console.info("TEST_FAILED: Duplicating error.");
		return false;
		}
	}
	// add matrices
	console.log("\n--Add matrices test--");
	console.log("a: \n" + Matrix3D.toString(a));
	console.log("b: \n" + Matrix3D.toString(b));
	var result = Matrix3D.add(a,b);
	console.log("a + b:\n" + Matrix3D.toString(result));
	var correctAnswer = [8, 0, 0, 5, 0, 5, 5, 2, -5];
	for (var i = 0; i < correctAnswer.length; i++) {
		if (correctAnswer[i] != result[i]) {
		console.info("TEST_FAILED: Adding matrices error.");
		return false;
		}
	}

	// Determinant.
	var d = Matrix3D.determinant([
		1,0,5,
		2,1,6,
		3,4,0,
	]);
	if(d != 1){
		console.info("TEST_FAILED: Determinant error.");
		return false;
	}

	// Invertig.
	var inv = Matrix3D.inverse(Matrix3D.transpose([
		1,2,3,
		0,1,4,
		5,6,0,
	]));
	if(!Tool.listsContentEqual(inv, [-24, 20, -5, 18, -15, 4, 5, -4, 1])){
		console.info("TEST_FAILED: Inversion error.");
		return false;
	}

	// end
	console.info("TEST_SUCCESS");
	return true;
}
Matrix3D.toString = function(m){
	function f(number){ // makes the nuber a certain size
			var string = number.toFixed(2);
			var spaces = 10 - string.length;
			spaces < 0? spaces = 0: null;
			return " ".repeat(spaces) + string;
		}
	var s = "\n" +
	"|" + f(m[3*0 + 0]) + " " + f(m[3*1 + 0]) + " " + f(m[3*2 + 0]) + "|\n" +
	"|" + f(m[3*0 + 1]) + " " + f(m[3*1 + 1]) + " " + f(m[3*2 + 1]) + "|\n" +
	"|" + f(m[3*0 + 2]) + " " + f(m[3*1 + 2]) + " " + f(m[3*2 + 2]) + "|";
	return s;
}
Matrix3D.getIdentity = function(){
	return [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1,
	];
}
Matrix3D.duplicate = function(m){
	var newMatrix = [];
		for(var i=0; i<m.length; i++){
			newMatrix.push(m[i]);
		}

		return newMatrix;
}
Matrix3D.add = function(mA, mB){
	var newMatrix = [];
	for(var i=0; i<mA.length; i++){
		newMatrix.push(mA[i] + mB[i]);
	}

	return newMatrix;
}
Matrix3D.addValue = function(m, v){
	var newMatrix = [];
	for(var i=0; i<m.length; i++){
		newMatrix.push(m[i] + v);
	}

	return newMatrix;
}
Matrix3D.multiplyValue = function(m, v){
	var newMatrix = [];
		for(var i=0; i<m.length; i++){
			newMatrix.push(m[i] * v);
		}

		return newMatrix;
}
Matrix3D.multiplyMany = function(){
	var matrices = arguments;
		var product = matrices[0];
		for(var i=1; i<matrices.length;i++){
			product = Matrix3D.multiply(product, matrices[i]);
		}
		return product;
}
Matrix3D.multiply = function(mA, mB){
	newMatrix = [];
		for(var i=0; i<3; i++){
			for(var j=0; j<3; j++){
		newMatrix.push(mA[3*0 + j] * mB[3*i + 0] + mA[3*1 + j] * mB[3*i + 1] + mA[3*2 + j] * mB[3*i + 2]);
			}
		}
		return newMatrix;
}
Matrix3D.multiplyVector3Right = function(mat, vec3){
	// mat[3*columnNumber + y*rowNumber].
	// 0 <= columnNumber <= 2.
	// 0 <= rownumber <= 2.
	var newVec3 = new Vec3(
		mat[3*0 + 0] * vec3.x + mat[3*1 + 0] * vec3.y + mat[3*2 + 0] * vec3.z,
		mat[3*0 + 1] * vec3.x + mat[3*1 + 1] * vec3.y + mat[3*2 + 1] * vec3.z,
		mat[3*0 + 2] * vec3.x + mat[3*1 + 2] * vec3.y + mat[3*2 + 2] * vec3.z,
	);

	return newVec3;
}
Matrix3D.multiplyVector2Right = function(mat, vec2){
	var newVec2 = new Vec2(
		mat[3*0 + 0] * vec2.x + mat[3*1 + 0] * vec2.y + mat[3*2 + 0],
		mat[3*0 + 1] * vec2.x + mat[3*1 + 1] * vec2.y + mat[3*2 + 1],
	);

	return newVec2;
}
Matrix3D.multiplyVector3Left = function(vec3, mat){
	var newVec3 = new Vec3(
		mat[3*0 + 0] * vec3.x + mat[3*0 + 1] * vec3.y + mat[3*0 + 2] * vec3.z,
		mat[3*1 + 0] * vec3.x + mat[3*1 + 1] * vec3.y + mat[3*1 + 2] * vec3.z,
		mat[3*2 + 0] * vec3.x + mat[3*2 + 1] * vec3.y + mat[3*2 + 2] * vec3.z,
	);

	return newVec3;
}
Matrix3D.multiplyVector2Left = function(vec3, mat2){
	var newVec2 = new Vec2(
		mat[3*0 + 0] * vec2.x + mat[3*0 + 1] * vec2.y + mat[3*0 + 2],
		mat[3*1 + 0] * vec2.x + mat[3*1 + 1] * vec2.y + mat[3*1 + 2],
	);

	return newVec2;
}
Matrix3D.determinant = function (m) {
	/*
		0	3	6
		
		1	4	7

		2	5	8
	*/
	return m[0]*(m[4]*m[8]-m[7]*m[5]) - m[3]*(m[1]*m[8]-m[7]*m[2]) + m[6]*(m[1]*m[5]-m[4]*m[2]);
}
Matrix3D.inverse = function(m){
	/*
		0	3	6
		
		1	4	7

		2	5	8
	*/
	var d = Matrix3D.determinant(m);
	if(d == 0){
		return null;
	}
	d = 1 / d;
	var n = Matrix3D.transpose(m);
	var inv = [
		( n[4]*n[8]-n[7]*n[5])*d, (-n[3]*n[8]+n[6]*n[5])*d, ( n[3]*n[7]-n[6]*n[4])*d,
		(-n[1]*n[8]+n[7]*n[2])*d, ( n[0]*n[8]-n[6]*n[2])*d, (-n[0]*n[7]+n[6]*n[1])*d,
		( n[1]*n[5]-n[4]*n[2])*d, (-n[0]*n[5]+n[3]*n[2])*d, ( n[0]*n[4]-n[3]*n[1])*d,
	];
	return inv;
}
// Functional matrices
Matrix3D.transpose = function(mat){
	var transposed = new Array(3 * 3);
	for(var i=0; i<mat.length; i++){
		transposed[i] = mat[3 * (i % 3) + Math.floor(i / 3)];
	}

	return transposed;
}
Matrix3D.getTranslation = function (direction) {
	return [
				  1,           0, 0,
				  0,           1, 0,
		direction.x, direction.y, 1,
	];
}
Matrix3D.translate = function(matrix, direction){
	var translation = Matrix3D.getTranslation(direction);
	var translation = Matrix3D.multiply(translation, matrix);
	return translation;
}
Matrix3D.getScale = function(factor){
	return [
		factor,      0,      0,
			 0, factor,      0,
			 0,      0,      1,
	];
}
Matrix3D.getScaleXY = function(factorX, factorY){
	return [
		factorX,      0,      0,
		     0, factorY,      0,
		     0,      0,      1,
	];
}
Matrix3D.scale = function(matrix, factor){
	var scale = Matrix3D.getScale(factor);
	var scale = Matrix3D.multiply(scale, matrix);
	return scale;
}
Matrix3D.scaleXY = function(matrix, factorX, factorY){
	var scale = Matrix3D.getScaleXY(factorX, factorY);
	var scale = Matrix3D.multiply(scale, matrix);
	return scale;
}
Matrix3D.getRotationCosSin = function(cos, sin){
	return [
		 cos, sin, 0,
		-sin, cos, 0,
		   0,   0, 1,
	];
}
Matrix3D.rotateCosSin = function(matrix, cos, sin){
	var rotation = Matrix3D.getRotationCosSin(cos, sin);
	var rotation = Matrix3D.multiply(rotation, matrix);
	return rotation;
}
Matrix3D.getRotation = function(angle){
	var cos = Math.cos(angle);
	var sin = Math.sin(angle);
	return [
		 cos, sin, 0,
		-sin, cos, 0,
		   0,   0, 1,
	];
}
Matrix3D.rotate = function(matrix, angle){
	var rotation = Matrix3D.getRotation(angle);
	var rotation = Matrix3D.multiply(rotation, matrix);
	return rotation;
}
// Graphics related
Matrix3D.getView = function(pos, up = new Vec2(0, 1)){
	var normalUp = Vec2.unit(up);
	var returnMat = Matrix3D.getTranslation(Vec2.neg(pos));
	var returnMat = Matrix3D.rotateCosSin(returnMat, normalUp.y, normalUp.x); // Remember, reverse rotation, otherwise, it should have been (-)normal.Up.x as sin.
	return returnMat;
}
Matrix3D.getOrthogonalProjection = function(width, widthToHeightRatio) {
	var right = width * .5;
	var left = -right;
	var top = width / widthToHeightRatio * 0.5;
	var bottom = -top;
	return [
					 2 / (right - left),                               0, 0,
									  0,              2 / (top - bottom), 0,
		(right + left) / (left - right), (top + bottom) / (bottom - top), 1,
	];
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.matrix_3d', true);