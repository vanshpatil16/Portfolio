"use client";

import { useState, useCallback, useEffect } from "react";
import { SKILL_ROWS } from "@/lib/content";
import { SkillGraph } from "./SkillGraph";
import { OrbitalOverlay, type OrbSkill } from "./OrbitalOverlay";

function ProficiencyDots({ on }: { on: number }) {
  return (
    <span className="pt-dots">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={"pt-dot" + (i < on ? " on" : "")} />
      ))}
    </span>
  );
}

export function SkillsSection() {
  const [view, setView] = useState<"table" | "graph">("table");
  const [orbSkill, setOrbSkill] = useState<OrbSkill | null>(null);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  const openOrbital = useCallback(
    (skill: OrbSkill) => {
      setActiveCell(skill.n);
      setOrbSkill(skill);
    },
    []
  );

  const closeOrbital = useCallback(() => {
    setOrbSkill(null);
    setActiveCell(null);
  }, []);

  useEffect(() => {
    // inline SVG badge for techs with no simpleicons entry
    const badge = (label: string, bg: string, fg = 'ffffff', fs = 24) =>
      `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="%23${bg}"/><text x="40" y="52" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="${fs}" fill="%23${fg}">${encodeURIComponent(label)}</text></svg>`;

    const ICONS: Record<string, { slug?: string; color?: string; url?: string }> = {
      // ── Languages ──────────────────────────────────────────────────────────
      'Py':  { slug: 'python',         color: '3776AB' },
      'C++': { slug: 'cplusplus',      color: '00599C' },
      'C':   { slug: 'c',             color: '5C6BC0' },
      'Jv':  { slug: 'openjdk',       color: 'ED8B00' },
      'SQL': { slug: 'postgresql',    color: '4169E1' },
      // ── ML / AI ────────────────────────────────────────────────────────────
      'TF':  { slug: 'tensorflow',    color: 'FF6F00' },
      'Sk':  { slug: 'scikit-learn',  color: 'F7931E' },  // hyphen required
      'Tx':  { slug: 'huggingface',   color: 'FFD21E' },
      '◉':  { url: badge('ATT', '8B5CF6') },              // Attention (n=9)
      'LC':  { slug: 'langchain',     color: '1C3C3C' },
      '▣':  { url: badge('LGr', '00A95C') },              // LangGraph
      '◈':  { url: badge('LSm', '00A95C') },              // LangSmith
      'RAG': { url: badge('RAG', '6366F1') },
      '◆':  { url: badge('KG',  '0EA5E9', 'ffffff', 28) }, // Knowledge Graph
      // ── Data ───────────────────────────────────────────────────────────────
      'Pd':  { slug: 'pandas',        color: '150458' },
      'Np':  { slug: 'numpy',         color: '4DABCF' },
      '⌲':  { slug: 'matplotlib',    color: '013243' },
      'Sb':  { url: badge('Sb',  '4C72B0') },             // Seaborn
      '∿':  { url: badge('TSr', 'F97316') },              // Time Series
      'ƒx':  { url: badge('FEn', '10B981') },             // Feature Engineering
      // ── Backend ────────────────────────────────────────────────────────────
      'Fa':  { slug: 'fastapi',       color: '009688' },
      'Fl':  { slug: 'flask',         color: 'FFFFFF' },
      '{ }': { slug: 'openapi',       color: '6BA539' },
      '</>': { slug: 'html5',         color: 'E34C26' },
      // ── Infra ──────────────────────────────────────────────────────────────
      'Dk':  { slug: 'docker',        color: '2496ED' },
      'S3':  { url: badge('S3',  '569A31', 'ffffff', 28) },
      'EC2': { url: badge('EC2', 'FF9900', 'ffffff', 22) },
      'Git': { slug: 'git',           color: 'F05032' },
      '↻':  { slug: 'githubactions',  color: '2088FF' },
      'N4':  { slug: 'neo4j',         color: '4581C3' },
      'Mg':  { slug: 'mongodb',       color: '47A248' },
      '◉2': { slug: 'pinecone',       color: '1B4C3D' },  // Pinecone (n=32) — keyed by data-n fallback
      'Dbx': { slug: 'databricks',    color: 'FF3621' },
      // ── CV / Multimodal ────────────────────────────────────────────────────
      'Cv':  { slug: 'opencv',        color: '5C3EE8' },
      'Yo':  { url: badge('YOLO', '001F3F', 'ffffff', 18) },
      'Mp':  { slug: 'mediapipe',     color: '0097A7' },
      'TFL': { slug: 'tensorflow',    color: 'FF6F00' },   // TFLite reuses TF icon
      'Dl':  { url: badge('Dl',  '0F62FE') },             // Docling (IBM)
      'Ln':  { url: badge('LDB', '6B21A8') },             // LanceDB
      'Gr':  { slug: 'gradio',        color: 'FD5638' },
      'St':  { slug: 'streamlit',     color: 'FF4B4B' },
    };

    const cells = document.querySelectorAll<HTMLElement>('.pt-cell[data-sym]');
    const cleanups: (() => void)[] = [];

    cells.forEach((cell) => {
      const sym = cell.getAttribute('data-sym') ?? '';
      const n = cell.getAttribute('data-n') ?? '';
      // Pinecone and Attention share the ◉ sym — disambiguate by element number
      const data = ICONS[sym === '◉' && n === '32' ? '◉2' : sym];
      if (!data) return;

      const symEl = cell.querySelector<HTMLElement>('.pt-sym');
      if (!symEl) return;

      const bg = document.createElement('div');
      bg.className = 'pt-brand-bg';
      Object.assign(bg.style, {
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -40%)', opacity: '0',
        transition: 'opacity .25s', pointerEvents: 'none',
      });

      const img = document.createElement('img');
      img.className = 'pt-brand-img';
      img.src = data.url ?? `https://cdn.simpleicons.org/${data.slug}/${data.color}`;
      img.alt = sym;
      Object.assign(img.style, {
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -40%)', opacity: '0',
        transition: 'opacity .25s ease .05s', pointerEvents: 'none',
      });

      cell.appendChild(bg);
      cell.appendChild(img);

      const enter = () => { symEl.style.opacity = '0'; bg.style.opacity = '0.95'; img.style.opacity = '1'; };
      const leave = () => { symEl.style.opacity = '1'; bg.style.opacity = '0'; img.style.opacity = '0'; };

      cell.addEventListener('mouseenter', enter);
      cell.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        cell.removeEventListener('mouseenter', enter);
        cell.removeEventListener('mouseleave', leave);
        bg.remove(); img.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [view]);

  return (
    <div className="ptable reveal">
      <div className="ptable-toolbar">
        {view === "table" ? (
          <div className="ptable-filters">
            <button className="pt-chip active" data-filter="all">All</button>
            <button className="pt-chip" data-filter="languages">Languages</button>
            <button className="pt-chip" data-filter="ml">ML / AI</button>
            <button className="pt-chip" data-filter="data">Data</button>
            <button className="pt-chip" data-filter="backend">Backend</button>
            <button className="pt-chip" data-filter="infra">Infra</button>
            <button className="pt-chip" data-filter="cv">CV</button>
          </div>
        ) : (
          <p className="sg-toolbar-hint">
            // skill → project dependency graph · hover to trace
          </p>
        )}
        <div className="ptable-view-toggle">
          <button
            className={`pt-chip${view === "table" ? " active" : ""}`}
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
          >
            Periodic
          </button>
          <button
            className={`pt-chip${view === "graph" ? " active" : ""}`}
            onClick={() => setView("graph")}
            aria-pressed={view === "graph"}
          >
            Graph
          </button>
        </div>
      </div>

      {view === "table" ? (
        <>
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
                      className={`pt-cell ${it.theme}${activeCell === it.n ? " active" : ""}`}
                      data-cat={row.cat}
                      data-n={it.n}
                      data-sym={it.sym}
                      onClick={() =>
                        openOrbital({
                          sym: it.sym,
                          name: it.name,
                          desc: it.desc,
                          dots: it.dots,
                          n: it.n,
                          catName: row.name,
                        })
                      }
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
        </>
      ) : (
        <SkillGraph />
      )}

      {view === "table" && (
        <p className={`ptable-click-hint${orbSkill ? " hidden" : ""}`}>
          // click any element to trace its orbital project connections →
        </p>
      )}

      <OrbitalOverlay skill={orbSkill} onClose={closeOrbital} />
    </div>
  );
}
