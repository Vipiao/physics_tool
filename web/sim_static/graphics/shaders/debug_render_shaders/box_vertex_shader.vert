
// in
attribute vec2 position;

uniform mat3 projection;
uniform mat3 model;
uniform float width;
uniform float height;
uniform mat3 view;
uniform vec3 color;

// out
varying vec3 fragColor;

void main(void) {
	vec2 scaledPosition = position;
	scaledPosition.x *= width;
	scaledPosition.y *= height;
	vec3 worldPos = view * model * vec3(scaledPosition, 1.);
	worldPos.z = -1.; // Set Depth.
	gl_Position = vec4(projection * worldPos, 1.);

	fragColor = color;
}
