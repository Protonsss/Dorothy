/// <reference types="vite/client" />

// Shader module declarations for vite-plugin-glsl
declare module '*.vert' {
  const value: string;
  export default value;
}

declare module '*.frag' {
  const value: string;
  export default value;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}
