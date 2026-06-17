import { defineConfig } from 'vite'
import { mdSitePlugin } from './plugin-md-site.js'

// Plain Vite + a small custom plugin. No frameworks.
// Markdown lives in docs/ and blog/; assets/ is served at /assets/*.
export default defineConfig({
  // Disable Vite's default public dir — we handle /assets ourselves.
  publicDir: false,
  build: {
    // Push hashed JS/CSS into _static/ so it can't collide with /assets/.
    assetsDir: '_static',
    emptyOutDir: true,
  },
  plugins: [mdSitePlugin()],
})
