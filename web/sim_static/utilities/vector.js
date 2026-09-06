
function Vec2(x = 0, y = 0){
	this.x = x;
	this.y = y;
}
function Vec3(x = 0, y = 0, z = 0){
	this.x = x;
	this.y = y;
	this.z = z;
}
function Vec4(x = 0, y = 0, z = 0, w = 0){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}
Vec2.prototype.toString = function(){
	return "[" + this.x + ", " + this.y + "]"
}
Vec3.prototype.toString = function(){
	return "[" + this.x + ", " + this.y + ", " + this.z + "]"
}
Vec4.prototype.toString = function(){
	return "[" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + "]"
}
Vec2.prototype.setCoords = function(x, y){
	this.x = x;
	this.y = y;

	return this;
}
Vec3.prototype.setCoords = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;

	return this;
}
Vec4.prototype.setCoords = function(x, y, z, w){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;

	return this;
}
Vec2.prototype.setVec = function(v){
	this.x = v.x;
	this.y = v.y;

	return this;
}
Vec3.prototype.setVec = function(v){
	this.x = v.x;
	this.y = v.y;
	this.z = v.z;

	return this;
}
Vec4.prototype.setVec = function(v){
	this.x = v.x;
	this.y = v.y;
	this.z = v.z;
	this.w = v.w;

	return this;
}
Vec2.setVec = function(u, v){
	u.x = v.x;
	u.y = v.y;

	return u;
}
Vec3.setVec = function(u, v){
	u.x = v.x;
	u.y = v.y;
	u.z = v.z;

	return u;
}
Vec4.setVec = function(u, v){
	u.x = v.x;
	u.y = v.y;
	u.z = v.z;
	u.w = v.w;

	return u;
}
Vec2.prototype.clone = function(){
	return new Vec2(this.x, this.y);
}
Vec3.prototype.clone = function(){
	return new Vec3(this.x, this.y, this.z);
}
Vec4.prototype.clone = function(){
	return new Vec4(this.x, this.y, this.z, this.w);
}
Vec2.clone = function(v){
	return new Vec2(v.x, v.y);
}
Vec3.clone = function(v){
	return new Vec3(v.x, v.y, v.z);
}
Vec4.clone = function(v){
	return new Vec4(v.x, v.y, v.z, v.w);
}
Vec2.equals = function(vA, vB, margin = 0){
	return Vec2.sub(vA, vB).magSqr() <= margin * margin;
}
Vec3.equals = function(vA, vB, margin = 0){
	return Vec3.sub(vA, vB).magSqr() <= margin * margin;
}
Vec4.equals = function(vA, vB, margin = 0){
	return Vec4.sub(vA, vB).magSqr() <= margin * margin;
}
Vec2.prototype.equals = function(v, margin = 0){
	return Vec2.sub(this, v).magSqr() <= margin * margin;
}
Vec3.prototype.equals = function(v, margin = 0){
	return Vec3.sub(this, v).magSqr() <= margin * margin;
}
Vec4.prototype.equals = function(v, margin = 0){
	return Vec4.sub(this, v).magSqr() <= margin * margin;
}
Vec2.hasZeroMag = function (v) {
	if(v.x == 0 && v.y == 0){
		return true;
	}else{
		return false;
	}
}
Vec2.prototype.hasZeroMag = function () {
	if(this.x == 0 && this.y == 0){
		return true;
	}else{
		return false;
	}
}
Vec3.hasZeroMag = function (v) {
	if(v.x == 0 && v.y == 0 && v.z == 0){
		return true;
	}else{
		return false;
	}
}
Vec3.prototype.hasZeroMag = function () {
	if(this.x == 0 && this.y == 0 && this.z == 0){
		return true;
	}else{
		return false;
	}
}
Vec4.hasZeroMag = function (v) {
	if(v.x == 0 && v.y == 0 && v.z == 0 && v.w == 0){
		return true;
	}else{
		return false;
	}
}
Vec4.prototype.hasZeroMag = function () {
	if(this.x == 0 && this.y == 0 && this.z == 0 && this.w == 0){
		return true;
	}else{
		return false;
	}
}
Vec2.prototype.neg = function(){
	this.x *= -1;
	this.y *= -1;

	return this;
}
Vec3.prototype.neg = function(){
	this.x *= -1;
	this.y *= -1;
	this.z *= -1;

	return this;
}
Vec4.prototype.neg = function(){
	this.x *= -1;
	this.y *= -1;
	this.z *= -1;
	this.w *= -1;

	return this;
}
Vec2.neg = function(v){
	return new Vec4(-v.x, -v.y);
}
Vec3.neg = function(v){
	return new Vec4(-v.x, -v.y, -v.z);
}
Vec4.neg = function(v){
	return new Vec4(-v.x, -v.y, -v.z, -v.w);
}
Vec2.add = function(u, v){
	var returnVec = new Vec2();
	returnVec.x = u.x + v.x;
	returnVec.y = u.y + v.y;

	return returnVec;
}
Vec3.add = function(u, v){
	var returnVec = new Vec3();
	returnVec.x = u.x + v.x;
	returnVec.y = u.y + v.y;
	returnVec.z = u.z + v.z;

	return returnVec;
}
Vec4.add = function(u, v){
	var returnVec = new Vec4();
	returnVec.x = u.x + v.x;
	returnVec.y = u.y + v.y;
	returnVec.z = u.z + v.z;
	returnVec.w = u.w + v.w;

	return returnVec;
}
Vec2.prototype.add = function(v){
	this.x += v.x;
	this.y += v.y;

	return this;
}
Vec3.prototype.add = function(v){
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;

	return this;
}
Vec4.prototype.add = function(v){
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
	this.w += v.w;

	return this;
}
Vec2.addMany = function(){
	var args = arguments;
	var result = args[0].clone();
	for(var i=1;i<args.length;i++){
		result.add(args[i]);
	}
	return result;
}
Vec3.addMany = function(){
	var args = arguments;
	var result = args[0].clone();
	for(var i=1;i<args.length;i++){
		result.add(args[i]);
	}
	return result;
}
Vec4.addMany = function(){
	var args = arguments;
	var result = args[0].clone();
	for(var i=1;i<args.length;i++){
		result.add(args[i]);
	}
	return result;
}
Vec2.sub = function(u, v){
	var returnVec = new Vec2();
	returnVec.x = u.x - v.x;
	returnVec.y = u.y - v.y;

	return returnVec;
}
Vec3.sub = function(u, v){
	var returnVec = new Vec3();
	returnVec.x = u.x - v.x;
	returnVec.y = u.y - v.y;
	returnVec.z = u.z - v.z;

	return returnVec;
}
Vec4.sub = function(u, v){
	var returnVec = new Vec4();
	returnVec.x = u.x - v.x;
	returnVec.y = u.y - v.y;
	returnVec.z = u.z - v.z;
	returnVec.w = u.w - v.w;

	return returnVec;
}
Vec2.prototype.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;

	return this;
}
Vec3.prototype.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;

	return this;
}
Vec4.prototype.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;
	this.w -= v.w;

	return this;
}
Vec2.mul = function(vec, num){
	var newVec = new Vec2(vec.x * num, vec.y * num);
	return newVec;
}
Vec3.mul = function(vec, num){
	var newVec = new Vec3(vec.x * num, vec.y * num, vec.z * num);
	return newVec;
}
Vec4.mul = function(vec, num){
	var newVec = new Vec4(vec.x * num, vec.y * num, vec.z * num, vec.w * num);
	return newVec;
}
Vec2.prototype.mul = function(num){
	this.x *= num;
	this.y *= num;
	return this;
}
Vec3.prototype.mul = function(num){
	this.x *= num;
	this.y *= num;
	this.z *= num;
	return this;
}
Vec4.prototype.mul = function(num){
	this.x *= num;
	this.y *= num;
	this.z *= num;
	this.w *= num;
	return this;
}
Vec2.neg = function(vec2) {
	var retVec = new Vec2(-vec2.x, -vec2.y);
	return retVec;
}
Vec3.neg = function(vec3) {
	var retVec = new Vec3(-vec3.x, -vec3.y, -vec3.z);
	return retVec;
}
Vec4.neg = function(vec4) {
	var retVec = new Vec4(-vec4.x, -vec4.y, -vec4.z, -vec4.w);
	return retVec;
}
Vec2.prototype.neg = function() {
	this.x = -this.x;
	this.y = -this.y;

	return this;
}
Vec3.prototype.neg = function() {
	this.x = -this.x;
	this.y = -this.y;
	this.z = -this.z;

	return this;
}
Vec4.prototype.neg = function() {
	this.x = -this.x;
	this.y = -this.y;
	this.z = -this.z;
	this.w = -this.w;

	return this;
}
Vec2.div = function(vec, num){
	if(num == 0){
		Tool.printError("ERROR:Vec2.div: Cannot divide vector with 0.", 1);
		return null;
	}
	var invNum = 1 / num;
	var newVec = new Vec2(vec.x * invNum, vec.y * invNum);
	return newVec;
}
Vec3.div = function(vec, num){
	if(num == 0){
		Tool.printError("ERROR:Vec3.div: Cannot divide vector with 0.", 1);
		return null;
	}
	var invNum = 1 / num;
	var newVec = new Vec3(vec.x * invNum, vec.y * invNum, vec.z * invNum);
	return newVec;
}
Vec4.div = function(vec, num){
	if(num == 0){
		Tool.printError("ERROR:Vec4.div: Cannot divide vector with 0.", 1);
		return null;
	}
	var invNum = 1 / num;
	var newVec = new Vec4(vec.x * invNum, vec.y * invNum, vec.z * invNum, vec.w * invNum);
	return newVec;
}
Vec2.prototype.div = function(num){
	if(num == 0){
		Tool.printError("ERROR:Vec2.div: Cannot divide vector with 0.", 1);
		return null;
	}
	var invNum = 1 / num;
	this.x *= invNum;
	this.y *= invNum;
	return this;
}
Vec3.prototype.div = function(num){
	if(num == 0){
		Tool.printError("ERROR:Vec3.div: Cannot divide vector with 0.", 1);
		return null;
	}
	var invNum = 1 / num;
	this.x *= invNum;
	this.y *= invNum;
	this.z *= invNum;
	return this;
}
Vec4.prototype.div = function(vec, num){
	if(num == 0){
		Tool.printError("ERROR:Vec4.div: Cannot divide vector with 0.", 1);
		return null;
	}
	var invNum = 1 / num;
	this.x *= invNum;
	this.y *= invNum;
	this.z *= invNum;
	this.w *= invNum;
	return this;
}
Vec2.mag = function(v){
	return Math.sqrt(v.x * v.x + v.y * v.y);
}
Vec3.mag = function(v){
	return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}
Vec4.mag = function(v){
	return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w);
}
Vec2.prototype.mag = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
}
Vec3.prototype.mag = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
Vec4.prototype.mag = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
}
Vec2.magSqr = function(v){
	return v.x * v.x + v.y * v.y;
}
Vec3.magSqr = function(v){
	return v.x * v.x + v.y * v.y + v.z * v.z;
}
Vec4.magSqr = function(v){
	return v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w;
}
Vec2.prototype.magSqr = function(){
	return this.x * this.x + this.y * this.y;
}
Vec3.prototype.magSqr = function(){
	return this.x * this.x + this.y * this.y + this.z * this.z;
}
Vec4.prototype.magSqr = function(){
	return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
}
Vec2.dot = function(u, v){
	return u.x * v.x + u.y * v.y;
}
Vec3.dot = function(u, v){
	return u.x * v.x + u.y * v.y + u.z * v.z;
}
Vec4.dot = function(u, v){
	return u.x * v.x + u.y * v.y + u.z * v.z + u.w * v.w;
}
Vec2.prototype.dot = function(v){
	return this.x * v.x + this.y;
}
Vec3.prototype.dot = function(v){
	return this.x * v.x + this.y * v.y + this.z * v.z;
}
Vec4.prototype.dot = function(v){
	return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
}
Vec2.det = function(u, v){
	//	det(u,v) = |ux uy| = ux * vy - uy * vx
	//	           |vx vy|
	//
	//	det(u,v) = |u| * |v| * sin(angle_between_u_and_v)

	return u.x * v.y - u.y * v.x;
}
Vec3.cross = function(u, v){
	//			|i  j  k |
	//	u x v = |ux uy uz| = i(uy * vz - uz * vy) - j(ux * vz - uz * vx) + k(ux * vy - uy * vx)
	//			|vx vy vz|
	//	= (uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
	//	|u x v| = |u| * |v| * sin(angle_between_u_and_v)

	var newVec = new Vec3(u.y * v.z - u.z * v.y,
						  u.z * v.x - u.x * v.z,
						  u.x * v.y - u.y * v.x);

	return newVec;
}
Vec4.cross = function(u, v){
	var newVec = new Vec4(u.y * v.z - u.z * v.y,
						  u.z * v.x - u.x * v.z,
						  u.x * v.y - u.y * v.x,
						  0);

	return newVec;
}
Vec2.unit = function(v){
	if(v.x == 0 && v.y == 0){
		Tool.printError("ERROR:Vec2.div: Cannot find unit vector of zero vector.", 1);
		return null;
	}
	var newVec = Vec2.div(v, v.mag());
	return newVec;
}
Vec3.unit = function(v){
	if(v.x == 0 && v.y == 0 && v.z == 0){
		Tool.printError("ERROR:Vec3.div: Cannot find unit vector of zero vector.", 1);
		return null;
	}
	var newVec = Vec3.div(v, v.mag());
	return newVec;
}
Vec4.unit = function(v){
	if(v.x == 0 && v.y == 0 && v.z == 0 && v.w == 0){
		Tool.printError("ERROR:Vec4.div: Cannot find unit vector of zero vector.", 1);
		return null;
	}
	var newVec = Vec4.div(v, v.mag());
	return newVec;
}
Vec2.prototype.unit = function(){
	if(this.x == 0 && this.y == 0){
		Tool.printError("ERROR:Vec2.div: Cannot find unit vector of zero vector.", 1);
		return null;
	}
	this.div(this.mag());
	return this;
}
Vec3.prototype.unit = function(){
	if(this.x == 0 && this.y == 0 && this.z == 0){
		Tool.printError("ERROR:Vec3.div: Cannot find unit vector of zero vector.", 1);
		return null;
	}
	this.div(this.mag());
	return this;
}
Vec4.prototype.unit = function(){
	if(this.x == 0 && this.y == 0 && this.z == 0 && this.w == 0){
		Tool.printError("ERROR:Vec4.div: Cannot find unit vector of zero vector.", 1);
		return null;
	}
	this.div(this.mag());
	return this;
}
Vec2.resize = function(v, n){
	var returnVec = Vec2.unit(v).mul(n);
	return returnVec;
}
Vec3.resize = function(v, n){
	var returnVec = Vec3.unit(v).mul(n);
	return returnVec;
}
Vec4.resize = function(v, n){
	var returnVec = Vec4.unit(v).mul(n);
	return returnVec;
}
Vec2.prototype.resize = function(n){
	this.unit().mul(n);
	return this;
}
Vec3.prototype.resize = function(n){
	this.unit().mul(n);
	return this;
}
Vec4.prototype.resize = function(n){
	this.unit().mul(n);
	return this;
}
Vec2.rotate = function (vec, angle) {
	var sin = Math.sin(angle);
	var cos = Math.cos(angle);
	var retVec = new Vec2(
		vec.x * cos - vec.y * sin,
		vec.y * cos + vec.x * sin,
	);
	return retVec;
}
Vec2.prototype.rotate = function (angle) {
	var sin = Math.sin(angle);
	var cos = Math.cos(angle);
	var newX = this.x * cos - this.y * sin;
	var newY = this.y * cos + this.x * sin;
	this.x = newX;
	this.y = newY;
	return this;
}
Vec2.rotateCosSin = function (vec, cos, sin) {
	var retVec = new Vec2(
		vec.x * cos - vec.y * sin,
		vec.y * cos + vec.x * sin,
	);
	return retVec;
}
Vec2.prototype.rotateCosSin = function (cos, sin) {
	var newX = this.x * cos - this.y * sin;
	var newY = this.y * cos + this.x * sin;
	this.x = newX;
	this.y = newY;
	return this;
}
Vec2.rotate90CounterClockwise = function (vector) {
	var newX = -vector.y;
	var newY = vector.x;
	var result = new Vec2(newX, newY);
	
	return result;
}
Vec2.prototype.rotate90CounterClockwise = function () {
	var newX = -this.y;
	var newY = this.x;
	this.x = newX;
	this.y = newY;
	
	return this;
}
Vec2.rotate90Clockwise = function (vector) {
	var newX = vector.y;
	var newY = -vector.x;
	var result = new Vec2(newX, newY);
	
	return result;
}
Vec2.rotateAround = function (pointToRotate, centerOfRotation, angle) {
	var rel = Vec2.sub(pointToRotate, centerOfRotation);
	rel.rotate(angle);

	return rel.add(centerOfRotation);
}
Vec2.prototype.rotate90Clockwise = function () {
	var newX = this.y;
	var newY = -this.x;
	this.x = newX;
	this.y = newY;
	
	return this;
}
Vec2.project = function (v, onto) {
	if(onto.hasZeroMag()){
		return new Vec2();
	}
	var result = Vec2.mul(onto, Vec2.dot(v, onto) / onto.magSqr());
	return result;
}
Vec3.project = function (v, onto) {
	if(onto.hasZeroMag()){
		return new Vec3();
	}
	var result = Vec3.mul(onto, Vec3.dot(v, onto) / onto.magSqr());
	return result;
}
Vec4.project = function (v, onto) {
	if(onto.hasZeroMag()){
		return new Vec4();
	}
	var result = Vec4.mul(onto, Vec4.dot(v, onto) / onto.magSqr());
	return result;
}
Vec2.prototype.project = function (onto) {
	if(onto.hasZeroMag()){
		this.setCoords(0,0);
		return this;
	}
	var result = Vec2.mul(onto, Vec2.dot(this, onto) / onto.magSqr());
	this.setVec(result);
	return this;
}
Vec3.prototype.project = function (onto) {
	if(onto.hasZeroMag()){
		this.setCoords(0,0,0);
		return this;
	}
	var result = Vec2.mul(onto, Vec2.dot(this, onto) / onto.magSqr());
	this.setVec(result);
	return this;
}
Vec4.prototype.project = function (onto) {
	if(onto.hasZeroMag()){
		this.setCoords(0,0,0,0);
		return this;
	}
	var result = Vec2.mul(onto, Vec2.dot(this, onto) / onto.magSqr());
	this.setVec(result);
	return this;
}
Vec2.tanOfAngle = function (vA, vB) {
	// Return the tangens of the angle from vA to vB.
	var dot = Vec2.dot(vA, vB);
	if(dot == 0){
		return null;
	}
	var det = Vec2.det(vA, vB);
	// det(vB, vA) / dot(vB, vA) = sin a * |vB| * |vA| / (cos a * |vB| * |vA|) = tan a.
	return det / dot;
}
Vec2.average = function (vA, vB) {
	return new Vec2(
		(vA.x + vB.x) * 0.5,
		(vA.y + vB.y) * 0.5,
	);
}
Vec3.average = function (vA, vB) {
	return new Vec3(
		(vA.x + vB.x) * 0.5,
		(vA.y + vB.y) * 0.5,
		(vA.z + vB.z) * 0.5,
	);
}
Vec4.average = function (vA, vB) {
	return new Vec4(
		(vA.x + vB.x) * 0.5,
		(vA.y + vB.y) * 0.5,
		(vA.z + vB.z) * 0.5,
		(vA.w + vB.w) * 0.5,
	);
}
Vec2.lerp = function(fromVec, toVec, f){
	// retVec = toVec + (fromVec - toVec) * f
	// retVec = (toVec - fromVec) * f + toVec
	var retVec = Vec2.sub(toVec, fromVec).mul(f).add(fromVec);
	return retVec;
}
Vec3.lerp = function(fromVec, toVec, f){
	// retVec = toVec + (fromVec - toVec) * f
	// retVec = (toVec - fromVec) * f + toVec
	var retVec = Vec3.sub(toVec, fromVec).mul(f).add(fromVec);
	return retVec;
}
Vec4.lerp = function(fromVec, toVec, f){
	// retVec = toVec + (fromVec - toVec) * f
	// retVec = (toVec - fromVec) * f + toVec
	var retVec = Vec4.sub(toVec, fromVec).mul(f).add(fromVec);
	return retVec;
}
Vec2.prototype.lerp = function(toVec, f){
	// this += (toVec - this) * f
	this.add(Vec2.sub(toVec, this).mul(f));
	return this;
}
Vec3.prototype.lerp = function(toVec, f){
	// this += (toVec - this) * f
	this.add(Vec3.sub(toVec, this).mul(f));
	return this;
}
Vec4.prototype.lerp = function(toVec, f){
	// this += (toVec - this) * f
	this.add(Vec4.sub(toVec, this).mul(f));
	return this;
}
// Calculates the approximate length of the vector. Could give an answer up to sqrt(2) times too large, but not smaller that the actual length.
Vec2.projectPointToLine = function (point, lineStart, lineDirection) {
	if(lineDirection.hasZeroMag()){
		return null;
	}
	var relPoint = Vec2.sub(point, lineStart);
	var result = Vec2.project(relPoint, lineDirection);
	result.add(lineStart);
	return result;
}
Vec3.projectPointToLine = function (point, lineStart, lineDirection) {
	if(lineDirection.hasZeroMag()){
		return null;
	}
	var relPoint = Vec3.sub(point, lineStart);
	var result = Vec3.project(relPoint, lineDirection);
	result.add(lineStart);
	return result;
}
Vec4.projectPointToLine = function (point, lineStart, lineDirection) {
	if(lineDirection.hasZeroMag()){
		return null;
	}
	var relPoint = Vec4.sub(point, lineStart);
	var result = Vec4.project(relPoint, lineDirection);
	result.add(lineStart);
	return result;
}
Vec2.projectPointToSegment = function (point, lineStart, lineEnd) {
	var lineDirection = Vec2.sub(lineEnd, lineStart);
	var relPoint = Vec2.sub(point, lineStart);
	var result = Vec2.project(relPoint, lineDirection);
	// Clamp to segment.
	if (Vec2.dot(result, lineDirection) < 0) {
		return lineStart.clone();
	}else if(result.magApprox() > lineDirection.magApprox()){
		return lineEnd.clone();
	}

	result.add(lineStart);
	return result;
}
Vec3.projectPointToSegment = function (point, lineStart, lineEnd) {
	var lineDirection = Vec3.sub(lineEnd, lineStart);
	var relPoint = Vec3.sub(point, lineStart);
	var result = Vec3.project(relPoint, lineDirection);
	// Clamp to segment.
	if (Vec3.dot(result, lineDirection) < 0) {
		return lineStart.clone();
	}else if(result.magApprox() > lineDirection.magApprox()){
		return lineEnd.clone();
	}

	result.add(lineStart);
	return result;
}
Vec4.projectPointToSegment = function (point, lineStart, lineEnd) {
	var lineDirection = Vec4.sub(lineEnd, lineStart);
	var relPoint = Vec4.sub(point, lineStart);
	var result = Vec4.project(relPoint, lineDirection);
	// Clamp to segment.
	if (Vec4.dot(result, lineDirection) < 0) {
		return lineStart.clone();
	}else if(result.magApprox() > lineDirection.magApprox()){
		return lineEnd.clone();
	}

	result.add(lineStart);
	return result;
}
Vec2.magApprox = function(v){
	return (v.x<0?-v.x:v.x) + (v.y<0?-v.y:v.y);
}
Vec3.magApprox = function(v){
	return (v.x<0?-v.x:v.x) + (v.y<0?-v.y:v.y) + (v.z<0?-v.z:v.z);
}
Vec4.magApprox = function(v){
	return (v.x<0?-v.x:v.x) + (v.y<0?-v.y:v.y) + (v.z<0?-v.z:v.z) + (v.w<0?-v.w:v.w);
}
Vec2.prototype.magApprox = function(){
	return (this.x<0?-this.x:this.x) + (this.y<0?-this.y:this.y);
}
Vec3.prototype.magApprox = function(){
	return (this.x<0?-this.x:this.x) + (this.y<0?-this.y:this.y) + (this.z<0?-this.z:this.z);
}
Vec4.prototype.magApprox = function(){
	return (this.x<0?-this.x:this.x) + (this.y<0?-this.y:this.y) + (this.z<0?-this.z:this.z) + (this.w<0?-this.w:this.w);
}
Vec2.prototype.toGeogebra = function (name = "A") {
	return name + " = (" + this.x + "," + this.y + ")"
}
Vec3.prototype.toGeogebra = function (name = "A") {
	return name + " = (" + this.x + "," + this.y + "," + this.z + ")"
}
Vec4.prototype.toGeogebra = function (name = "A") {
	return name + " = (" + this.x + "," + this.y + "," + this.z + "," + this.w + ")"
}
Vec2.prototype.angle = function () {
	return Math.atan2(this.y, this.x);
}
Vec2.prototype.increaseBy = function (v) {
	if (this.hasZeroMag()) {
		return this;
	}
	var mag = this.mag();
	this.mul((mag+v) / mag);

	return this;
}
Vec3.prototype.increaseBy = function (v) {
	if (this.hasZeroMag()) {
		return this;
	}
	var mag = this.mag();
	this.mul((mag+v) / mag);

	return this;
}
Vec4.prototype.increaseBy = function (v) {
	if (this.hasZeroMag()) {
		return this;
	}
	var mag = this.mag();
	this.mul((mag+v) / mag);

	return this;
}
Vec2.increaseBy = function (vector, value) {
	var r = vector.clone();
	r.increaseBy(value);

	return r;
}
Vec3.increaseBy = function (vector, value) {
	var r = vector.clone();
	r.increaseBy(value);

	return r;
}
Vec4.increaseBy = function (vector, value) {
	var r = vector.clone();
	r.increaseBy(value);

	return r;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.vector', true);