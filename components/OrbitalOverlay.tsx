"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

export type OrbSkill = {
  sym: string;
  name: string;
  desc: string;
  dots: number;
  n: number;
  catName: string;
};

const ORB_PROJECTS = [
  {
    num: "/001",
    title: "SignSync",
    stack: ["MediaPipe", "TFLite", "FastAPI"],
    desc: "Real-time bi-directional Sign↔Speech platform with sub-200ms inference. MediaPipe landmarks, TFLite models, SiGML 3D avatars and live Jitsi translation overlays.",
  },
  {
    num: "/002",
    title: "AI Studio",
    stack: ["Neo4j", "Pinecone", "spaCy", "Docker"],
    desc: "Knowledge-graph-driven narrative platform extracting entities across 10k+ docs. RAG + LLM validation detecting story inconsistencies at 92% precision.",
  },
  {
    num: "/003",
    title: "Market Intel",
    stack: ["Python", "Streamlit", "Finnhub"],
    desc: "Financial analytics for time-series forecasting and peer benchmarking. NLP sentiment pipeline over 500+ daily articles; 60% lower load via caching.",
  },
  {
    num: "/004",
    title: "CitationEdge",
    stack: ["Docling", "Neo4j", "LanceDB"],
    desc: "Automated claim extraction from scientific papers via multimodal parsing (Docling + vision) and hybrid Neo4j / LanceDB semantic search.",
  },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const isConn = (skill: OrbSkill, proj: (typeof ORB_PROJECTS)[0]) =>
  proj.stack.some(
    (t) =>
      norm(t) === norm(skill.name) ||
      norm(skill.name).startsWith(norm(t).slice(0, 5)) ||
      norm(t).startsWith(norm(skill.name).slice(0, 5))
  );

type Props = {
  skill: OrbSkill | null;
  onClose: () => void;
};

export function OrbitalOverlay({ skill, onClose }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    angle: 0,
    auto: true,
    raf: 0,
    active: null as number | null,
    spotLast: null as number | null,
  });

  const showDetail = useCallback(
    (idx: number) => {
      if (!skill || !detailRef.current) return;
      const proj = ORB_PROJECTS[idx];
      const conn = isConn(skill, proj);
      const tags = proj.stack
        .map((t) => {
          const hl =
            norm(t).includes(norm(skill.name).slice(0, 4)) ||
            norm(skill.name).includes(norm(t).slice(0, 4));
          return `<span class="orbital-proj-tag${hl ? " hl" : ""}">${t}</span>`;
        })
        .join("");
      detailRef.current.innerHTML = `
        <div class="orbital-detail-label">// spotlight</div>
        <div class="orbital-proj-card${conn ? "" : " dim-card"}">
          <div class="orbital-proj-header">
            <span class="orbital-proj-num">${proj.num}</span>
            <span class="orbital-proj-title">${proj.title}</span>
          </div>
          ${conn ? `<div class="orbital-proj-conn">↳ uses ${skill.sym} · ${skill.name}</div>` : ""}
          <p class="orbital-proj-desc" style="margin-top:10px">${proj.desc}</p>
          <div class="orbital-proj-stack">${tags}</div>
        </div>`;
    },
    [skill]
  );

  const resetDetail = useCallback(() => {
    if (!detailRef.current) return;
    detailRef.current.innerHTML = `
      <div class="orbital-detail-label">// spotlight</div>
      <span class="orbital-detail-hint">Orbit past the bracket or click a node to pull it into focus.<br>
        <span style="opacity:0.45;font-size:10px">ESC · deselect node &nbsp;·&nbsp; ESC again · close</span>
      </span>`;
  }, []);

  const draw = useCallback(() => {
    const s = stateRef.current;
    const nodes = nodesRef.current?.querySelectorAll<HTMLElement>(".orb-node");
    const svg = svgRef.current;
    if (!nodes || !svg) return;
    const ns = "http://www.w3.org/2000/svg";
    const R = 210;
    const CX = 280;
    const CY = 280;

    svg.querySelectorAll(".orb-line").forEach((l) => l.remove());

    let closestIdx: number | null = null;
    let closestDist = 19;

    nodes.forEach((node, i) => {
      const base = (i / nodes.length) * 360;
      const deg = ((base + s.angle) % 360 + 360) % 360;
      const rad = (deg * Math.PI) / 180;
      const x = R * Math.cos(rad);
      const y = R * Math.sin(rad);
      const z = Math.cos(rad);
      const active = s.active === i;
      const conn = node.classList.contains("connected");

      const dist = Math.min(deg, 360 - deg);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }

      const scale = active ? 1.12 : 0.82 + 0.18 * ((1 + z) / 2);
      const opacity = active
        ? 1
        : conn
          ? Math.max(0.55, 0.55 + 0.45 * ((1 + z) / 2))
          : Math.max(0.32, 0.32 + 0.28 * ((1 + z) / 2));

      node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      node.style.opacity = String(opacity);
      node.style.zIndex = active ? "200" : String(Math.round(100 + 50 * z));

      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", String(CX));
      line.setAttribute("y1", String(CY));
      line.setAttribute("x2", String(CX + x));
      line.setAttribute("y2", String(CY + y));
      line.setAttribute("class", "orb-line");
      if (conn) {
        line.setAttribute("stroke", "var(--accent)");
        line.setAttribute("stroke-width", active ? "1.6" : "0.8");
        line.setAttribute("opacity", active ? "0.62" : "0.2");
      } else {
        line.setAttribute("stroke", "#5a5a55");
        line.setAttribute("stroke-width", "0.5");
        line.setAttribute("opacity", "0.22");
        line.setAttribute("stroke-dasharray", "2 9");
      }
      svg.appendChild(line);
    });

    if (s.auto && closestIdx !== null && closestIdx !== s.spotLast) {
      s.spotLast = closestIdx;
      s.active = closestIdx;
      nodes.forEach((n, i) => n.classList.toggle("expanded", i === closestIdx));
      showDetail(closestIdx);
    }
  }, [showDetail]);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (s.auto) s.angle = (s.angle + 0.14) % 360;
    draw();
    s.raf = requestAnimationFrame(loop);
  }, [draw]);

  const clickNode = useCallback(
    (idx: number) => {
      const s = stateRef.current;
      const nodes = nodesRef.current?.querySelectorAll<HTMLElement>(".orb-node");
      if (s.active === idx && !s.auto) {
        s.active = null;
        s.spotLast = null;
        s.auto = true;
        nodes?.forEach((n) => n.classList.remove("expanded"));
        resetDetail();
        return;
      }
      s.auto = false;
      cancelAnimationFrame(s.raf);

      const N = ORB_PROJECTS.length;
      const base = (idx / N) * 360;
      const target = ((-base) % 360 + 360) % 360;
      const current = ((s.angle % 360) + 360) % 360;
      let diff = target - current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const startAngle = s.angle;
      const duration = 680;
      const t0 = performance.now();

      function step(now: number) {
        const t = Math.min(1, (now - t0) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        s.angle = startAngle + diff * ease;
        draw();
        if (t < 1) {
          s.raf = requestAnimationFrame(step);
        } else {
          s.angle = startAngle + diff;
          s.active = idx;
          s.spotLast = idx;
          nodes?.forEach((n, i) => n.classList.toggle("expanded", i === idx));
          showDetail(idx);
          s.raf = requestAnimationFrame(loop);
        }
      }
      s.raf = requestAnimationFrame(step);
    },
    [draw, loop, showDetail, resetDetail]
  );

  useEffect(() => {
    if (!skill) return;
    const s = stateRef.current;
    s.angle = 0;
    s.auto = true;
    s.active = null;
    s.spotLast = null;
    resetDetail();
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.raf);
  }, [skill, loop, resetDetail]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!skill) return;
      const s = stateRef.current;
      if (s.active !== null && !s.auto) {
        clickNode(s.active);
      } else {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [skill, clickNode, onClose]);

  useEffect(() => {
    document.body.style.overflow = skill ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [skill]);

  if (!skill || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`orbital-overlay${skill ? " visible" : ""}`}
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="orbital-topbar">
        <div className="orbital-cat-badge">
          {skill.catName} · {String(skill.n).padStart(2, "0")}
        </div>
        <div className="orbital-skill-desc">{skill.desc}</div>
        <button className="orbital-close" onClick={onClose} aria-label="Close overlay">
          ESC · CLOSE ✕
        </button>
      </div>

      <div className="orbital-body">
        <div className="orbital-stage">
          <svg
            ref={svgRef}
            className="orbital-svg"
            viewBox="0 0 560 560"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="498"
              y="286"
              fontFamily="var(--mono)"
              fontSize="18"
              fill="var(--accent)"
              opacity="0.55"
            >
              ]
            </text>
            <circle cx="494" cy="282" r="2.5" fill="var(--accent)" opacity="0.7" />
          </svg>

          <div className="orbital-center-above">{skill.name}</div>
          <div
            className="orbital-center"
            onClick={() => {
              const s = stateRef.current;
              if (s.active !== null) clickNode(s.active);
              else onClose();
            }}
          >
            <div className="orbital-center-ping" />
            <div className="orbital-center-ping2" />
            <div className="orbital-center-sym">{skill.sym}</div>
            <div className="orbital-center-name">{skill.name}</div>
          </div>

          <div ref={nodesRef} style={{ position: "absolute", inset: 0 }}>
            {ORB_PROJECTS.map((p, i) => {
              const conn = isConn(skill, p);
              return (
                <div
                  key={p.num}
                  className={`orb-node ${conn ? "connected" : "unconnected"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    clickNode(i);
                  }}
                >
                  <div className="orb-node-inner">
                    <span className="orb-node-num">{p.num}</span>
                    <span className="orb-node-title">{p.title}</span>
                    <span className="orb-node-hint">
                      {conn ? "↳ uses this skill" : "↳ indirect"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div ref={detailRef} className="orbital-detail">
          <div className="orbital-detail-label">// spotlight</div>
          <span className="orbital-detail-hint">
            Orbit past the bracket or click a node to pull it into focus.
            <br />
            <span style={{ opacity: 0.45, fontSize: "10px" }}>
              ESC · deselect node &nbsp;·&nbsp; ESC again · close
            </span>
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
