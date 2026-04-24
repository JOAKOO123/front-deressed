import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.js",
    jsx: "react",
    coverage: {
      reporter: ["text", "lcov"],
      include: [
        "src/services/completionService.js",
        "src/context/AuthContext.jsx",
        "src/components/PrivateRoute.jsx",
        "src/components/Sidebar.jsx",
        "src/components/ProfileCompletion.jsx",
      ],
    },
  },
});