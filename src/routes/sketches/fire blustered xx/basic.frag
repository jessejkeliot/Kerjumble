precision lowp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdRhombus(vec2 p, vec2 b ) 
{
    p = abs(p);
    float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
    float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  vec2 uv0 = uv;

  float div = 1.;
  float freq = 0.4;
  float n = 6.;
  vec3 flatpurple = vec3(0.8, 0.1, 0.32);
  vec3 boost = vec3(1.0 / length(uv0), 0.2, 0.9);
  // boost = vec3(1.0, 1.0, 1.0);
  vec3 finalColor = vec3(0);
  float osc3 = sin(time / 2.0) * 0.5 + 0.5;
  for(float i=1.0; i<=1.0; i++){
    float flip = (mod(i, 2.0) * 2.0) * -1.0;
    // flip = 1.0;
    uv = fract(uv * div + i);
    uv += vec2(1.0, 0.0) *(0.5 - 0.5*flip/2.0);
    uv -= 0.5;

    // vec3 col = vec3(0);
    float osc1 = sin(time*freq + length(uv + i)* 1.0 + i) * 0.5 + 0.5;
    
    float osc2 = uv.y * flip * sin(time * freq /2.0 + length(uv0) + i) * 0.5 + 0.5;

    float d = sdRhombus(uv * (osc1 * 2.0 + 1.0), vec2(osc2, osc1));
    d = abs(d);
    // d = step(0.01, d);
    d = 0.9/d;
    vec3 d0col = gradientMap(fract(n * osc1 * sdRhombus(uv0 * (osc2+0.9), vec2(osc1/2.0 + 0.2))));
    vec3 d2col = flatpurple * gradientMap(osc3);
    d0col = abs(d0col - d2col);
    vec3 col = d * d0col + 0.5/d * flip;
    // vec3 col = gradientMap(d);
    col *= gradientMap(mod(length(uv0) * 1.9, 1.0)) * d;
    col += d * d0col - flip/4.0;
    finalColor += col/1.0;
    finalColor -= abs(finalColor - col/2.0 + flip)/6.0;
    finalColor = mod(finalColor, vec3(ndot(uv, uv*(i+0.2)), 0.4, ndot(uv, vec2(mod(time*freq, 1.0))))*i);
  }
  finalColor = step(length(finalColor * 0.2), 0.9) * (finalColor + flatpurple / 2.0);
  finalColor = smoothstep(0.4,0.7, 1.5*gradientMap(length(finalColor/3.0)));
  finalColor *= vec3(1.0, 0.9, 0.76) * 0.9;
  // finalColor = 1.0 - finalColor;
  finalColor = mod(finalColor, flatpurple*10.0);

  // d = abs(d);

  // d = clamp(0.5, 0.95, d);

  gl_FragColor = vec4(finalColor, 1.0);
}

  // vec3 finalColor = vec3(0);
  // for(float i=1.0; i<=4.0; i++){
  //   float flip = (mod(i, 2.0) * 2.0) * -1.0;
  //   uv = fract(uv * div + i * flip);
  //   uv -=0.5;

  //   // vec3 col = vec3(0);
  //   float osc1 = sin(time*freq + length(uv)* 1.0/i) * 0.5 + 0.5;
    
  //   float osc2 = sin(time * freq /2.0 + length(uv0)) * 0.5 + 0.5;

  //   float d = sdRhombus(uv * (osc1 * 2.0 + 1.0), vec2(osc2, osc1));
  //   d = abs(d);
  //   // d = step(0.01, d);
  //   // vec3 col = gradientMap(length(uv0)) * d;
  //   d = 0.15/d;
  //   vec3 d0col = gradientMap(abs(fract(n * sdRhombus(uv0 * (osc2+0.2), vec2(1.0)))));
  //   // d0col = gradientMap(distance(uv, vec2(i/4.0)));
  //   vec3 col = d * d0col + 0.5/d * flip;
  //   col = d * d0col;
  //   finalColor += col;
  // }