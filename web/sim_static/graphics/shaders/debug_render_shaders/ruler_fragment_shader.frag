
precision mediump float;
#define PI 3.1415926535897932384626433832795

// in
varying vec2 worldCoordinate;
varying float zoomLevel; // How many distance units are visible in the width direction?

float renderGrid(float spacing, float sharpness, float factor);
float modulo(float a, float b){
	return a - floor(a/b)*b;
}

void main(void) {
	float sharpness = 100.;

	float brightness = 0.;
	float factor = 0.1;


	// .1 unit.
	brightness += renderGrid(.1, sharpness, factor);

	// 1 unit.
	brightness += renderGrid(1., sharpness, factor);

	// 10 units.
	brightness += renderGrid(10., sharpness, factor);

	// 100 units.
	brightness += renderGrid(100., sharpness, factor);
	
	gl_FragColor = vec4(brightness, brightness, brightness, 1.);
}

float renderGrid(float spacing, float sharpness, float factor){
	factor = min(factor, 40. * spacing * factor / zoomLevel); // Make small grid dissapear;
	sharpness *= spacing / zoomLevel;
	float r = max(
		cos(worldCoordinate.x * 2. * PI / spacing) * sharpness - sharpness + 1.,
		cos(worldCoordinate.y * 2. * PI / spacing) * sharpness - sharpness + 1.
	);
	r *= factor;
	r = max(r, 0.);
	return r;
}

