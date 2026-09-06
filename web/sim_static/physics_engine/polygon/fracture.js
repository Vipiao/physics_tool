
Fracture.RandomSeed;
window.addEventListener("load", function(){
	Fracture.RandomSeed = new RandomSeed();
});
function Fracture(){

}
Fracture.getStandardFracture = function (radius) {
	
	var innerRadius = 0.2;
	var innerNodes = 5;
	var nodeFactor = 1.2; // How many times more nodes per layer.
	var radiusFactor = 1.7; // How many times larger should each radius be to the previous one.
	var randomFactor = 0.3;

	var nodes = [];

	// Generate nodes.
	var currentRadius = innerRadius;
	var currentNodes = innerNodes;
	nodes.push({
		"position": new Vec2(),
		"connections":[]
	});
	var rings = [];
	var oldCurrentRadius = currentRadius;
	while(oldCurrentRadius < radius){
		rings.push([]);
		for (let i = 0; i < currentNodes; i++) {
			rings[rings.length-1].push({
				"position": new Vec2(
					Math.cos((i * 2 + 1*0)/currentNodes * Math.PI),
					Math.sin((i * 2 + 1*0)/currentNodes * Math.PI)
				).mul(currentRadius),
				"connections":[]
			});
		}
		oldCurrentRadius = currentRadius;
		currentRadius *= radiusFactor;
		currentNodes *= nodeFactor;
	}

	// Connect nodes.
	// -- Around.
	for (let i = 0; i < rings.length; i++) {
		const r = rings[i];
		var previous = r[r.length-1];
		for (let j = 0; j < r.length; j++) {
			const n = r[j];
			
			previous.connections.push(n);
			n.connections.push(previous);

			previous = n;
		}
	}
	// -- Outwards.
	// -- -- First.
	for (let i = 0; i < rings[0].length; i++) {
		const n = rings[0][i];
		nodes[0].connections.push(n);
		n.connections.push(nodes[0]);
	}
	for (let i = 1; i < rings.length; i++) {
		const r = rings[i];
		for (let j = 0; j < r.length; j++) {
			const n = r[j];
			
			//var innerNode = rings[i-1][Math.floor(j/nodeFactor)];
			var index = Math.round(j/nodeFactor);
			if (index >= rings[i-1].length) {
				index = 0;
			}
			var innerNode = rings[i-1][index];
			innerNode.connections.push(n);
			n.connections.push(innerNode);
		}
	}

	// Add nodes.
	for (let i = 0; i < rings.length; i++) {
		const r = rings[i];
		for (let j = 0; j < r.length; j++) {
			const n = r[j];
			nodes.push(n);
		}
	}

	// Randomize.
	for (let i = 1; i < nodes.length; i++) {
		const n = nodes[i];
		
		var oldPosition = n.position.clone();
		
		// Move by random.
		var r = n.position.magApprox() * randomFactor;
		n.position.add(new Vec2(
			(Fracture.RandomSeed.getNext()-0.5) * r,
			(Fracture.RandomSeed.getNext()-0.5) * r
		));

		// Test for intersections.
		var didIntersect = false;
		var start = n.position;
		outer:
		for (let j = 0; j < n.connections.length; j++) {
			const n2 = n.connections[j];
			var end = n2.position;

			for (let k = 0; k < nodes.length; k++) {
				const n3 = nodes[k];
				var start2 = n3.position;
				for (let l = 0; l < n3.connections.length; l++) {
					const n4 = n3.connections[l];
					var end2 = n4.position;
					if (start == start2 || end == end2 || start == end2 || end == start2) {
						continue;
					}
					if (Tool.segmentsIntersectInclusive(start, end, start2, end2)) {
						didIntersect = true;
						break outer;
					}
				}
			}
		}
		if (didIntersect) {
			n.position = oldPosition;
		}
	}

	return nodes;
}
Fracture.toGeogebra = function (pattern) {
	//Segment((1,1), (3,3))

	var result = "";
	for (let i = 0; i < pattern.length; i++) {
		const node = pattern[i];
		for (let j = 0; j < node.connections.length; j++) {
			const other = node.connections[j];
			if (pattern.indexOf(node) < pattern.indexOf(other)) {
				continue;
			}
			result += "Segment((" +
				node.position.x.toFixed(100) + "," +
				node.position.y.toFixed(100) + "),(" +
				other.position.x.toFixed(100) + "," +
				other.position.y.toFixed(100) +"))\n";
		}
	}

	return result;
}

// Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.fracture', true);


