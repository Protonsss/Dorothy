precision highp float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vColor;
varying float vAlpha;

uniform float time;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Simple lighting
  float diffuse = max(dot(normal, vec3(0.5, 0.5, 0.5)), 0.0) * 0.5 + 0.5;

  // Fresnel for edge glow
  float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.0);

  // Combine
  vec3 color = vColor * diffuse;
  color += vColor * fresnel * 0.5;

  // Pulsing effect
  float pulse = sin(time * 2.0) * 0.1 + 0.9;

  gl_FragColor = vec4(color * pulse, vAlpha * 0.7);
}
