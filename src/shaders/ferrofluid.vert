attribute vec3 velocity;
attribute float particleId;

varying vec3 vColor;
varying float vAlpha;

uniform float time;
uniform float audioLevel;
uniform vec3 audioFrequencyData;
uniform vec3 magneticField;
uniform float particleSize;

void main() {
  // Magnetic field influence based on audio
  vec3 magneticInfluence = magneticField * audioLevel;

  // Color based on velocity and audio frequency
  float speed = length(velocity);
  vColor = mix(
    vec3(0.6, 0.8, 1.0),
    vec3(1.0, 0.7, 0.9),
    speed * 0.5 + audioFrequencyData.x
  );

  // Alpha based on distance from center and particle ID
  float distFromCenter = length(position);
  vAlpha = smoothstep(1.5, 0.5, distFromCenter) * (0.3 + audioLevel * 0.7);

  // Particle size varies with audio
  float size = particleSize * (1.0 + audioLevel * 0.5);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
