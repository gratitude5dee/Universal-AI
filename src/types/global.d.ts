
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />
/// <reference types="canvas-confetti" />
/// <reference path="./button.d.ts" />
/// <reference path="./framer-motion.d.ts" />
/// <reference path="./crossmint.d.ts" />
/// <reference path="./buffer.d.ts" />
/// <reference path="./env.d.ts" />
/// <reference path="./recharts.d.ts" />

// Ensure React JSX runtime is properly typed
declare module 'react/jsx-runtime' {
  export default any;
}
