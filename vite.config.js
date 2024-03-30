import { defineConfig } from "vite";

export default defineConfig({
    esbuild: {
        minify: true,
    },
    build: {
        lib: {
            entry: "src/index.js",
            name: "reactivity",
            fileName: (format) => `reactivity.${format}.js`,
        },
        rollupOptions: {
          
            input: 'index.js',
          },
    },
    test: {
        globals: true,
    },
});
