import { SITE_URL } from '@/lib/sitemap-pages'
import { renderSitemapIndexXml } from '@/lib/sitemap-xml'

export async function GET() {
  const body = renderSitemapIndexXml([`${SITE_URL}/sitemap/pages.xml`])
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
