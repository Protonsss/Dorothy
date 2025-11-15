precision highp float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

uniform float iridescence;
uniform float subsurface;
uniform float audioLevel;
uniform float warmth;
uniform float time;
uniform vec3 lightPosition;

// Subsurface scattering approximation
vec3 subsurfaceScattering(vec3 normal, vec3 lightDir, vec3 viewDir, float thickness) {
  vec3 scatterDir = lightDir + normal * 0.3;
  float scatter = pow(clamp(dot(viewDir, -scatterDir), 0.0, 1.0), 4.0) * thickness;
  return vec3(1.0, 0.8, 0.6) * scatter * subsurface;
}

// Iridescence (thin film interference)
vec3 iridescenceEffect(vec3 normal, vec3 viewDir, float strength) {
  float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
  float phase = fresnel * 10.0 + time * 0.5;

  vec3 irid;
  irid.r = sin(phase) * 0.5 + 0.5;
  irid.g = sin(phase + 2.094) * 0.5 + 0.5;
  irid.b = sin(phase + 4.189) * 0.5 + 0.5;

  return irid * strength * fresnel;
}

// Physically-based Fresnel
float fresnelSchlick(float cosTheta, float F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  vec3 lightDir = normalize(lightPosition - vWorldPosition);

  // Base color with warmth
  vec3 baseColor = mix(
    vec3(0.8, 0.9, 1.0),  // Cool blue-white
    vec3(1.0, 0.9, 0.7),  // Warm amber
    warmth
  );

  // Diffuse lighting
  float diffuse = max(dot(normal, lightDir), 0.0);

  // Specular (glossy highlights)
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 128.0);

  // Fresnel effect
  float fresnel = fresnelSchlick(max(dot(normal, viewDir), 0.0), 0.04);

  // Subsurface scattering
  vec3 sss = subsurfaceScattering(normal, lightDir, viewDir, subsurface);

  // Iridescence
  vec3 irid = iridescenceEffect(normal, viewDir, iridescence);

  // Rim lighting for depth
  float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  vec3 rimColor = vec3(0.5, 0.7, 1.0) * rim * 0.5;

  // Audio reactivity - pulse internal glow
  float audioPulse = audioLevel * 0.4;
  vec3 innerGlow = baseColor * (1.0 + audioPulse);

  // Combine all lighting components
  vec3 finalColor = baseColor * diffuse * 0.6;
  finalColor += sss;
  finalColor += irid;
  finalColor += rimColor;
  finalColor += specular * vec3(1.0) * 0.3;
  finalColor += innerGlow * (1.0 - diffuse) * 0.4;
  finalColor += fresnel * vec3(1.0) * 0.2;

  // Tone mapping
  finalColor = finalColor / (finalColor + vec3(1.0));

  // Gamma correction
  finalColor = pow(finalColor, vec3(1.0/2.2));

  // Alpha for volumetric effect
  float alpha = 0.85 + fresnel * 0.15;

  gl_FragColor = vec4(finalColor, alpha);
}
