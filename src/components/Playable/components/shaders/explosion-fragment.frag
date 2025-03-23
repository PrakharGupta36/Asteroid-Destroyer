precision lowp float;

uniform float time;
uniform vec3 color1;
uniform vec3 color2;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Improved noise functions for more realistic effects
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Improved Perlin-style noise
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  // Cubic Hermite interpolation for smoother transition
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

// Fractal Brownian Motion for more complex noise patterns
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  // Add noise at different frequencies and amplitudes
  for(int i = 0; i < 5; i++) {
    value += amplitude * noise(st * frequency);
    frequency *= 2.17;
    amplitude *= 0.5;
  }
  return value;
}

// Voronoi pattern for cell-like structures in explosion
float voronoi(vec2 st) {
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);
  float m_dist = 1.0;

  for(int j = -1; j <= 1; j++) {
    for(int i = -1; i <= 1; i++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 point = random(i_st + neighbor);
      point = 0.5 + 0.5 * sin(time * 0.8 + 6.2831 * point);
      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      m_dist = min(m_dist, dist);
    }
  }

  return m_dist;
}

// Heat distortion function
vec2 distort(vec2 uv, float time) {
  vec2 distortion = vec2(noise(uv * 3.0 + vec2(time * 0.5, 0.0)) * 0.2, noise(uv * 3.0 + vec2(0.0, time * 0.5)) * 0.2);
  return uv + distortion * (1.0 - time) * 0.2;
}

void main() {
  // Heat distortion effect
  vec2 distortedUV = distort(vUv, time);

  // Core explosion effect
  float dist = length(vPosition) * 2.0;

  // Multi-layered noise for complex patterns
  float noiseBase = fbm(distortedUV * 8.0 + time * 2.0) * 0.5;
  float noiseDetail = noise(distortedUV * 20.0 - time * 3.0) * 0.2;
  float noiseValue = noiseBase + noiseDetail;

  // Add cellular/voronoi pattern for spark-like effects
  float cells = voronoi(distortedUV * 10.0 * (1.0 + time));
  float sparkThreshold = 0.1 + time * 0.3;
  float sparks = smoothstep(sparkThreshold, sparkThreshold + 0.05, cells);

  // Edge glow effect with noise variation
  float edgeGlow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
  edgeGlow = edgeGlow * (1.0 + noiseValue * 2.0);

  // Dynamic core fade with multiple layers
  float coreFade = smoothstep(time + 0.3 + noiseValue, time - 0.1, dist);
  float outerFade = smoothstep(time * 1.5 + 0.5, time - 0.2, dist);

  // Combined alpha with temporal variation
  float timeDecay = smoothstep(1.0, 0.0, time / 1.5);
  float alpha = (coreFade * 0.7 + outerFade * 0.3) * timeDecay;

  // Add turbulence and spark highlights
  alpha += edgeGlow * 0.4 * (1.0 - time / 1.5);
  alpha += (1.0 - sparks) * (1.0 - time) * 0.8 * step(dist, 2.0);

  // Multi-color blending based on distance and noise
  vec3 hotCore = mix(color1, vec3(1.0, 1.0, 0.8), noiseValue * 0.5);
  vec3 outerFlame = mix(color2, vec3(0.6, 0.2, 0.0), noiseValue + dist * 0.2);
  vec3 smokeTip = vec3(0.2, 0.2, 0.2);

  // Three-stage color mixing for realistic flame
  vec3 finalColor = mix(hotCore, outerFlame, smoothstep(0.0, 1.0, dist));
  finalColor = mix(finalColor, smokeTip, smoothstep(0.5, 1.5, dist) * time);

  // Add brightness variations based on noise and edge glow
  finalColor *= 1.0 + edgeGlow * (1.0 - time) * 1.5;
  finalColor += vec3(1.0, 0.9, 0.6) * (1.0 - sparks) * (1.0 - time) * 2.0 * step(dist, 1.3);

  // HDR-like effect with temporal cooling
  float intensity = 5.5 * (1.0 - time * 0.7);
  finalColor = pow(finalColor * intensity, vec3(0.5));

  gl_FragColor = vec4(finalColor, alpha);
}