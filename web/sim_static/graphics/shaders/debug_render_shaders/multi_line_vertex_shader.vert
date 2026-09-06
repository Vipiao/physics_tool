
// in
attribute vec2 position;
attribute vec3 color;

uniform mat3 projection;
uniform mat3 view;

// out
varying vec3 fragColor;

void main(void) {
	vec3 worldPos = view * vec3(position, 1.);
	worldPos.z = -1.; // Set depth.
	gl_Position = vec4(projection * worldPos, 1.);

	fragColor = color;
}
