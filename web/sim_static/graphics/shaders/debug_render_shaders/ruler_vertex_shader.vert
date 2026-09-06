
// in
attribute vec2 position;

uniform mat3 inverseView;
uniform mat3 inverseProjection;

// out
varying vec2 worldCoordinate;
varying float zoomLevel; // How many distance units are visible in the width direction?

void main(void) {
	worldCoordinate = vec2(inverseView * inverseProjection * vec3(position, 1.));
	// The inverseProjection is a matrix that transforms from clip space to view space. The top left number describes the x-coordinate scaling, and thereby half the "width".
	zoomLevel = inverseProjection[0][0] * 2.;

	gl_Position = vec4(position, 1., 1.);
}
