import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  }
})
