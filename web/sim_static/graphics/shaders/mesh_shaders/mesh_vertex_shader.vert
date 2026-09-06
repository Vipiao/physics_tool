
// in
attribute vec2 position;

uniform mat3 projection;
uniform mat3 model;
uniform mat3 view;
uniform float depth;

void main(void) {
	vec3 worldPos = view * model * vec3(position, 1.);
	worldPos.z = depth; // Set depth.
	gl_Position = vec4(projection * worldPos, 1.);
}
