import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  alias: {
    '@': resolve('.'),
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'modreq',
    permissions: ['declarativeNetRequest', 'cookies', 'storage', 'tabs'],
    host_permissions: ['<all_urls>'],
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'self';",
    },
  },
});
