import type { MetadataRoute } from 'next'

export function renderSitemapIndexXml(locs: readonly string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((loc) => `  <sitemap><loc>${loc}</loc></sitemap>`).join('\n')}
</sitemapindex>`
}

export function renderSitemapUrlsetXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((item) => {
      const lastmod = item.lastModified
        ? `    <lastmod>${new Date(item.lastModified).toISOString()}</lastmod>\n`
        : ''
      return `  <url>
    <loc>${item.url}</loc>
${lastmod}  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
