import { defineConfig } from "vite";

export default defineConfig({
    esbuild: {
        minify: true,
    },
    build: {
        lib: {
            entry: "src/index.js",
            name: "zborjs",
            fileName: (format) => `zborjs.${format}.js`,
        },
        rollupOptions: {
            input: 'src/index.js',
        },
    },
    test: {
        globals: true,
    },
});
