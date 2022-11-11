import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  splitting: true,
  sourcemap: false,
  minify: true,
  clean: true,
  skipNodeModulesBundle: true,
  dts: true,
  outDir: 'lib',
  external: ['node_modules', 'src/raydiumCLMM.ts'],
}));
