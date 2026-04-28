import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "overbacklogged",
  },
  react: {
    vitePluginsBefore: [
      tanstackRouter({
        target: "react",
        routesDirectory: "src/routes",
        generatedRouteTree: "src/routeTree.gen.ts",
        autoCodeSplitting: true,
      }),
    ],
  },
  vite: () => ({
    plugins: [tailwindcss()],
    css: {
      transformer: "lightningcss",
    },
    build: {
      cssMinify: "lightningcss",
    },
  }),
});
