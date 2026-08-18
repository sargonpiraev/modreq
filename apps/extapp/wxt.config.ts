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
    // Monorepo nests react under apps/extapp + packages/ui; without dedupe the
    // popup crashes with "Cannot read properties of null (reading 'useContext')".
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  }),
  manifest: {
    name: 'modreq - Modify HTTP Headers',
    description:
      'Modify HTTP request headers and cookies. Replace or append headers, override cookies. Free ModHeader alternative.',
    permissions: ['declarativeNetRequest', 'cookies', 'storage', 'tabs'],
    host_permissions: ['<all_urls>'],
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'self';",
    },
  },
  webExt: {
    startUrls: ['https://httpbingo.org/headers'],
  },
});
