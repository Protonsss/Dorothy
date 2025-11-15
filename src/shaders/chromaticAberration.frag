uniform sampler2D tDiffuse;
uniform float amount;
uniform float time;
varying vec2 vUv;

void main() {
  vec2 offset = (vUv - 0.5) * amount;

  // Pulsing aberration
  float pulse = sin(time * 0.5) * 0.3 + 0.7;
  offset *= pulse;

  vec4 cr = texture2D(tDiffuse, vUv + offset);
  vec4 cga = texture2D(tDiffuse, vUv);
  vec4 cb = texture2D(tDiffuse, vUv - offset);

  gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
}
