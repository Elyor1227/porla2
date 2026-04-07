import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '') || 'https://example.com'

  return {
    plugins: [
      react(),
      {
        name: 'seo-files',
        closeBundle() {
          const dist = path.join(__dirname, 'dist')
          if (!fs.existsSync(dist)) return

          const paths = [
            { loc: '/', priority: '1.0', changefreq: 'weekly' },
            { loc: '/qna', priority: '0.85', changefreq: 'weekly' },
            { loc: '/login', priority: '0.7', changefreq: 'monthly' },
          ]

          const urlEntries = paths
            .map(
              (p) =>
                `  <url>\n    <loc>${siteUrl}${p.loc === '/' ? '' : p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
            )
            .join('\n')

          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
          fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap, 'utf8')

          const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
          fs.writeFileSync(path.join(dist, 'robots.txt'), robots, 'utf8')
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('\\react\\')) {
              return 'vendor-react'
            }
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            if (id.includes('react-helmet')) {
              return 'vendor-helmet'
            }
          },
        },
      },
    },
  }
})
