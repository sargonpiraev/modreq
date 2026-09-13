import type { MetadataRoute } from 'next'

const SITE_URL = 'https://sargonpiraev.github.io/modreq'

export function getPagesSitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}

export { SITE_URL }
