import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['solid-markdown > micromark', 'solid-markdown > unified'],
  },
});
