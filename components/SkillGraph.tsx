"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SKILL_ROWS, PROJECTS } from "@/lib/content";

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 960;
const H = 580;

const SKILL_W = 72;
const SKILL_H = 82;
const PROJ_W = 150;
const PROJ_H = 46;

const REPULSION = 3200;
const SPRING_K = 0.055;
const SPRING_REST = 210;
const DAMPING = 0.78;
const CENTER_K = 0.012;
const ITERS = 280;

// Category initial cluster centers
const CAT_CENTERS: Record<string, [number, number]> = {
  languages: [160, 130],
  ml:        [440, 100],
  data:      [740, 140],
  backend:   [140, 460],
  infra:     [450, 500],
  cv:        [760, 440],
};

// ─── Edge builder ─────────────────────────────────────────────────────────────
function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const ALL_SKILL_IDS = SKILL_ROWS.flatMap((r) =>
  r.items.map((it) => ({ id: `sk-${it.n}`, name: it.name })),
);
const SKILL_NORM_MAP = new Map(ALL_SKILL_IDS.map((s) => [norm(s.name), s.id]));

function buildEdges() {
  const edges: { source: string; target: string }[] = [];
  PROJECTS.forEach((proj) => {
    proj.stack.forEach((stackItem) => {
      const skillId = SKILL_NORM_MAP.get(norm(stackItem));
      if (skillId) edges.push({ source: skillId, target: `proj-${proj.num}` });
    });
  });
  return edges;
}

// ─── Force simulation ─────────────────────────────────────────────────────────
type SimNode = { id: string; x: number; y: number; vx: number; vy: number };

function runSim(nodes: SimNode[], edges: { source: string; target: string }[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (let iter = 0; iter < ITERS; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d2 = dx * dx + dy * dy + 1;
        const d = Math.sqrt(d2);
        const f = REPULSION / d2;
        const fx = (f * dx) / d;
        const fy = (f * dy) / d;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }
    for (const e of edges) {
      const a = byId.get(e.source);
      const b = byId.get(e.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const f = SPRING_K * (d - SPRING_REST);
      const fx = (f * dx) / d;
      const fy = (f * dy) / d;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }
    for (const n of nodes) {
      n.vx += (W / 2 - n.x) * CENTER_K;
      n.vy += (H / 2 - n.y) * CENTER_K;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x = Math.max(SKILL_W / 2 + 8, Math.min(W - SKILL_W / 2 - 8, n.x + n.vx));
      n.y = Math.max(SKILL_H / 2 + 8, Math.min(H - SKILL_H / 2 - 8, n.y + n.vy));
    }
  }
  return nodes;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SkillGraph() {
  const [positions, setPositions] = useState<Map<string, [number, number]>>(new Map());
  const [hovered, setHovered] = useState<string | null>(null);
  const edgesRef = useRef(buildEdges());

  useEffect(() => {
    const edges = edgesRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nodes: SimNode[] = [];
    SKILL_ROWS.forEach((row) => {
      const [cx, cy] = CAT_CENTERS[row.cat] ?? [W / 2, H / 2];
      row.items.forEach((it, i) => {
        const angle = (i / Math.max(row.items.length, 1)) * Math.PI * 2;
        const r = 80 + (reduce ? 0 : Math.random() * 40);
        nodes.push({ id: `sk-${it.n}`, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, vx: 0, vy: 0 });
      });
    });
    PROJECTS.forEach((proj, i) => {
      const angle = (i / PROJECTS.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({ id: `proj-${proj.num}`, x: W / 2 + Math.cos(angle) * 220, y: H / 2 + Math.sin(angle) * 175, vx: 0, vy: 0 });
    });

    const final = reduce ? nodes : runSim(nodes, edges);
    setPositions(new Map(final.map((n) => [n.id, [n.x, n.y]])));
  }, []);

  const edges = edgesRef.current;

  const connected = useCallback(
    (id: string): Set<string> => {
      const s = new Set<string>();
      edges.forEach((e) => {
        if (e.source === id || e.target === id) {
          s.add(e.source);
          s.add(e.target);
        }
      });
      return s;
    },
    [edges],
  );

  const connectedSet = hovered ? connected(hovered) : null;

  if (positions.size === 0) {
    return (
      <div className="sg-loading">
        <span className="sg-loading-text">// computing force layout…</span>
      </div>
    );
  }

  return (
    <div className="sg-wrap" role="region" aria-label="Skill–project relationship graph">
      <svg viewBox={`0 0 ${W} ${H}`} className="sg-svg" aria-hidden="true">
        {/* Edges */}
        <g>
          {edges.map((e, i) => {
            const [ax, ay] = positions.get(e.source) ?? [0, 0];
            const [bx, by] = positions.get(e.target) ?? [0, 0];
            const isLit = connectedSet?.has(e.source) && connectedSet?.has(e.target);
            const isDim = hovered !== null && !isLit;
            return (
              <line
                key={i}
                x1={ax} y1={ay}
                x2={bx} y2={by}
                className={`sg-edge${isLit ? " lit" : ""}${isDim ? " dim" : ""}`}
              />
            );
          })}
        </g>

        {/* Project nodes */}
        {PROJECTS.map((proj) => {
          const [cx, cy] = positions.get(`proj-${proj.num}`) ?? [0, 0];
          const id = `proj-${proj.num}`;
          const isHov = hovered === id;
          const isConn = connectedSet?.has(id) ?? false;
          const isDim = hovered !== null && !isHov && !isConn;
          return (
            <g
              key={proj.num}
              className={`sg-proj-node${isHov ? " hov" : ""}${isDim ? " dim" : ""}`}
              transform={`translate(${cx - PROJ_W / 2},${cy - PROJ_H / 2})`}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
              <rect width={PROJ_W} height={PROJ_H} className="sg-proj-bg" />
              <rect x={0} y={0} width={3} height={PROJ_H} className="sg-proj-bar" />
              <text x={12} y={17} className="sg-proj-num">{proj.num}</text>
              <text x={12} y={34} className="sg-proj-title">{proj.title}</text>
            </g>
          );
        })}

        {/* Skill nodes */}
        {SKILL_ROWS.flatMap((row) =>
          row.items.map((it) => {
            const [cx, cy] = positions.get(`sk-${it.n}`) ?? [0, 0];
            const id = `sk-${it.n}`;
            const isHov = hovered === id;
            const isConn = connectedSet?.has(id) ?? false;
            const isDim = hovered !== null && !isHov && !isConn;
            return (
              <g
                key={it.n}
                className={`sg-skill-node ${it.theme}${isHov ? " hov" : ""}${isDim ? " dim" : ""}`}
                transform={`translate(${cx - SKILL_W / 2},${cy - SKILL_H / 2})`}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              >
                <rect width={SKILL_W} height={SKILL_H} className="sg-skill-bg" />
                <text x={6} y={14} className="sg-skill-num">{String(it.n).padStart(2, "0")}</text>
                <text x={SKILL_W / 2} y={50} textAnchor="middle" className="sg-skill-sym">{it.sym}</text>
                <text x={SKILL_W / 2} y={66} textAnchor="middle" className="sg-skill-name">{it.name}</text>
                {Array.from({ length: 5 }).map((_, i) => (
                  <circle key={i} cx={SKILL_W / 2 - 20 + i * 10} cy={78} r={2.5} className={`sg-dot${i < it.dots ? " on" : ""}`} />
                ))}
              </g>
            );
          }),
        )}
      </svg>

      {/* Readout strip */}
      <div className="sg-readout" aria-live="polite">
        {hovered ? (
          hovered.startsWith("sk-") ? (() => {
            const n = parseInt(hovered.slice(3));
            const skill = SKILL_ROWS.flatMap((r) => r.items).find((it) => it.n === n);
            const rowName = SKILL_ROWS.find((r) => r.items.some((it) => it.n === n))?.name;
            const projCount = edges.filter((e) => e.source === hovered).length;
            if (!skill) return null;
            return (
              <>
                <span className="sg-ro-sym">{skill.sym}</span>
                <span className="sg-ro-name">{skill.name}</span>
                <span className="sg-ro-cat">{rowName}</span>
                <span className="sg-ro-sep">·</span>
                <span className="sg-ro-meta">{projCount > 0 ? `${projCount} project${projCount !== 1 ? "s" : ""}` : "no project edges"}</span>
              </>
            );
          })() : (() => {
            const proj = PROJECTS.find((p) => `proj-${p.num}` === hovered);
            if (!proj) return null;
            const skillCount = edges.filter((e) => e.target === hovered).length;
            return (
              <>
                <span className="sg-ro-sym">{proj.num}</span>
                <span className="sg-ro-name">{proj.title}</span>
                <span className="sg-ro-sep">·</span>
                <span className="sg-ro-meta">{skillCount} skill{skillCount !== 1 ? "s" : ""} applied</span>
              </>
            );
          })()
        ) : (
          <span className="sg-ro-hint">// hover a node to trace its connections</span>
        )}
      </div>
    </div>
  );
}
