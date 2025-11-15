attribute vec3 instancePosition;
attribute vec3 instanceVelocity;
attribute float instanceId;
attribute float instanceScale;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vColor;
varying float vAlpha;

uniform float time;
uniform float audioLevel;
uniform vec3 audioFrequencyData;
uniform vec3 magneticField;

void main() {
  vNormal = normalize(normalMatrix * normal);

  // Velocity-based color
  float speed = length(instanceVelocity);
  vColor = mix(
    vec3(0.6, 0.8, 1.0),
    vec3(1.0, 0.7, 0.9),
    speed * 0.5 + audioFrequencyData.x * 0.5
  );

  // Add magnetic field color influence
  vColor = mix(vColor, vec3(0.8, 0.9, 1.0), magneticField.y * 0.3);

  // Distance-based alpha
  float distFromCenter = length(instancePosition);
  vAlpha = smoothstep(2.0, 0.8, distFromCenter) * (0.4 + audioLevel * 0.6);

  // Audio-reactive scale
  float audioScale = 1.0 + audioLevel * 0.4;
  vec3 scaledPosition = position * instanceScale * audioScale * 0.015;

  // World position
  vec3 worldPosition = instancePosition + scaledPosition;

  vec4 mvPosition = modelViewMatrix * vec4(worldPosition, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
