precision highp float;

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom;
uniform vec2 u_viewOffset;
uniform sampler2D u_palette;
uniform vec2 u_mousePos;


const float brightness = 0.3;
const float contrast = 10.0;
const float gamma = 2.2;
const float exposure = 0.3;
const int maxIterations =350; 

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(u_palette, vec2(v, 0.5)).rgb;
}

vec3 u_paletteGet(float t,vec3 a,vec3 b,vec3 c,vec3 d )
{
  return a + b*cos( 6.283185*(c*t+d) );
}

vec2 cx_mul(vec2 a, vec2 b){
  return vec2(a.x * b.x - a.y* b.y, (a.x*b.y + b.x*a.y));
}

float cx_modulus(vec2 c){
  return sqrt(c.x*c.x + c.y*c.y);
}

vec3 inigou_palette( in float t)
{
  vec3 a = vec3(0.5,0.5,0.65);
  vec3 b = vec3(0.5,0.2,0.5);
  vec3 c = vec3(0.9,0.1,0.1);
  vec3 d = vec3(1.0, 0.33, 0.1);
    return a + b*cos( 6.283185*(c*t+d) );
}

vec3 colour(float de){
  float v = 0.875 + 0.03125 * log2(dot(de, de));
  float blue = 0.5 + 0.2*log2(dot(de, de));
  v += brightness;
  v -= 0.5;
  v *= exp2(contrast);
  v += 0.5;
  v = clamp(v, 0.0, 1.0);
  v = pow(v, 6.0 / gamma);
  v *= exp2(exposure);
  return vec3(v, blue, v);
}

float mandelbrot(vec2 coord){
    vec2 z = vec2(0);
    vec2 c = coord + u_viewOffset;
    float ibe = 0.0; //maxIterations before explosion
    for(int count=0;count<maxIterations; count++){
      z = cx_mul(z, z) + c; //    z = z^2 + c
      if(cx_modulus(z) > 10.0){
        ibe = float(count);
      }
    }
    if(cx_modulus(z) < 1.0){
      return 1.0;
    }
    else{
      return ibe/float(maxIterations);
    }
}

float julia(vec2 z, vec2 c, float R){
  int iteration = 0;
  vec2 uv = z;
  float ibe = 0.0;
  for(int iteration=maxIterations; iteration>0; iteration--){
    
      float xtemp = (uv.x * uv.x) - (uv.y * uv.y);
      uv.y = xtemp + c.x;
      if(uv.x * uv.x + uv.y + uv.y >= pow(R, 2.0)){
        ibe= float(iteration);
        break;
      }
  }


  if(uv.x * uv.x + uv.y + uv.y < pow(R, 2.0)){
    return 1.0;
  }
  else
  {
    return float(iteration);
  };
}

void main() {
  float aspect = u_resolution
.x / u_resolution
.y;
  vec2 uv = vTexCoord;
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  uv.x -= sqrt(2.0) /2.0;
  uv*= u_zoom;
  uv/=0.85;
  // uv*=(1.0 - log(u_time/10.0));
  vec3 finalColor = log(mandelbrot(uv)* 5.0) * vec3(0.9, 0.21, 1.8);
  // vec3 finalColor = vec3(julia(uv, u_mousePos));
  gl_FragColor = vec4(finalColor, 1.0);
}