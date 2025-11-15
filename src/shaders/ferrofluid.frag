precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Circular particle shape with soft edges
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Soft falloff
  float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;

  // Additive blending for glow effect
  vec3 color = vColor * (1.0 - dist * 0.5);

  gl_FragColor = vec4(color, alpha);
}
