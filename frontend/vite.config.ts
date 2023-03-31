import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [glsl(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  }
})
