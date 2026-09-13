import { getPagesSitemap } from '@/lib/sitemap-pages'
import { renderSitemapUrlsetXml } from '@/lib/sitemap-xml'

type RouteProps = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { id: rawId } = await params
  const id = rawId.replace(/\.xml$/, '')
  if (id !== 'pages') {
    return new Response('Not Found', { status: 404 })
  }

  const body = renderSitemapUrlsetXml(getPagesSitemap())
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
