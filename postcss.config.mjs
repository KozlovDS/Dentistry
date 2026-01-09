import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssMediaSort from "postcss-sort-media-queries";

export default {
  plugins: [
    autoprefixer,
    cssnano({ preset: "default" }),
    postcssMediaSort({ sort: "desktop-first" }),
  ],
};
