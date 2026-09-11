import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                // Recharts and React change on very different cadences than the
                // app code — splitting them keeps the cached vendor chunk stable.
                manualChunks: {
                    react: ["react", "react-dom", "react-router-dom"],
                    charts: ["recharts"],
                },
            },
        },
    },
});
