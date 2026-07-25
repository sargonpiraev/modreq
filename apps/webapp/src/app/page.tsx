import Image from 'next/image';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/modreq/calgkmpccmankefjidecombecabommmm';

const screenshots = [
  {
    src: '/screenshots/screenshot-1280x800-pick-modification-type.png',
    alt: 'Pick a modification type in modreq',
  },
  {
    src: '/screenshots/screenshot-1280x800-header-editor.png',
    alt: 'Header editor with Replace and Append modes',
  },
  {
    src: '/screenshots/screenshot-1280x800-header-rule.png',
    alt: 'Active request header rule',
  },
  {
    src: '/screenshots/screenshot-1280x800-cookie-rule.png',
    alt: 'Active cookie override rule',
  },
  {
    src: '/screenshots/screenshot-1280x800-header-and-cookie-rules.png',
    alt: 'Header and cookie rules together',
  },
] as const;

const features = [
  'Replace or append HTTP request headers',
  'Override cookies on the current site',
  'Toggle each rule on or off instantly',
  'Rules stay local — no account, no tracking',
] as const;

export default function HomePage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 70% 10%, var(--glow), transparent 60%), radial-gradient(ellipse 50% 40% at 15% 80%, var(--primary-soft), transparent 55%), linear-gradient(180deg, oklch(0.16 0.025 250), var(--background) 45%, oklch(0.12 0.02 260))',
        }}
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-foreground">
          modreq
        </p>
        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          Chrome Web Store
        </a>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 pb-16 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-8">
          <div className="animate-rise">
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              modreq
            </h1>
            <p className="mt-5 max-w-md text-xl font-medium leading-snug text-foreground/90 sm:text-2xl">
              Modify HTTP headers and cookies in Chrome.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Replace or append request headers. Override cookies. A free ModHeader
              alternative for developers and QA.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-background transition hover:brightness-110"
              >
                Add to Chrome
              </a>
              <a
                href="#screenshots"
                className="text-sm font-medium text-muted underline-offset-4 transition hover:text-foreground hover:underline"
              >
                See screenshots
              </a>
            </div>
          </div>

          <div className="animate-rise-delay relative">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full bg-primary/15 blur-3xl"
            />
            <div className="animate-drift relative overflow-hidden rounded-[1.75rem] border border-line bg-surface/80 shadow-[0_30px_80px_oklch(0_0_0/45%)]">
              <Image
                src={screenshots[0].src}
                alt={screenshots[0].alt}
                width={1280}
                height={800}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section className="animate-rise-later border-y border-line/70 bg-surface/40">
          <ul className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <li key={feature} className="text-sm leading-relaxed text-muted">
                <span className="mb-2 block h-1 w-8 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section id="screenshots" className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
            Screenshots
          </h2>
          <p className="mt-2 max-w-lg text-muted">
            Headers, cookies, Replace and Append — the full popup flow.
          </p>
          <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {screenshots.map((shot) => (
              <figure
                key={shot.src}
                className="w-[min(80vw,28rem)] shrink-0 snap-center overflow-hidden rounded-2xl border border-line bg-surface"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1280}
                  height={800}
                  className="h-auto w-full"
                />
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>modreq · rules stay in your browser</p>
        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground/80 transition hover:text-primary"
        >
          Open in Chrome Web Store
        </a>
      </footer>
    </div>
  );
}
