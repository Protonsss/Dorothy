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
uniform sampler2D matcap;

// Enhanced subsurface scattering
vec3 subsurfaceScattering(vec3 normal, vec3 lightDir, vec3 viewDir, float thickness) {
  vec3 scatterDir = lightDir + normal * 0.3;
  float scatter = pow(clamp(dot(viewDir, -scatterDir), 0.0, 1.0), 4.0) * thickness;

  // Multi-layer scattering for depth
  float deepScatter = pow(clamp(dot(viewDir, -scatterDir), 0.0, 1.0), 8.0);

  vec3 shallowColor = vec3(1.0, 0.95, 0.9);
  vec3 deepColor = vec3(1.0, 0.7, 0.5);

  return mix(deepColor, shallowColor, scatter) * (scatter + deepScatter * 0.5) * subsurface;
}

// Advanced iridescence with color shift
vec3 iridescenceEffect(vec3 normal, vec3 viewDir, float strength) {
  float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
  float phase = fresnel * 15.0 + time * 0.3;

  // HSV-based color cycling
  vec3 irid;
  irid.r = sin(phase) * 0.5 + 0.5;
  irid.g = sin(phase + 2.094) * 0.5 + 0.5;
  irid.b = sin(phase + 4.189) * 0.5 + 0.5;

  // Add secondary frequency for complexity
  float phase2 = fresnel * 8.0 - time * 0.2;
  vec3 irid2;
  irid2.r = sin(phase2 + 1.0) * 0.3 + 0.5;
  irid2.g = sin(phase2 + 3.0) * 0.3 + 0.5;
  irid2.b = sin(phase2 + 5.0) * 0.3 + 0.5;

  return mix(irid, irid2, 0.3) * strength * fresnel;
}

// Physically-based Fresnel
float fresnelSchlick(float cosTheta, float F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// Film grain
float filmGrain(vec2 uv, float time) {
  float x = (uv.x + 4.0) * (uv.y + 4.0) * (time * 10.0);
  return mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01) - 0.005;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  vec3 lightDir = normalize(lightPosition - vWorldPosition);

  // Base color with warmth and audio reactivity
  vec3 coolColor = vec3(0.7, 0.85, 1.0);
  vec3 warmColor = vec3(1.0, 0.85, 0.65);
  vec3 baseColor = mix(coolColor, warmColor, warmth);

  // Audio-reactive color shift
  baseColor = mix(baseColor, vec3(0.9, 0.7, 1.0), audioLevel * 0.3);

  // Diffuse lighting
  float diffuse = max(dot(normal, lightDir), 0.0);
  diffuse = pow(diffuse, 0.8); // Soften

  // Specular with GGX approximation
  vec3 halfDir = normalize(lightDir + viewDir);
  float roughness = 0.15;
  float specular = pow(max(dot(normal, halfDir), 0.0), (2.0 / (roughness * roughness)) - 2.0);
  specular *= (1.0 - roughness);

  // Fresnel effect
  float fresnel = fresnelSchlick(max(dot(normal, viewDir), 0.0), 0.04);

  // Subsurface scattering
  vec3 sss = subsurfaceScattering(normal, lightDir, viewDir, subsurface);

  // Iridescence
  vec3 irid = iridescenceEffect(normal, viewDir, iridescence);

  // Rim lighting for depth
  float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  vec3 rimColor = mix(vec3(0.4, 0.6, 1.0), vec3(1.0, 0.6, 0.8), audioLevel) * rim;

  // Audio reactivity - pulse internal glow
  float audioPulse = audioLevel * 0.6;
  vec3 innerGlow = baseColor * (1.5 + audioPulse);

  // Ambient occlusion approximation
  float ao = 0.3 + 0.7 * diffuse;

  // Combine all lighting components
  vec3 finalColor = baseColor * diffuse * 0.5 * ao;
  finalColor += sss * 1.2;
  finalColor += irid * 0.8;
  finalColor += rimColor * 0.6;
  finalColor += specular * vec3(1.0) * 0.4;
  finalColor += innerGlow * (1.0 - diffuse * 0.5) * 0.5;
  finalColor += fresnel * vec3(1.0) * 0.15;

  // Film grain for cinematic quality
  float grain = filmGrain(vUv, time);
  finalColor += grain * 0.03;

  // Enhanced tone mapping (ACES approximation)
  vec3 a = finalColor * 2.51;
  vec3 b = finalColor * 0.03 + 0.59;
  vec3 c = finalColor * 2.43 + 0.14;
  finalColor = clamp((a + 0.02) / (b * c + 0.14), 0.0, 1.0);

  // Gamma correction
  finalColor = pow(finalColor, vec3(1.0/2.2));

  // Enhanced alpha for depth
  float alpha = 0.92 + fresnel * 0.08;

  gl_FragColor = vec4(finalColor, alpha);
}
