
function Shapes(){

}
Shapes.scale = function (geometry, m) {
	for (let i = 0; i < geometry.length; i++) {
		const c = geometry[i];
		for (let j = 0; j < c.length; j++) {
			const p = c[j];
			p.mul(m);
		}
	}
	return geometry;
}
Shapes.twoHoles = function (params) {
	return [
		Tool.listToVec2([
			1,1,4,3,1,4,5,4,5,1,
		]),
		Tool.listToVec2([
			0,0,6,0,6,6,0,6,
		]),
		Tool.listToVec2([
			2,2,2,3,3,3,
		]),
	];
}
// 1,1,4,3,1,4,5,4,5,1, 0,0,6,0,6,6,0,6, 2,2,2,3,3,3 TODO: delete this comment
Shapes.threeHoles = function () {
	return [
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
		]),
	];
}
Shapes.square = function (m = 1) {
	var geometry = [
		Tool.listToVec2([
			-1,-1,
			 1,-1,
			 1, 1,
			-1, 1,
		]),
	];

	return Shapes.scale(geometry, m);
}
Shapes.triangle = function (m = 1) {
	var geometry = [
		Tool.listToVec2([
			-1,-1,
			 1,-1,
			 1, 1,
		]),
	];

	return Shapes.scale(geometry, m);
}
Shapes.tinyTriangle = function () {
	return [
		Tool.listToVec2([
			-0.5,-0.5,
			 0.5,-0.5,
			 0.5, 0.5,
		]),
	];
}
Shapes.hollowBox = function (m = 1) {
	var geometry = [
		Tool.listToVec2([
			-0.9,-0.9,
			-0.9, 0.9,
			 0.9, 0.9,
			 0.9,-0.9,
		]),
		Tool.listToVec2([
			-1,-1,
			 1,-1,
			 1, 1,
			-1, 1,
		]),
	];
	return Shapes.scale(geometry, m);
}
Shapes.man = function (m = 1) {
	var geometry = [
		Tool.listToVec2([
			0,-16,
			5,-13,
			5,-8,
			2,-6,
			8,-2,
			14,-4,
			8,-0,
			2,-1,
			2,7,
			6,13,
			6,22,
			3,14,
			0,11,
			-3,14,
			-6,22,
			-6,13,
			-2,7,
			-2,-1,
			-8,-0,
			-14,-4,
			-8,-2,
			-2,-6,
			-5,-8,
			-5,-13,
		]),
	];
	return Shapes.scale(geometry, m/19);
}
Shapes.disc = function (m = 1, r = 20) {
	
	var resolution = r;
	var circumference = [];
	for (let i = 0; i < resolution; i++) {
		circumference.push(new Vec2(
			Math.cos(i / resolution * Math.PI * 2),
			Math.sin(i / resolution * Math.PI * 2)
		));
	}
	var geometry = [
		circumference
	];
	return Shapes.scale(geometry, m);
}
Shapes.spikes = function (m = 1, r = 10) {
	var c = [0,0];
	var resolution = r;
	for (let i = 0; i < resolution; i++) {
		c.push(-i/resolution);
		c.push((i%2 == 0?0:0.9) + 0.1);
	}
	c.push(-1);
	c.push(0);

	var geometry = [
		Tool.listToVec2(c)
	];
	return Shapes.scale(geometry, m);
}
Shapes.gear = function (m = 1, n = 5) {
	var resolution = n * 2;
	var circumference = [];
	for (let i = 0; i < resolution; i++) {
		var newVec = new Vec2(
			Math.cos(i / resolution * Math.PI * 2),
			Math.sin(i / resolution * Math.PI * 2)
		);
		if (i%2 ==0) {
			newVec.mul(1 - 1 / (1+resolution*0.1));
		}
		circumference.push(newVec);
	}
	var geometry = [
		circumference
	];
	return Shapes.scale(geometry, m);
}
Shapes.rectangle = function (w = 1, h = 1) {
	var geometry = [Tool.listToVec2([
		-w,-h,
		 w,-h,
		 w, h,
		-w, h,
	])];

	return geometry;
}
Shapes.arrow = function (m = 1) {
	var geometry = [Tool.listToVec2([
		-15,-1,
		 10,-1,
		 10,-3,
		 15, 0,
		 10, 3,
		 10, 1,
		-15, 1,
	])];

	return Shapes.scale(geometry, m/15);
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.shapes', true);