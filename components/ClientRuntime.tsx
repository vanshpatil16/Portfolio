"use client";

import { useEffect } from "react";

// All the interactive behaviour from the design's <script>:
// clock, custom cursor, scroll-driven timeline fill, IO reveal, side-rail active state,
// cmd-K palette, achievement flip, skills filter + readout + brand logo hover, tweaks panel.

type Tweaks = {
  accent: string;
  displayFont: "serif" | "sans";
  showGrain: boolean;
  showCursor: boolean;
  projectStyle: "list" | "cards";
};

const DEFAULT_TWEAKS: Tweaks = {
  accent: "chartreuse",
  displayFont: "serif",
  showGrain: false,
  showCursor: true,
  projectStyle: "cards",
};

const COMMANDS = [
  { label: "Go to Hero", section: "hero", kbd: "g h" },
  { label: "Go to About", section: "about", kbd: "g a" },
  { label: "Go to Experience", section: "experience", kbd: "g e" },
  { label: "Go to Projects", section: "projects", kbd: "g p" },
  { label: "Go to Skills", section: "skills", kbd: "g s" },
  { label: "Go to Achievements", section: "awards", kbd: "g w" },
  { label: "Go to Contact", section: "contact", kbd: "g c" },
  { label: "Email Vansh", url: "mailto:patilvansh822@gmail.com", kbd: "✉" },
  { label: "GitHub →", url: "https://github.com/vanshpatil16", kbd: "↗" },
  { label: "LinkedIn →", url: "https://linkedin.com/in/vansh-patil", kbd: "↗" },
  { label: "Download résumé", url: "/resume.pdf", kbd: "⤓" },
  { label: "Toggle Tweaks panel", action: "tweaks", kbd: "⌥T" },
];

// Simple Icons CDN mapping (verified slugs) + inline AWS SVGs.
const ICONS: Record<string, { slug?: string; color?: string; url?: string }> = {
  Py: { slug: "python", color: "3776AB" },
  "C++": { slug: "cplusplus", color: "00599C" },
  C: { slug: "c", color: "5C6BC0" },
  Jv: { slug: "openjdk", color: "ED8B00" },
  SQL: { slug: "postgresql", color: "4169E1" },
  TF: { slug: "tensorflow", color: "FF6F00" },
  Sk: { slug: "scikitlearn", color: "F7931E" },
  Tx: { slug: "huggingface", color: "FFD21E" },
  LC: { slug: "langchain", color: "1C3C3C" },
  Pd: { slug: "pandas", color: "150458" },
  Np: { slug: "numpy", color: "4DABCF" },
  Fa: { slug: "fastapi", color: "009688" },
  Fl: { slug: "flask", color: "FFFFFF" },
  Dk: { slug: "docker", color: "2496ED" },
  S3: {
    url:
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="%23569A31"/><text x="40" y="52" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="28" fill="white">S3</text></svg>',
  },
  EC2: {
    url:
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="%23FF9900"/><text x="40" y="52" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="22" fill="white">EC2</text></svg>',
  },
  Git: { slug: "git", color: "F05032" },
  "↻": { slug: "githubactions", color: "2088FF" },
  N4: { slug: "neo4j", color: "4581C3" },
  Mg: { slug: "mongodb", color: "47A248" },
  Dbx: { slug: "databricks", color: "FF3621" },
  Cv: { slug: "opencv", color: "5C3EE8" },
  Gr: { slug: "gradio", color: "F9A03C" },
  St: { slug: "streamlit", color: "FF4B4B" },
  Mp: { slug: "mediapipe", color: "0097A7" },
};

export function ClientRuntime() {
  useEffect(() => {
    const tweaks: Tweaks = { ...DEFAULT_TWEAKS };

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(hover: none) and (pointer: coarse)").matches ?? false);
    // Touch devices: force native cursor (no custom cursor / no 3D tilt — parallax math is meaningless without mouse coords)
    if (isTouch) {
      document.body.classList.add("no-cursor", "touch-device");
    }

    // ─── #1 · hero title word-split + stagger reveal ────────────────
    if (!reduce) {
      const heroTitle = document.querySelector<HTMLElement>(".hero-title");
      if (heroTitle && !heroTitle.dataset.split) {
        heroTitle.dataset.split = "1";
        let wordIdx = 0;
        const walk = (node: ChildNode): ChildNode[] => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent ?? "";
            const frag = document.createDocumentFragment();
            const parts = text.split(/(\s+)/);
            parts.forEach((part) => {
              if (/^\s+$/.test(part) || part === "") {
                frag.appendChild(document.createTextNode(part));
              } else {
                const span = document.createElement("span");
                span.className = "word";
                span.style.setProperty("--i", String(wordIdx++));
                span.textContent = part;
                frag.appendChild(span);
              }
            });
            return [frag as unknown as ChildNode];
          }
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            // wrap an <em> as a single word, preserving children
            if (el.tagName === "EM") {
              const span = document.createElement("em");
              span.className = "word";
              span.style.setProperty("--i", String(wordIdx++));
              span.innerHTML = el.innerHTML;
              return [span];
            }
            // recurse into other elements (e.g. <br>)
            const replacements: ChildNode[] = [];
            Array.from(el.childNodes).forEach((c) => replacements.push(...walk(c)));
            const wrapper = el.cloneNode(false) as HTMLElement;
            replacements.forEach((r) => wrapper.appendChild(r));
            return [wrapper];
          }
          return [node];
        };
        const replacements: ChildNode[] = [];
        Array.from(heroTitle.childNodes).forEach((c) => replacements.push(...walk(c)));
        heroTitle.replaceChildren(...replacements);
      }
    }

    // ─── #2 · hero meta cells — set --i for stagger ────────────────
    document.querySelectorAll<HTMLElement>(".hero-meta .cell").forEach((cell, i) => {
      cell.style.setProperty("--i", String(i));
    });

    // ─── #3 · section headers — add reveal class; existing IO picks them up
    document.querySelectorAll<HTMLElement>(".section-header").forEach((h) => {
      h.classList.add("reveal");
    });

    // ─── #4 · side-rail sliding indicator (FLIP) ──────────────────
    const rail = document.getElementById("rail");
    let railIndicator: HTMLElement | null = null;
    if (rail) {
      railIndicator = document.createElement("div");
      railIndicator.className = "rail-indicator";
      rail.appendChild(railIndicator);
    }
    function moveRailIndicator() {
      if (!rail || !railIndicator) return;
      const active = rail.querySelector<HTMLElement>("a.active");
      if (!active) return;
      const railRect = rail.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      const y = aRect.top - railRect.top + aRect.height / 2 - 3;
      railIndicator.style.setProperty("--rail-y", y + "px");
      railIndicator.classList.add("ready");
    }
    // observer below in side-rail block calls this; also reposition on resize
    window.addEventListener("resize", moveRailIndicator);

    // ─── #7 · project SVG line-draw on enter ──────────────────────
    document.querySelectorAll<SVGGeometryElement>(".proj-thumb svg [data-draw]").forEach((el) => {
      try {
        const len = (el as unknown as SVGPathElement).getTotalLength?.() ?? 600;
        el.style.setProperty("--draw-len", String(len));
      } catch {
        el.style.setProperty("--draw-len", "600");
      }
    });
    const drawIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("drawn");
            drawIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    document.querySelectorAll(".proj-row").forEach((row) => drawIo.observe(row));

    // ─── #8 · periodic-table cell stagger — set --i once ──────────
    document.querySelectorAll<HTMLElement>(".pt-row").forEach((row) => {
      row.querySelectorAll<HTMLElement>(".pt-cell").forEach((cell, i) => {
        cell.style.setProperty("--i", String(i));
      });
      // mark the row .in when entering viewport, only the first time
      const rowIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              rowIo.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      rowIo.observe(row);
    });

    // ─── #11 · contact <em> breathing — viewport gate ─────────────
    const contactEm = document.querySelector<HTMLElement>(".contact-title em");
    if (contactEm) {
      contactEm.classList.add("breathing");
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => contactEm.classList.toggle("live", e.isIntersecting));
        },
        { threshold: 0.3 },
      );
      cio.observe(contactEm);
    }

    // ─── hero portrait: 3D tilt (mouse) + scroll parallax ──────────
    const tilt = document.querySelector<HTMLElement>(".hero-avatar[data-tilt]");
    const heroSec = document.getElementById("hero");
    let tiltRaf = 0;
    let targetRx = 0;
    let targetRy = 0;
    let curRx = 0;
    let curRy = 0;
    let mxPct = 50;
    let myPct = 50;
    let hovering = false;
    const MAX_TILT = 9; // degrees

    function onHeroMove(e: MouseEvent) {
      if (!heroSec || !tilt) return;
      const rect = heroSec.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;   // 0..1
      // invert axes for natural follow
      targetRx = (x - 0.5) * 2 * MAX_TILT;             // rotateY
      targetRy = -(y - 0.5) * 2 * MAX_TILT;            // rotateX
      // shine origin (relative to the avatar itself)
      const ar = tilt.getBoundingClientRect();
      mxPct = ((e.clientX - ar.left) / ar.width) * 100;
      myPct = ((e.clientY - ar.top) / ar.height) * 100;
      tilt.style.setProperty("--mx", mxPct + "%");
      tilt.style.setProperty("--my", myPct + "%");
      hovering = true;
      tilt.classList.add("tilting");
    }
    function onHeroLeave() {
      hovering = false;
      targetRx = 0;
      targetRy = 0;
      tilt?.classList.remove("tilting");
    }
    function onScrollParallax() {
      if (!tilt) return;
      const y = Math.min(window.scrollY, 600);
      tilt.style.setProperty("--py", -(y * 0.18) + "px");
    }
    function tiltLoop() {
      // ease toward target
      curRx += (targetRx - curRx) * 0.12;
      curRy += (targetRy - curRy) * 0.12;
      if (tilt) {
        tilt.style.setProperty("--rx", curRx.toFixed(2) + "deg");
        tilt.style.setProperty("--ry", curRy.toFixed(2) + "deg");
      }
      tiltRaf = requestAnimationFrame(tiltLoop);
    }
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (tilt && heroSec && !prefersReduce && !isTouch) {
      heroSec.addEventListener("mousemove", onHeroMove);
      heroSec.addEventListener("mouseleave", onHeroLeave);
      window.addEventListener("scroll", onScrollParallax, { passive: true });
      onScrollParallax();
      tiltLoop();
    }

    // ─── tweaks application ─────────────────────────────────────────
    function applyTweaks() {
      document.documentElement.dataset.accent = tweaks.accent;
      document.documentElement.dataset.display = tweaks.displayFont;
      document.documentElement.dataset.projects = tweaks.projectStyle;
      document.body.classList.toggle("no-grain", !tweaks.showGrain);
      document.body.classList.toggle("no-cursor", !tweaks.showCursor);
      document.querySelectorAll<HTMLElement>(".tweaks-panel [data-tweak]").forEach((row) => {
        const key = row.dataset.tweak as keyof Tweaks;
        row.querySelectorAll<HTMLElement>(".opt").forEach((opt) => {
          const val = opt.dataset.val ?? "";
          opt.classList.toggle("active", String(tweaks[key]) === val);
        });
      });
    }
    applyTweaks();

    // ─── timeline fill ──────────────────────────────────────────────
    function updateTimelineFill() {
      const vh = window.innerHeight;
      const expList = document.querySelector<HTMLElement>(".exp-list");
      if (expList) {
        const rect = expList.getBoundingClientRect();
        const start = vh * 0.75;
        const total = rect.height + vh * 0.25;
        const progress = Math.max(0, Math.min(1, (start - rect.top) / total));
        expList.style.setProperty("--tl-fill", progress * 100 + "%");
      }
      document.querySelectorAll<HTMLElement>(".achv-rowset").forEach((rowset) => {
        const rect = rowset.getBoundingClientRect();
        const start = vh * 0.75;
        const total = rect.height + vh * 0.25;
        const progress = Math.max(0, Math.min(1, (start - rect.top) / total));
        rowset.style.setProperty("--tl-fill", progress * 100 + "%");
        // #10 — ignite each .achv-row dot when the fill crosses its horizontal center
        const rsW = rect.width;
        const fillX = (progress * rsW);
        rowset.querySelectorAll<HTMLElement>(".achv-row").forEach((r) => {
          const rr = r.getBoundingClientRect();
          const cx = rr.left - rect.left + rr.width / 2;
          r.classList.toggle("lit", fillX >= cx - 8);
        });
      });
    }
    window.addEventListener("scroll", updateTimelineFill, { passive: true });
    window.addEventListener("resize", updateTimelineFill);
    updateTimelineFill();

    // ─── reveal observer ────────────────────────────────────────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // stagger experience timeline
    const tlIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = parseInt((e.target as HTMLElement).dataset.tlDelay || "0");
            setTimeout(() => e.target.classList.add("in"), delay);
            tlIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    document.querySelectorAll<HTMLElement>(".exp-item").forEach((el, i) => {
      el.dataset.tlDelay = (i * 120).toString();
      tlIo.observe(el);
    });

    // ─── side rail active state + sliding indicator ─────────────────
    const railLinks = document.querySelectorAll<HTMLAnchorElement>(".side-rail a");
    const secIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            railLinks.forEach((l) =>
              l.classList.toggle("active", l.dataset.section === (e.target as HTMLElement).id),
            );
            // FLIP-tween the rail indicator to the active link
            requestAnimationFrame(moveRailIndicator);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    ["hero", "about", "experience", "projects", "skills", "awards", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) secIo.observe(el);
    });

    // ─── clock (IST) ────────────────────────────────────────────────
    function tick() {
      const now = new Date();
      const t = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      const el = document.getElementById("clock");
      if (el) {
        const hh = String(t.getUTCHours()).padStart(2, "0");
        const mm = String(t.getUTCMinutes()).padStart(2, "0");
        const ss = String(t.getUTCSeconds()).padStart(2, "0");
        // #12 — wrap colons in <span class="colon"> so CSS can blink them
        el.innerHTML = `${hh}<span class="colon">:</span>${mm}<span class="colon">:</span>${ss} IST`;
      }
    }
    tick();
    const clockInterval = window.setInterval(tick, 1000);

    // ─── custom cursor ──────────────────────────────────────────────
    const cursor = document.querySelector<HTMLElement>(".cursor");
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
      }
    }
    window.addEventListener("mousemove", onMove);
    let rafId = 0;
    function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      if (cursor) {
        cursor.style.left = cx + "px";
        cursor.style.top = cy + "px";
      }
      rafId = requestAnimationFrame(loop);
    }
    loop();
    function addHoverable() {
      document.querySelectorAll("a, button, .proj-row, .tweak-row .opt").forEach((el) => {
        el.addEventListener("mouseenter", () => cursor?.classList.add("hover"));
        el.addEventListener("mouseleave", () => cursor?.classList.remove("hover"));
      });
    }
    addHoverable();

    // ─── achievement flip ──────────────────────────────────────────
    document.querySelectorAll<HTMLElement>("[data-flip]").forEach((card) => {
      card.addEventListener("click", () => card.classList.toggle("flipped"));
    });

    // ─── cmd-K palette ──────────────────────────────────────────────
    const cmdk = document.getElementById("cmdk");
    const cmdInput = document.getElementById("cmdk-input") as HTMLInputElement | null;
    const cmdList = document.getElementById("cmdk-list") as
      | (HTMLElement & { _filtered?: typeof COMMANDS })
      | null;
    let cmdIdx = 0;

    function renderCmd() {
      if (!cmdInput || !cmdList) return;
      const q = cmdInput.value.toLowerCase();
      const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
      cmdList.innerHTML =
        filtered
          .map(
            (c, i) =>
              `<div class="cmdk-item ${i === cmdIdx ? "active" : ""}" data-i="${i}"><span>${c.label}</span><span class="kbd">${c.kbd}</span></div>`,
          )
          .join("") || '<div class="cmdk-item">No results</div>';
      cmdList._filtered = filtered;
    }
    function openCmd() {
      cmdk?.classList.add("open");
      if (cmdInput) cmdInput.value = "";
      cmdIdx = 0;
      renderCmd();
      setTimeout(() => cmdInput?.focus(), 0);
    }
    function closeCmd() {
      cmdk?.classList.remove("open");
    }
    function runCmd(c: (typeof COMMANDS)[number] | undefined) {
      if (!c) return;
      if ("section" in c && c.section) {
        document.getElementById(c.section)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if ("url" in c && c.url) {
        window.open(c.url, "_blank");
      } else if ("action" in c && c.action === "tweaks") {
        document.getElementById("tweaks")?.classList.toggle("open");
      }
      closeCmd();
    }
    function onCmdInput() {
      cmdIdx = 0;
      renderCmd();
    }
    function onCmdKey(e: KeyboardEvent) {
      const items = cmdList?._filtered ?? [];
      if (e.key === "ArrowDown") {
        e.preventDefault();
        cmdIdx = Math.min(cmdIdx + 1, items.length - 1);
        renderCmd();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        cmdIdx = Math.max(cmdIdx - 1, 0);
        renderCmd();
      } else if (e.key === "Enter") {
        e.preventDefault();
        runCmd(items[cmdIdx]);
      } else if (e.key === "Escape") {
        closeCmd();
      }
    }
    function onListClick(e: MouseEvent) {
      const item = (e.target as HTMLElement).closest<HTMLElement>(".cmdk-item");
      if (!item) return;
      const i = parseInt(item.dataset.i || "0");
      runCmd(cmdList?._filtered?.[i]);
    }
    function onOverlayClick(e: MouseEvent) {
      if (e.target === cmdk) closeCmd();
    }
    function onGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCmd();
      } else if (e.key === "Escape" && cmdk?.classList.contains("open")) {
        closeCmd();
      }
    }
    cmdInput?.addEventListener("input", onCmdInput);
    cmdInput?.addEventListener("keydown", onCmdKey);
    cmdList?.addEventListener("click", onListClick);
    cmdk?.addEventListener("click", onOverlayClick);
    window.addEventListener("keydown", onGlobalKey);

    // ─── skills: brand logo hover ───────────────────────────────────
    document.querySelectorAll<HTMLElement>(".pt-cell").forEach((c) => {
      const sym = c.getAttribute("data-sym") || "";
      const data = ICONS[sym];
      if (!data) return;
      const bg = document.createElement("div");
      bg.className = "pt-brand-bg";
      const img = document.createElement("img");
      img.className = "pt-brand-img";
      img.alt = sym;
      img.src = data.url || `https://cdn.simpleicons.org/${data.slug}/${data.color}`;
      c.appendChild(bg);
      c.appendChild(img);
    });

    // ─── skills: filter + readout + auto-cycle ──────────────────────
    const chips = document.querySelectorAll<HTMLElement>(".pt-chip");
    const cells = document.querySelectorAll<HTMLElement>(".pt-cell");
    const roSym = document.getElementById("ro-sym");
    const roNum = document.getElementById("ro-num");
    const roName = document.getElementById("ro-name");
    const roCat = document.getElementById("ro-cat");
    const roDesc = document.getElementById("ro-desc");
    const roProf = document.getElementById("ro-prof");
    const roProj = document.getElementById("ro-proj");

    function setReadout(cell: HTMLElement) {
      if (!roSym || !roNum || !roName || !roDesc || !roCat || !roProf || !roProj) return;
      const sym = cell.dataset.sym || "?";
      const n = String(cell.dataset.n || "").padStart(2, "0");
      const dots = parseInt(cell.dataset.dots || "3");
      roSym.textContent = sym;
      roNum.textContent = "No. " + n;
      roName.textContent = cell.dataset.name || "";
      roDesc.textContent = cell.dataset.desc || "";
      roCat.textContent = cell.dataset.catName || "";
      roProf.textContent = "● ".repeat(dots) + "○ ".repeat(5 - dots);
      roProj.textContent = cell.dataset.projects || "—";
      cells.forEach((c) => c.classList.remove("featured"));
      cell.classList.add("featured");
      // #9 — tape-advance ticker animation
      [roSym, roName, roDesc].forEach((el) => {
        if (!el) return;
        el.classList.remove("ticker", "advance");
        el.classList.add("ticker", "advance");
        // remove .advance after animation so it can replay
        window.setTimeout(() => el.classList.remove("advance"), 240);
      });
    }
    cells.forEach((c) => c.addEventListener("mouseenter", () => setReadout(c)));

    let autoIdx = 0;
    const autoTimer = window.setInterval(() => {
      const visible = Array.from(cells).filter((c) => !c.classList.contains("dim"));
      if (!visible.length) return;
      autoIdx = (autoIdx + 1) % visible.length;
      setReadout(visible[autoIdx]);
    }, 2200);
    if (cells.length) setReadout(cells[0]);

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const filter = chip.dataset.filter;
        cells.forEach((c) => {
          if (filter === "all" || c.dataset.cat === filter) {
            c.classList.remove("dim");
          } else {
            c.classList.add("dim");
            c.classList.remove("featured");
          }
        });
        const visible = Array.from(cells).filter((c) => !c.classList.contains("dim"));
        if (visible.length) setReadout(visible[0]);
      });
    });

    // ─── tweaks panel ───────────────────────────────────────────────
    document.querySelectorAll<HTMLElement>(".tweaks-panel [data-tweak]").forEach((row) => {
      row.addEventListener("click", (e) => {
        const opt = (e.target as HTMLElement).closest<HTMLElement>(".opt");
        if (!opt) return;
        const key = row.dataset.tweak as keyof Tweaks;
        const raw = opt.dataset.val ?? "";
        let val: string | boolean = raw;
        if (raw === "true") val = true;
        else if (raw === "false") val = false;
        // @ts-expect-error narrow runtime write
        tweaks[key] = val;
        applyTweaks();
      });
    });

    return () => {
      window.removeEventListener("scroll", updateTimelineFill);
      window.removeEventListener("resize", updateTimelineFill);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onGlobalKey);
      window.removeEventListener("scroll", onScrollParallax);
      window.removeEventListener("resize", moveRailIndicator);
      heroSec?.removeEventListener("mousemove", onHeroMove);
      heroSec?.removeEventListener("mouseleave", onHeroLeave);
      drawIo.disconnect();
      window.clearInterval(clockInterval);
      window.clearInterval(autoTimer);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(tiltRaf);
      io.disconnect();
      tlIo.disconnect();
      secIo.disconnect();
    };
  }, []);

  return null;
}
