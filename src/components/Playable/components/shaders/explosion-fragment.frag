// This shader is far to complex and obviously I'm not this smart.
// It's generate by https://shadergpt.14islands.com/10f9efa1-7395-4431-9efd-26a1e6a4170c

precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_uv;

// Hash function for randomness
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Smooth noise function
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Fractal Brownian Motion (fbm) for fire texture
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for(int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Fireball shaping function
float fireShape(vec2 p, float time) {
  float r = length(p);
  float turbulence = fbm(p * 3.0 + time * 0.5);
  return smoothstep(0.5, 0.2, r - turbulence * 0.2);
}

// Shockwave effect
float shockwave(vec2 p, float time) {
  float r = length(p);
  float wave = sin((r - time * 2.0) * 10.0) * 0.5 + 0.5;
  wave *= smoothstep(0.1, 0.05, abs(r - time * 0.4));
  return wave;
}

void main() {
  vec2 uv = (v_uv * 2.0 - 1.0) / 3.0;
  uv.x *= (u_resolution.x / u_resolution.y);

  float time = u_time * 0.2;

  float fire = fireShape(uv, time);
  float shock = shockwave(uv, time);

  vec3 fireColor = mix(vec3(0.2, 0.0, 0.0), vec3(1.0, 0.5, 0.0), fire);
  vec3 shockColor = vec3(1.0) * shock;

  vec3 finalColor = fireColor + shockColor;

  gl_FragColor = vec4(finalColor, 1.0);

}
