# Content Files

This directory contains all website copy and content for the powder coating application.

## Files

### Core Content
- **home.md** - Homepage sections (hero, features, testimonials, how it works)
- **about.md** - About page content (team, promise, what we do)
- **faq.md** - Frequently asked questions

### Translations (i18n)
- **public/locales/en/common.json** - English translations for all UI strings
- **public/locales/lv/common.json** - Latvian translations for all UI strings

### SEO & Metadata
- **public/seo.json** - Page titles, meta descriptions, keywords, Open Graph data
- **public/schema-org.json** - Structured data (JSON-LD) for search engines

## Usage in React

### Using translations with react-i18next

```tsx
import { useTranslation } from 'react-i18next';

function Hero() {
  const { t } = useTranslation();

  return (
    <section>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.subheadline')}</p>
      <button>{t('hero.primaryCta')}</button>
    </section>
  );
}
```

### Using SEO metadata

```tsx
import seoData from '@/public/seo.json';
import { Helmet } from 'react-helmet-async';

function HomePage() {
  const { title, metaDescription, keywords } = seoData.en.home;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords.join(', ')} />
      </Helmet>
      {/* ... */}
    </>
  );
}
```

### Adding Schema.org structured data

```tsx
import { Helmet } from 'react-helmet-async';
import schemaData from '@/public/schema-org.json';

function App() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
```

## Updating Content

1. **Add new translations**: Edit `public/locales/{en,lv}/common.json`
2. **Update SEO**: Edit `public/seo.json`
3. **Modify copy**: Edit relevant `.md` files in `content/`
4. **Add structured data**: Update `public/schema-org.json`

## Social Media Copy

Social media bios are included in the translation files:
- Instagram/Facebook: `footer.social.instagram`
- LinkedIn: `footer.social.linkedin`

## Google Business Profile

Business descriptions for Google My Business are in `public/seo.json`:
- English: `business.en.shortDescription`
- Latvian: `business.lv.shortDescription`
