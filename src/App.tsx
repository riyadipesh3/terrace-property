import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'

/* Shared primitive. Scroll reveal uses IntersectionObserver, never a scroll
   listener, and collapses to fully visible under prefers-reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Section headings stack vertically. Only the hero and the listings grid
   spend a micro label, so the page uses 2 against a budget of 3. */
function SectionHead({
  kicker,
  title,
  body,
}: {
  kicker?: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-2xl">
      {kicker ? <p className="micro mb-5">{kicker}</p> : null}
      <h2 className="display display-md">{title}</h2>
      {body ? <p className="lede mt-6">{body}</p> : null}
    </div>
  )
}

const NAV = ['Listings', 'Neighbourhood', 'Agents', 'Enquiry']

type Status = 'For sale' | 'Under offer' | 'Sold'

type Listing = {
  status: Status
  price: string
  address: string
  detail: string
  beds: string
  baths: string
  area: string
  built: string
  dom: string
  photo: string
  alt: string
}

/* Photographs are pinned to specific picsum ids rather than random seeds, so
   the frame each address points at is auditable instead of a dice roll. */
const LISTINGS: Listing[] = [
  {
    status: 'For sale',
    price: '$842,000',
    address: '418 Alder Row',
    detail: 'Terrace Hill, detached',
    beds: '4 beds',
    baths: '2.5 baths',
    area: '2,410 sq ft',
    built: 'Built 1904, rebuilt 2019',
    dom: '9 days on market',
    photo: '164',
    alt: 'Narrow houses and small boats along a canal',
  },
  {
    status: 'For sale',
    price: '$615,000',
    address: '77 Prospect Street',
    detail: 'Fairwater, semi-detached',
    beds: '3 beds',
    baths: '1.5 baths',
    area: '1,680 sq ft',
    built: 'Built 1927',
    dom: '4 days on market',
    photo: '437',
    alt: 'Corner red brick apartment building with balconies above a cafe',
  },
  {
    status: 'Under offer',
    price: '$1,265,000',
    address: '12 Bellhaven Court',
    detail: 'Terrace Hill, detached',
    beds: '5 beds',
    baths: '3.5 baths',
    area: '3,120 sq ft',
    built: 'Built 1961, extended 2016',
    dom: 'Offer accepted 11 March',
    photo: '554',
    alt: 'Bridge span and ironwork seen against a pale sky',
  },
  {
    status: 'For sale',
    price: '$728,500',
    address: '340 Kestrel Lane',
    detail: 'Fairwater, detached bungalow',
    beds: '3 beds',
    baths: '2 baths',
    area: '1,915 sq ft',
    built: 'Built 1948',
    dom: 'Listed 2 days ago',
    photo: '419',
    alt: 'Tram running along a wide street lined with mid rise buildings',
  },
  {
    status: 'Sold',
    price: '$899,000',
    address: '9 Marlow Gardens',
    detail: 'Terrace Hill, semi-detached',
    beds: '4 beds',
    baths: '2 baths',
    area: '2,205 sq ft',
    built: 'Built 1912',
    dom: 'Sold in 17 days',
    photo: '290',
    alt: 'Stone facade of an old civic building seen from the pavement',
  },
  {
    status: 'For sale',
    price: '$538,000',
    address: '1520 Ridgeway Avenue',
    detail: 'Ridgeview, top floor flat',
    beds: '2 beds',
    baths: '1 bath',
    area: '1,140 sq ft',
    built: 'Built 1974',
    dom: '16 days on market',
    photo: '299',
    alt: 'Glass towers rising above a street of older stone buildings',
  },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'For sale' },
  { id: 'under-offer', label: 'Under offer' },
  { id: 'sold', label: 'Sold' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

const STATE_CLASS: Record<Status, string> = {
  'For sale': 'state-open',
  'Under offer': 'state-pending',
  Sold: 'state-closed',
}

/* Agents carry no photograph. A neutral monogram tile is honest about the
   asset not existing yet; a stock face from an unrelated photo library is not.
   Initials come from the name and inherit the locked radius. */
const AGENTS = [
  {
    name: 'Marisol Reyes',
    role: 'Partner, Terrace Hill and Ridgeview',
    phone: '415 682 1904',
    email: 'marisol@terraceproperty.co',
  },
  {
    name: 'Dev Bhattacharya',
    role: 'Sales associate, Fairwater',
    phone: '415 620 3387',
    email: 'dev@terraceproperty.co',
  },
  {
    name: 'Nora Whitfield',
    role: 'Sales associate, Terrace Hill',
    phone: '415 743 9016',
    email: 'nora@terraceproperty.co',
  },
  {
    name: 'Ellis Park',
    role: 'Lettings, all three neighbourhoods',
    phone: '415 668 5542',
    email: 'ellis@terraceproperty.co',
  },
]

const WALK_TIMES = [
  { place: 'Ridgeway Avenue to the office', time: '6 min walk' },
  { place: 'Fairwater Market on a Saturday', time: '9 min walk' },
  { place: 'Alder Row to the ridge path', time: '4 min walk' },
  { place: 'Downtown interchange at 5pm', time: '11 min drive' },
]

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [filter, setFilter] = useState<FilterId>('all')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<{ field: string; text: string } | null>(
    null,
  )
  const [sent, setSent] = useState(false)

  const visible = LISTINGS.filter((l) => {
    if (filter === 'all') return true
    if (filter === 'sale') return l.status === 'For sale'
    if (filter === 'under-offer') return l.status === 'Under offer'
    return l.status === 'Sold'
  })

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) {
      setError({ field: 'name', text: 'Add a name so we know who to reply to.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError({ field: 'email', text: 'That address is missing something.' })
      return
    }
    setError(null)
    setSent(true)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-on-accent)]"
      >
        Skip to content
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* NAV - single line at desktop, 72px                              */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/94 backdrop-blur-sm">
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5 text-[var(--color-ink)]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="shrink-0 text-[var(--color-accent)]"
            >
              <rect
                x="0.75"
                y="0.75"
                width="22.5"
                height="22.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="6.5"
                y1="8.75"
                x2="17.5"
                y2="8.75"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <line
                x1="12"
                y1="8.75"
                x2="12"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.75"
              />
            </svg>
            <span className="font-display text-[1.125rem] tracking-[-0.02em]">
              Terrace Property
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.slice(0, 3).map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[0.875rem] font-medium text-[var(--color-body)] transition-colors hover:text-[var(--color-accent)]"
              >
                {item}
              </a>
            ))}
          </nav>

          <a href="#enquiry" className="btn btn-primary hidden md:inline-flex">
            Book a viewing
          </a>

          <button
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center border border-[var(--color-hairline)] text-[var(--color-ink)] md:hidden"
          >
            <span className="flex w-4 flex-col gap-[5px]">
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {navOpen ? (
          <div
            id="mobile-nav"
            className="border-t border-[var(--color-hairline)] md:hidden"
          >
            <nav className="shell flex flex-col py-4">
              {NAV.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setNavOpen(false)}
                  className="border-b border-[var(--color-hairline)] py-3.5 text-[1rem] font-medium text-[var(--color-ink)] last:border-b-0"
                >
                  {item}
                </a>
              ))}
              <a
                href="#enquiry"
                onClick={() => setNavOpen(false)}
                className="btn btn-primary mt-5 w-full"
              >
                Book a viewing
              </a>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main">
        {/* -------------------------------------------------------------- */}
        {/* HERO - full bleed photograph carrying one overlay info card.    */}
        {/* Four text elements: eyebrow, headline, subtext, overlay card.  */}
        {/* -------------------------------------------------------------- */}
        <section id="top">
          <div className="shell pt-14 pb-8 md:pt-20 md:pb-10">
            <p className="micro mb-6">Residential sales since 2009</p>
            <h1 className="display display-xl">
              Six blocks of Terrace Hill, sold by people who live on them.
            </h1>
            <p className="lede mt-7">
              We keep one office on Bellhaven Court and publish the survey
              history on every instruction we take.
            </p>
          </div>

          <Reveal>
            <div className="relative">
              <div className="frame h-[clamp(430px,40vw,500px)] w-full">
                <img
                  src="https://picsum.photos/id/164/2000/820"
                  alt="Narrow houses and small boats along a canal at dusk"
                  loading="eager"
                  width={2000}
                  height={820}
                />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0">
                <div className="shell">
                  <div className="lift pointer-events-auto mb-4 max-w-[23rem] bg-[var(--color-raised)] p-5 md:mb-8 md:p-6">
                    <p className="state state-open">For sale</p>
                    <p className="price mt-3 text-[1.75rem] leading-none md:text-[2rem]">
                      $842,000
                    </p>
                    <p className="mt-2.5 text-[0.9375rem] font-semibold text-[var(--color-ink)]">
                      418 Alder Row
                    </p>
                    <p className="mt-1 text-[0.875rem] text-[var(--color-body)]">
                      4 beds, 2.5 baths, 2,410 sq ft
                    </p>
                    <a
                      href="#listings"
                      className="mt-5 inline-flex text-[0.9375rem] font-semibold text-[var(--color-accent)] underline decoration-[var(--color-hairline)] underline-offset-4 transition-colors hover:decoration-[var(--color-accent)]"
                    >
                      View listing
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* LISTINGS - filter bar plus a real card grid. Beds, baths and   */}
        {/* floor area are plain text on a hairline rule. No meters, no   */}
        {/* bars, no filled percentage tracks anywhere on this page.      */}
        {/* -------------------------------------------------------------- */}
        <section id="listings" className="shell py-20 md:py-28">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHead
                kicker="Six instructions"
                title="On the books this month"
                body="Two of these are already spoken for. Prices are asking prices, and each listing carries the last three sales on the same street."
              />
            </Reveal>

            <Reveal delay={70}>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const on = filter === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFilter(f.id)}
                      className={`border px-4 py-2 text-[0.875rem] font-semibold transition-colors ${
                        on
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-on-accent)]'
                          : 'border-[var(--color-hairline)] bg-[var(--color-raised)] text-[var(--color-body)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </Reveal>
          </div>

          <p
            aria-live="polite"
            className="mt-9 text-[0.8125rem] text-[var(--color-mute)]"
          >
            Showing {visible.length} of {LISTINGS.length} instructions
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((l, i) => {
              const closed = l.status === 'Sold'
              return (
                <Reveal key={l.address} delay={(i % 3) * 80}>
                  <article className="lift flex h-full flex-col bg-[var(--color-raised)]">
                    <div
                      className={`frame aspect-4/3 w-full ${
                        closed ? 'frame-closed' : ''
                      }`}
                    >
                      <img
                        src={`https://picsum.photos/id/${l.photo}/1200/900`}
                        alt={l.alt}
                        loading="lazy"
                        width={1200}
                        height={900}
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className={`state ${STATE_CLASS[l.status]}`}>
                          {l.status}
                        </p>
                        <p className="shrink-0 text-[0.75rem] text-[var(--color-mute)]">
                          {l.dom}
                        </p>
                      </div>

                      <p
                        className={`price mt-3 text-[1.5rem] leading-none ${
                          closed ? 'price-closed' : ''
                        }`}
                      >
                        {l.price}
                      </p>

                      <p className="mt-3 text-[0.9375rem] font-semibold text-[var(--color-ink)]">
                        {l.address}
                      </p>
                      <p className="mt-1 text-[0.875rem] text-[var(--color-body)]">
                        {l.detail}
                      </p>

                      <dl className="mt-5 flex items-center text-[0.875rem] text-[var(--color-body)]">
                        {[
                          { k: 'Beds', v: l.beds },
                          { k: 'Baths', v: l.baths },
                          { k: 'Floor area', v: l.area },
                        ].map((row, idx) => (
                          <div
                            key={row.k}
                            className={`flex items-baseline gap-2 ${
                              idx > 0
                                ? 'border-l border-[var(--color-hairline)] pl-3'
                                : 'pr-3'
                            }`}
                          >
                            <dt className="sr-only">{row.k}</dt>
                            <dd>{row.v}</dd>
                          </div>
                        ))}
                      </dl>

                      <p className="mt-4 text-[0.8125rem] text-[var(--color-mute)]">
                        {l.built}
                      </p>

                      <div className="mt-auto pt-5">
                        {closed ? (
                          <p className="text-[0.875rem] text-[var(--color-body)]">
                            Sold record available on request
                          </p>
                        ) : (
                          <a
                            href="#enquiry"
                            className="text-[0.875rem] font-semibold text-[var(--color-accent)] underline decoration-[var(--color-hairline)] underline-offset-4 transition-colors hover:decoration-[var(--color-accent)]"
                          >
                            Arrange a viewing
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* NEIGHBOURHOOD - 2 col split, locator frame on the right         */}
        {/* -------------------------------------------------------------- */}
        <section
          id="neighbourhood"
          className="border-y border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 md:py-28"
        >
          <div className="shell grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <SectionHead
                title="Three neighbourhoods, one office"
                body="Most of our sellers live within nine minutes of the door. That is how we know which streets back onto the rail cutting and which ones flood in February."
              />

              <dl className="mt-10 max-w-md">
                {WALK_TIMES.map((w) => (
                  <div
                    key={w.place}
                    className="flex items-baseline justify-between gap-6 border-t border-[var(--color-hairline)] py-4 last:border-b"
                  >
                    <dt className="text-[0.9375rem] text-[var(--color-body)]">
                      {w.place}
                    </dt>
                    <dd className="shrink-0 text-[0.9375rem] font-semibold text-[var(--color-ink)]">
                      {w.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={90}>
              <figure>
                <div className="frame aspect-5/4 w-full border border-[var(--color-hairline)]">
                  <img
                    src="https://picsum.photos/id/419/1400/1120"
                    alt="View along a wide street toward the tram line, buildings on both sides"
                    loading="lazy"
                    width={1400}
                    height={1120}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-[61%] top-[43%] block h-6 w-6 -translate-x-1/2 -translate-y-1/2 border-2 border-[var(--color-raised)] bg-[var(--color-accent)]"
                  />
                </div>
                <figcaption className="mt-4 text-[0.8125rem] text-[var(--color-body)]">
                  The office is at 214 Bellhaven Court, two blocks back from the
                  ridge path.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* AGENTS - plain row list with monogram tiles, not a card grid   */}
        {/* -------------------------------------------------------------- */}
        <section id="agents" className="shell py-20 md:py-28">
          <Reveal>
            <SectionHead
              title="Four people, one telephone number"
              body="Whoever answers can tell you whether the survey is worth reading. There is no call centre sitting between you and the agent doing the viewing."
            />
          </Reveal>

          <ul className="mt-12 divide-y divide-[var(--color-hairline)] border-t border-[var(--color-hairline)]">
            {AGENTS.map((a, i) => (
              <Reveal key={a.name} delay={i * 60}>
                <li className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-3 py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                  <span
                    aria-hidden="true"
                    className="grid h-14 w-14 place-items-center border border-[var(--color-hairline)] bg-[var(--color-accent-soft)] font-display text-[1.0625rem] text-[var(--color-accent)]"
                  >
                    {a.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>

                  <div className="min-w-0">
                    <p className="font-display text-[1.125rem] tracking-[-0.02em] text-[var(--color-ink)]">
                      {a.name}
                    </p>
                    <p className="mt-0.5 text-[0.875rem] text-[var(--color-body)]">
                      {a.role}
                    </p>
                    <a
                      href={`mailto:${a.email}`}
                      className="mt-1 block truncate text-[0.8125rem] text-[var(--color-accent)] underline decoration-[var(--color-hairline)] underline-offset-4 hover:decoration-[var(--color-accent)] sm:hidden"
                    >
                      {a.email}
                    </a>
                  </div>

                  <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-1 sm:col-start-3 sm:flex-col sm:items-end sm:gap-y-1">
                    <a
                      href={`tel:${a.phone.replace(/ /g, '')}`}
                      className="text-[0.9375rem] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {a.phone}
                    </a>
                    <a
                      href={`mailto:${a.email}`}
                      className="hidden text-[0.8125rem] text-[var(--color-accent)] underline decoration-[var(--color-hairline)] underline-offset-4 hover:decoration-[var(--color-accent)] sm:block"
                    >
                      {a.email}
                    </a>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* QUOTE - three lines, named attribution                        */}
        {/* -------------------------------------------------------------- */}
        <section className="border-y border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <figure className="mx-auto max-w-3xl">
                <blockquote className="display text-[clamp(1.45rem,2.9vw,2.15rem)] leading-[1.2]">
                  &ldquo;We looked at nine houses with three agents before this one.
                  These two talked us out of two of them and wrote down what was
                  wrong with the roof.&rdquo;
                </blockquote>
                <figcaption className="mt-7 text-[0.9375rem] text-[var(--color-body)]">
                  Faye Adeyemi, Operations Lead at Halyard Bakers
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* ENQUIRY - label above input, inline error, sent state          */}
        {/* -------------------------------------------------------------- */}
        <section id="enquiry" className="shell py-20 md:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <h2 className="display display-lg">
                Book a viewing
                <br />
                or get a valuation.
              </h2>
              <p className="lede mt-7">
                Tell us the streets you are looking at. You will get back the
                title search, the last three sales on that street, and an honest
                read on what the house is worth.
              </p>

              <dl className="mt-10 space-y-5">
                <div>
                  <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                    Office
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-[var(--color-body)]">
                    214 Bellhaven Court, Terrace Hill
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                    Direct line
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-[var(--color-body)]">
                    415 682 1900, weekdays 9 to 6
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal className="lg:col-span-7" delay={90}>
              {sent ? (
                <div className="lift border border-[var(--color-hairline)] bg-[var(--color-raised)] p-7 md:p-9">
                  <p className="state state-open">Enquiry received</p>
                  <p className="display display-md mt-4">
                    We have your details, {name.trim().split(' ')[0]}.
                  </p>
                  <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-[var(--color-body)]">
                    An agent covering that street will reply within one working
                    day with two or three viewing slots.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary mt-7"
                    onClick={() => setSent(false)}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form className="grid gap-5" noValidate onSubmit={submit}>
                  <div className="grid gap-2">
                    <label
                      htmlFor="name"
                      className="text-[0.8125rem] font-semibold text-[var(--color-ink)]"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-describedby="name-hint"
                      aria-invalid={error?.field === 'name'}
                      className="field"
                      placeholder="Marisol Reyes"
                    />
                    <p
                      id="name-hint"
                      className="text-[0.8125rem] text-[var(--color-mute)]"
                    >
                      The name the reply should be addressed to.
                    </p>
                    {error?.field === 'name' ? (
                      <p className="text-[0.8125rem] font-semibold text-[var(--color-accent)]">
                        {error.text}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-[0.8125rem] font-semibold text-[var(--color-ink)]"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-describedby="email-hint"
                      aria-invalid={error?.field === 'email'}
                      className="field"
                      placeholder="you@example.com"
                    />
                    <p
                      id="email-hint"
                      className="text-[0.8125rem] text-[var(--color-mute)]"
                    >
                      Used for the viewing times and nothing else.
                    </p>
                    {error?.field === 'email' ? (
                      <p className="text-[0.8125rem] font-semibold text-[var(--color-accent)]">
                        {error.text}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="phone"
                      className="text-[0.8125rem] font-semibold text-[var(--color-ink)]"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-describedby="phone-hint"
                      className="field"
                      placeholder="415 555 0184"
                    />
                    <p
                      id="phone-hint"
                      className="text-[0.8125rem] text-[var(--color-mute)]"
                    >
                      Optional, if you would rather not write.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="message"
                      className="text-[0.8125rem] font-semibold text-[var(--color-ink)]"
                    >
                      What are you looking for
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-describedby="message-hint"
                      className="field"
                      placeholder="Two or three streets, a budget range, and when you need to move."
                    />
                    <p
                      id="message-hint"
                      className="text-[0.8125rem] text-[var(--color-mute)]"
                    >
                      A budget range is enough to start with.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <button type="submit" className="btn btn-primary">
                      Send enquiry
                    </button>
                    <p className="text-[0.8125rem] text-[var(--color-mute)]">
                      One working day, usually sooner.
                    </p>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-14">
        <div className="shell grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-[1.125rem] tracking-[-0.02em] text-[var(--color-ink)]">
              Terrace Property
            </p>
            <p className="mt-3 max-w-[34ch] text-[0.875rem] leading-relaxed text-[var(--color-body)]">
              214 Bellhaven Court, Terrace Hill. Licensed in California since
              2009.
            </p>
          </div>

          <div>
            <p className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
              Buying
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {[
                { label: 'Current listings', href: '#listings' },
                { label: 'Neighbourhood', href: '#neighbourhood' },
                { label: 'Meet the agents', href: '#agents' },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[0.875rem] text-[var(--color-body)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
              Selling
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {[
                { label: 'Request a valuation', href: '#enquiry' },
                { label: 'Book a viewing', href: '#enquiry' },
                { label: 'Lettings', href: '#agents' },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[0.875rem] text-[var(--color-body)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="shell mt-12 flex flex-col gap-2 border-t border-[var(--color-hairline)] pt-6 text-[0.8125rem] text-[var(--color-mute)] sm:flex-row sm:items-center sm:justify-between">
          <p>Terrace Property Ltd, California DRE 01947281</p>
          <p>Equal Housing Opportunity</p>
        </div>
      </footer>
    </>
  )
}