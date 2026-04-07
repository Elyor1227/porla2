import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const DEFAULT_DESC =
  "Miila — ayollar salomatligi: video darslar, menstrual sikl kalendari, kunlik maslahatlar va anonim savol-javob. O‘zbek tilida."

const PAGES = {
  '/': {
    title: 'Miila',
    description: DEFAULT_DESC,
  },
  '/qna': {
    title: 'Anonim savol-javob | Miila',
    description:
      "Tibbiy savollaringizni anonim yuboring, mutaxassis javoblarini oling. Miila savol-javob bo‘limi.",
  },
  '/login': {
    title: 'Kirish ',
    description:
      "Miila ilovasiga kiring yoki bepul ro‘yxatdan o‘ting — ayollar salomatligi va sikl kuzatuvi.",
  },
  '/app': {
    title: 'Ilova | Miila',
    description: 'Darslar, sikl kalendari, bildirishnomalar va profil — Miila shaxsiy kabineti.',
  },
}

function siteBase() {
  const v = import.meta.env.VITE_SITE_URL
  if (v && /^https?:\/\//i.test(String(v).trim())) {
    return String(v).trim().replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export default function Seo() {
  const { pathname } = useLocation()
  const meta = PAGES[pathname] || PAGES['/']
  const base = siteBase()
  const canonical = `${base}${pathname === '/' ? '' : pathname}` || pathname

  const ogImageAbsolute = base ? `/vite.svg` : '/vite.svg'

  const jsonLd =
    pathname === '/' && base
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Miila',
          url: base,
          description: meta.description,
          inLanguage: 'uz-UZ',
        })
      : null

  return (
    <Helmet defaultTitle="Miila" htmlAttributes={{ lang: 'uz' }}>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:locale" content="uz_UZ" />
      {base ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={ogImageAbsolute} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />

      {jsonLd ? (
        <script type="application/ld+json">{jsonLd}</script>
      ) : null}
    </Helmet>
  )
}
