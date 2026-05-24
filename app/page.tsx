import {
  HERO,
  ABOUT_PARAS,
  ABOUT_CARD,
  EXPERIENCE,
  PROJECTS,
  SKILL_ROWS,
  CONTACT_LINKS,
  NAV_SECTIONS,
} from "@/lib/content";
import { ProjectThumb } from "@/components/ProjectThumb";
import { ContactForm } from "@/components/ContactForm";
import { ClientRuntime } from "@/components/ClientRuntime";
import { NeuralBackground } from "@/components/NeuralBackground";
import { AchievementsGrid } from "@/components/achievements/AchievementsGrid";
import { getResolvedAchievements } from "@/lib/achievements-server";

function ProficiencyDots({ on }: { on: number }) {
  return (
    <span className="pt-dots">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={"pt-dot" + (i < on ? " on" : "")} />
      ))}
    </span>
  );
}

export default async function Page() {
  const achievements = await getResolvedAchievements();
  return (
    <>
      <div className="grain" />
      <div className="cursor" />
      <div className="cursor-dot" />

      <header className="topbar" role="banner">
        <div className="brand">
          VANSH.PATIL<span aria-hidden="true">/</span>ML-ENG
        </div>
        <div className="status">
          <span className="dot" aria-hidden="true" />
          <span id="clock" aria-live="off" aria-hidden="true">--:--:-- IST</span>
          <span className="sr-only">Location: Mumbai, India</span>
          <span aria-hidden="true">· MUMBAI, IN</span>
        </div>
        <button
          type="button"
          className="nav-toggle"
          id="nav-toggle"
          aria-label="Open navigation menu"
          aria-controls="mobile-nav"
          aria-expanded="false"
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </header>

      <nav className="side-rail" id="rail" aria-label="Section navigation">
        {NAV_SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} data-section={s.id}>
            {s.label}
          </a>
        ))}
      </nav>

      {/* Mobile nav drawer */}
      <div
        className="mobile-nav"
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden="true"
        inert
      >
        <div className="mobile-nav-head">
          <span className="mobile-nav-brand">VANSH.PATIL<span aria-hidden="true">/</span>ML-ENG</span>
          <button
            type="button"
            className="mobile-nav-close"
            id="nav-close"
            aria-label="Close navigation menu"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            >
              <path d="M2 2 L12 12 M12 2 L2 12" />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav-list" aria-label="Section navigation (mobile)">
          {NAV_SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-section={s.id}
              className="mobile-nav-link"
              style={{ ['--i' as unknown as string]: String(i) } as React.CSSProperties}
            >
              <span className="mobile-nav-num">{String(i).padStart(2, '0')}</span>
              <span className="mobile-nav-label">{s.label}</span>
              <span className="mobile-nav-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
        <div className="mobile-nav-foot">
          <a href="/resume.pdf" download className="mobile-nav-cta">
            <span aria-hidden="true">⤓</span> Résumé · PDF
          </a>
          <div className="mobile-nav-status">
            <span className="dot" aria-hidden="true" />
            <span>MUMBAI · IN</span>
          </div>
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
        {/* HERO */}
        <section id="hero" className="hero" aria-labelledby="hero-title">
          <NeuralBackground particleCount={300} trailOpacity={0.08} speed={0.5} />
          <div className="hero-avatar">
            {/* avatar shipped in /public/assets */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/avatar-cutout.png" alt="Vansh Patil" />
            <span className="hero-shine" aria-hidden="true" />
            <span className="hero-tag">№ 01 · MUMBAI · IN</span>
          </div>
          <div className="hero-eyebrow">{HERO.eyebrow}</div>
          <h1 id="hero-title" className="hero-title" dangerouslySetInnerHTML={{ __html: HERO.titleHtml }} />
          <div className="hero-role" dangerouslySetInnerHTML={{ __html: HERO.roleHtml }} />
          <p className="hero-sub" dangerouslySetInnerHTML={{ __html: HERO.sub }} />
          <div className="hero-meta">
            {HERO.meta.map((m) => (
              <div key={m.k} className="cell">
                <span className="k">{m.k}</span>
                <span className="v" dangerouslySetInnerHTML={{ __html: m.v }} />
              </div>
            ))}
          </div>
          <div className="scroll-hint" aria-hidden="true">
            SCROLL ↓<span className="hint-kbd">&nbsp; OR PRESS ⌘K</span>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="section-header">
            <span className="section-label">01 / About</span>
            <h2 className="section-title">The short version.</h2>
          </div>
          <div className="about-grid">
            <div className="about-text reveal">
              {ABOUT_PARAS.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              <a href="/resume.pdf" className="resume-link" download>
                <span className="arr" aria-hidden="true">⤓</span> Download résumé · PDF
              </a>
            </div>
            <div className="about-card reveal">
              {ABOUT_CARD.map((r) => (
                <div key={r.k} className="row">
                  <span className="k">{r.k}</span>
                  <span className={"v" + (r.hl ? " hl" : "")}>
                    {r.k === "org" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="row-logo" src="/orgs/iit-patna.png" alt="IIT Patna" />
                    )}
                    {r.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="section-header">
            <span className="section-label">02 / Work</span>
            <h2 className="section-title">Where I&apos;ve shipped.</h2>
          </div>
          <div className="exp-list">
            {EXPERIENCE.map((e, i) => (
              <div key={i} className="exp-item reveal">
                <div className="exp-date">{e.date}</div>
                <div className="exp-role">
                  <h3>{e.role}</h3>
                  <div className="co">
                    {e.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="exp-logo" src={`/orgs/${e.logo}`} alt={`${e.org} logo`} />
                    )}
                    <span>{e.org}</span>
                  </div>
                  <div className="loc">{e.loc}</div>
                </div>
                <div className="exp-desc">
                  <ul>
                    {e.bullets.map((b, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: b.text }} />
                    ))}
                  </ul>
                  {e.metrics.length > 0 && (
                    <div className="metrics">
                      {e.metrics.map((m, j) => (
                        <span key={j} className="metric">
                          <strong>{m.value}</strong> {m.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="section-header">
            <span className="section-label">03 / Builds</span>
            <h2 className="section-title">Selected work.</h2>
          </div>
          <div className="proj-list">
            {PROJECTS.map((p) => (
              <article key={p.num} className="proj-row">
                {p.href && (
                  <a
                    className="proj-row-cover"
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.title} — open live`}
                  />
                )}
                <ProjectThumb id={p.thumbId} label={p.title.toUpperCase()} media={p.media} href={p.href} />
                <div className="proj-num">{p.num}</div>
                <div className="proj-title">
                  {p.title}
                  {p.tag && (
                    <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 11 }}>
                      {" "}
                      [{p.tag}]
                    </span>
                  )}
                </div>
                <div className="proj-desc">
                  <span className="proj-desc-text">{p.desc}</span>
                  {(p.code || p.video) && (
                    <div className="proj-links">
                      {p.code && (
                        <a
                          className="proj-link"
                          href={p.code}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title} — source code`}
                        >
                          Code ↗
                        </a>
                      )}
                      {p.video && (
                        <a
                          className="proj-link"
                          href={p.video}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title} — demo video`}
                        >
                          Video ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="proj-stack">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                <div className="proj-arrow" aria-hidden="true">↗</div>
              </article>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="section-header">
            <span className="section-label">04 / Stack</span>
            <h2 className="section-title">Tools of the trade.</h2>
          </div>
          <div className="ptable reveal">
            <div className="ptable-toolbar">
              <div className="ptable-filters">
                <button className="pt-chip active" data-filter="all">All</button>
                <button className="pt-chip" data-filter="languages">Languages</button>
                <button className="pt-chip" data-filter="ml">ML / AI</button>
                <button className="pt-chip" data-filter="data">Data</button>
                <button className="pt-chip" data-filter="backend">Backend</button>
                <button className="pt-chip" data-filter="infra">Infra</button>
                <button className="pt-chip" data-filter="cv">CV</button>
              </div>
              <div className="ptable-legend">
                <span>PROFICIENCY</span>
                <span className="leg-dots">
                  <span className="leg-dot on" />
                  <span className="leg-dot on" />
                  <span className="leg-dot on" />
                  <span className="leg-dot" />
                  <span className="leg-dot" />
                </span>
                <span>· 41 ELEMENTS · 6 CATEGORIES</span>
              </div>
            </div>

            <div className="pt-rows" id="pt-rows">
              {SKILL_ROWS.map((row) => (
                <div key={row.cat} className="pt-row" data-cat={row.cat}>
                  <div className="pt-row-label reveal">
                    <span className="lbl-num">{row.num}</span>
                    <span className="lbl-name">{row.name}</span>
                  </div>
                  <div className="pt-row-items reveal">
                    {row.items.map((it) => (
                      <div
                        key={it.n}
                        className={`pt-cell ${it.theme}`}
                        data-cat={row.cat}
                        data-n={it.n}
                        data-sym={it.sym}
                        data-name={it.name}
                        data-desc={it.desc}
                        data-projects={it.projects}
                        data-dots={it.dots}
                        data-cat-name={row.name}
                      >
                        <div className="pt-num">
                          <span>{String(it.n).padStart(2, "0")}</span>
                          <ProficiencyDots on={it.dots} />
                        </div>
                        <div className="pt-sym">{it.sym}</div>
                        <div className="pt-name">{it.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-readout" id="pt-readout">
              <div className="pt-ro-symbol">
                <div className="big" id="ro-sym">Py</div>
                <div className="small" id="ro-num">No. 01</div>
              </div>
              <div className="pt-ro-body">
                <div className="ro-name" id="ro-name">Python</div>
                <div className="ro-meta">
                  <span id="ro-cat" className="hl">Languages</span>
                  <span className="sep">·</span>
                  <span id="ro-desc">Primary — research, backend, scripting.</span>
                </div>
              </div>
              <div className="pt-ro-stats">
                <div className="stat">
                  <span>Proficiency</span>
                  <span className="v hl" id="ro-prof">● ● ● ● ●</span>
                </div>
                <div className="stat">
                  <span>Projects</span>
                  <span className="v" id="ro-proj">12</span>
                </div>
                <div className="stat">
                  <span>Since</span>
                  <span className="v">2022</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section id="awards">
          <div className="section-header">
            <span className="section-label">05 / Wins</span>
            <h2 className="section-title">On the record.</h2>
          </div>
          <AchievementsGrid items={achievements} />
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact">
          <div className="section-header">
            <span className="section-label">06 / Signal</span>
            <h2 className="section-title">Say hi.</h2>
          </div>
          <h3 className="contact-title">
            Got something
            <br />
            worth <em>building</em>?<br />
            Let&apos;s talk.
          </h3>
          <div className="contact-links">
            {CONTACT_LINKS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="contact-link"
              >
                <span className="c-label">{c.label}</span>
                <span className="c-handle">{c.handle}</span>
              </a>
            ))}
          </div>
          <ContactForm />
          <footer>
            <div>© 2026 · VANSH B. PATIL · MUMBAI</div>
            <div>
              Built with &nbsp;<span style={{ color: "var(--accent)" }}>▲</span>&nbsp; Next.js · React
            </div>
          </footer>
        </section>
      </main>

      {/* CMD-K */}
      <div className="cmdk-overlay" id="cmdk" role="dialog" aria-modal="true" aria-label="Quick navigation">
        <div className="cmdk">
          <input
            className="cmdk-input"
            id="cmdk-input"
            placeholder="Jump to section, project, or contact…"
            aria-label="Search and jump to a section"
          />
          <div className="cmdk-list" id="cmdk-list" />
          <div className="cmdk-footer">
            <span>
              <span className="kbd">↑↓</span> navigate <span className="kbd">↵</span> select
            </span>
            <span>
              <span className="kbd">ESC</span> close
            </span>
          </div>
        </div>
      </div>

      {/* TWEAKS */}
      <div className="tweaks-panel" id="tweaks">
        <h5>◉ Tweaks</h5>
        <div className="tweak-row">
          <label>Accent</label>
          <div className="options" data-tweak="accent">
            <span className="opt swatch active" data-val="chartreuse" style={{ background: "oklch(0.88 0.18 120)" }} />
            <span className="opt swatch" data-val="amber" style={{ background: "oklch(0.82 0.17 75)" }} />
            <span className="opt swatch" data-val="cyan" style={{ background: "oklch(0.85 0.14 200)" }} />
            <span className="opt swatch" data-val="coral" style={{ background: "oklch(0.78 0.18 25)" }} />
            <span className="opt swatch" data-val="violet" style={{ background: "oklch(0.75 0.18 300)" }} />
          </div>
        </div>
        <div className="tweak-row">
          <label>Display</label>
          <div className="options" data-tweak="displayFont">
            <span className="opt active" data-val="serif">Serif</span>
            <span className="opt" data-val="sans">Sans</span>
          </div>
        </div>
        <div className="tweak-row">
          <label>Projects</label>
          <div className="options" data-tweak="projectStyle">
            <span className="opt" data-val="list">List</span>
            <span className="opt active" data-val="cards">Cards</span>
          </div>
        </div>
        <div className="tweak-row">
          <label>Grain</label>
          <div className="options" data-tweak="showGrain">
            <span className="opt" data-val="true">On</span>
            <span className="opt active" data-val="false">Off</span>
          </div>
        </div>
        <div className="tweak-row">
          <label>Cursor</label>
          <div className="options" data-tweak="showCursor">
            <span className="opt active" data-val="true">Custom</span>
            <span className="opt" data-val="false">Native</span>
          </div>
        </div>
      </div>

      <ClientRuntime />
    </>
  );
}
