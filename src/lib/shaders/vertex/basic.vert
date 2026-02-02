// this is an attribute sent to the shader by p5 
// it contains all of our vertex position information
// it is a vec3, meaning it contains x, y, and z data
// attribute signals that this is a global variable sent by the sketch
// it is read only, meaning it cannot be changed directly (you can copy it though)
// attributes exist in vertex shaders only
varying vec2 vTexCoord;

void main() {
  vTexCoord = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}