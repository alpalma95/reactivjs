import { defineConfig } from "vite";

export default defineConfig({
    esbuild: {
        minify: true,
    },
    build: {
        lib: {
            entry: "src/index.js",
            name: "reactivjs",
            fileName: (format) => `reactivjs.${format}.js`,
        },
        rollupOptions: {
            input: 'src/index.js',
        },
    },
    test: {
        globals: true,
    },
});
