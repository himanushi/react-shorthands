/// <reference types="vitest" />

import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.type.json",
      outDir: "./dist",
    }),
  ],
  resolve: {
    alias: { "~/": `${__dirname}/lib/` },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    alias: { "~/": `${__dirname}/lib/` },
  },
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "react/jsx-runtime",
          "react-dom": "ReactDOM",
        },
        preserveModules: true,
        inlineDynamicImports: false,
        preserveModulesRoot: "lib",
        entryFileNames: ({ name: fileName }) => `${fileName}.js`,
        assetFileNames: (assetInfo) => {
          const names = assetInfo.names;
          if (names?.some((n) => n.endsWith(".css"))) {
            return "style.css";
          }
          return "[name].[ext]";
        },
      },
      treeshake: {
        preset: "smallest",
        annotations: true,
        moduleSideEffects: true,
        correctVarValueBeforeDeclaration: true,
        propertyReadSideEffects: true,
        tryCatchDeoptimization: true,
        unknownGlobalSideEffects: true,
      },
    },
  },
});
