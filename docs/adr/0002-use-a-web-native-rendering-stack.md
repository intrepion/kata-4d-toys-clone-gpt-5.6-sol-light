# Use a web-native rendering stack

The experience will use Vite and TypeScript with Three.js rendering through WebGL2, while the 4D mathematics and slicing engine remain independent of the renderer. This favors broad desktop-browser support, deterministic unit testing, and fast iteration over an engine export or an early WebGPU dependency; launch support covers current and previous major desktop versions of Chrome, Edge, Firefox, and Safari, with measured scene budgets targeting 60 FPS on recent integrated graphics and graceful degradation to 30 FPS.
