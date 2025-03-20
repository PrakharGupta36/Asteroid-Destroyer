precision mediump float;

varying vec2 vUv;

vec3 colorA = vec3(0.01, 0.07, 0.32);
vec3 colorB = vec3(0.23, 0.78, 0.88);

void main() {
  vec2 normalizedPixel = gl_FragCoord.xy / 5.0;
  vec3 color = mix(colorA, colorB, normalizedPixel.x);

  gl_FragColor = vec4(color, 1.0);
}
