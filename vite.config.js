import { defineConfig } from "vite";
import path from "node:path";
import { glob } from "glob";
import htmlComponentsPlugin from "./node_modules/vite-plugin-html-components/index.js";
// import { imgToPicture } from "@atrocityz/vite-plugin-html-img-to-picture";
import ViteFontsAutoPlugin from "vite-plugin-fonts-auto";

const htmlFiles = glob.sync("*.html"); // все html в корне
const input = {};

htmlFiles.forEach((file) => {
  const name = path.basename(file, ".html");
  if (name !== "404") {
    // опционально исключаем
    input[name === "index" ? "main" : name] = path.resolve(__dirname, file);
  }
});

export default defineConfig({
  root: ".",
  plugins: [
    ViteFontsAutoPlugin({
      indexHtml: "src/components/head.html",
    }),
    // imgToPicture({
    //   widths: [480, 768],
    //   quality: 85,
    //   lazyLoading: true,
    //   isDebugMode: true,
    // }),
    htmlComponentsPlugin({
      componentsDir: "src/components",
      tagName: "include",
      log: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:map"; @use "sass:color";`, // опционально
      },
    },
    postcss: "./postcss.config.mjs",
  },
  preview: {
    open: true,
  },
  build: {
    rollupOptions: { input },
  },
});
