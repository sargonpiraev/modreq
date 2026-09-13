import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { env } from './src/env'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const appDir = path.dirname(fileURLToPath(import.meta.url))
const isProd = env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  // Project site: https://sargonpiraev.github.io/modreq/
  basePath: isProd ? '/modreq' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(appDir, '../..'),
  },
}

export default withNextIntl(nextConfig)
