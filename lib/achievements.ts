// ─────────────────────────────────────────────────────────────
// Achievements registry.
// Edit this file when adding a new win — see public/achievements/README.md.
// `photo` is just a filename inside /public/achievements/.
// `summary` accepts plain text (newlines preserved) — paste the LinkedIn caption.
// ─────────────────────────────────────────────────────────────

export type Achievement = {
  /** Stable slug — used for keys and lightbox URL hash. */
  id: string;
  tier: "winner" | "silver" | "bronze";
  tierLabel: string;
  name: string;
  /** Display position (e.g. "/01"). */
  num: string;
  /** Host / college / club. */
  org: string;
  /** Year or month-year. */
  date: string;
  /** City or "Remote" / "Online". */
  location?: string;
  /**
   * File-prefix used for auto-discovery of images in /public/achievements/.
   * Any file named `<photoSlug>-<n>.<ext>` (jpg/png/webp/…) is picked up.
   * Falls back to `id` if not set.
   */
  photoSlug?: string;
  /** Manual override — sets the primary photo explicitly (skips auto-discovery). */
  photo?: string;
  /** Manual override — sets the gallery explicitly (skips auto-discovery). */
  gallery?: string[];
  /** Long-form summary (LinkedIn caption). Newlines render as paragraph breaks. */
  summary?: string;
  /** Short chips shown on the back/lightbox. */
  tags?: string[];
  /** Optional team / mentor credits. */
  team?: string[];
  /** Optional outbound link (LinkedIn post, devpost, etc.). */
  href?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "datahack-4-xai",
    tier: "winner",
    tierLabel: "★ Domain Winner",
    name: "Domain Winner — XAI, Datahack 4.0",
    num: "/01",
    org: "DJSCE-S4DS",
    date: "2024",
    location: "Mumbai",
    photoSlug: "datahack-xai-2024",
    summary: `The beginning where everything started — first year, first hackathon, first reality check.

After rejection at DataHack 3.0 and a 17th-rank finish at Xtract 3.0, this was the turn: 4th at Xtract 4.0, then a Domain Win at DataHack 4.0's Explainable-AI track.

Built ClearPath — a course recommendation engine that doesn't just rank, it explains. We modeled engagement, learning velocity, difficulty matching, and knowledge gaps, then surfaced glass-box recommendations with what-if analysis and dropout-risk prediction. Final blend: 60% personal signal, 40% peer-informed paths.

Lesson: your resume speaks before you do. If it isn't sharp, opportunities never reach you.`,
    tags: ["XAI", "EdTech", "DataHack"],
    team: ["Meet Dawda", "Manas Shah", "Yash Poojari"],
    href: "https://www.linkedin.com/posts/vansh-patil_datahack-xai-explainableai-ugcPost-7449895991916294144-Wy42",
  },
  {
    id: "devhacks-csi-ace",
    tier: "winner",
    tierLabel: "★ Winner — 1st Place",
    name: "DevHacks 2026 — Nolan AI Studio",
    num: "/02",
    org: "CSI-ACE, Atharva",
    date: "2026",
    location: "Mumbai",
    photoSlug: "devhacks-2026",
    summary: `From repeated hackathon losses to first place at DevHacks 2026 — every setback was a chance to debug the thinking and rebuild the architecture.

Built Nolan AI Studio — an AI code editor for writers backed by a knowledge-graph architecture instead of plain text generation. Neo4j stores persistent story state (characters, relationships, scenes, conflicts); LLMs act as a query and reasoning layer on top. The result: relevant context retrieval, lower latency, horizontal scalability, and explainable scene-level intelligence.

Under the hood: structured narrative extraction, character-arc + emotional-curve tracking, continuity validation, mathematical writer-style fingerprinting, and knowledge-graph-aware scene generation.`,
    tags: ["Neo4j", "Knowledge Graph", "AI", "1st Place"],
    team: ["Vansh Patil", "Atharva Mehta", "Omkar Kudalkar", "Riya Jain"],
    href: "https://www.linkedin.com/posts/vansh-patil_devhacks2026-hackathonwin-neo4j-ugcPost-7433926803326423040-tQ43",
  },
  {
    id: "hackxcelerate-vjti",
    tier: "winner",
    tierLabel: "★ Winner — 1st Place",
    name: "HackXcelerate 2.0 — Smart Waste Monitoring",
    num: "/03",
    org: "GDSC · VJTI",
    date: "2024",
    location: "VJTI, Mumbai",
    photoSlug: "hackxcelerate-2024",
    summary: `1st place at HackXcelerate 2.0 — Google Developer Student Clubs, VJTI.

The problem: fixed waste-collection schedules cause overflowing bins, hygiene risks, fuel waste, and zero accountability on campuses.

Our solution: AI-powered smart waste monitoring & analytics. QR-based bin registration creates a digital twin per bin. YOLO computer-vision detects bins and estimates fill percentage. Historical data drives predictive overflow alerts. The system auto-dispatches the nearest collector with optimized routing, verifies cleaning via timestamped image evidence, and pushes real-time SMS alerts via Twilio.

Key innovation: no expensive IoT sensors — just AI, vision, and optimization.`,
    tags: ["YOLO", "Computer Vision", "Sustainability", "1st Place"],
    team: ["Vansh Patil", "Omkar Kudalkar", "Akshay Kokate", "Bhvya Ashar"],
    href: "https://www.linkedin.com/posts/vansh-patil_hackxcelerate-vjti-googledevelopersclub-ugcPost-7433180261476954112-mSrb",
  },
  {
    id: "ace-2-nmims",
    tier: "winner",
    tierLabel: "★ Winner — 1st Place",
    name: "ACE 2.0 — Unified Healthcare Platform",
    num: "/04",
    org: "MPSTME · NMIMS",
    date: "2025",
    location: "Mumbai",
    photoSlug: "ace-2-2025",
    summary: `1st place at ACE 2.0 — a 24-hour national hackathon hosted by NMIMS Mukesh Patel School of Technology Management and Engineering.

Built a unified healthcare platform connecting doctors, patients, families, and caregivers in one piece of software — so context doesn't get lost between visits and the people around a patient stay in the loop.

As ML developer: shipped a RAG-based chatbot that answers context-aware questions over patient reports, a data-extraction pipeline that structures messy health information, and a predictive model on patient vitals hitting 99.12% accuracy.`,
    tags: ["HealthTech", "RAG", "ML", "1st Place"],
    team: ["Vansh Patil", "Omkar Kudalkar", "Jivanshu Mishra", "Sakshi Gandhi"],
    href: "https://www.linkedin.com/posts/vansh-patil_hackathonwinner-ace2-nmimsmumbai-ugcPost-7375600764594970624-bRny",
  },
  {
    id: "spectrum-5-fintech",
    tier: "silver",
    tierLabel: "▪ 2nd Runner-Up — Fintech",
    name: "Spectrum 5.0 — Finance, but Gamified",
    num: "/05",
    org: "SBMP · SVKM",
    date: "2025",
    location: "Mumbai",
    photoSlug: "spectrum-5-2025",
    summary: `2nd Runner-Up in the Fintech domain at SBMP's Spectrum 5.0 — a 24-hour hackathon at SVKM's Shri Bhagubhai Mafatlal Polytechnic.

What if learning finance felt like playing a game — powered by AI? We built an offline-first, gamified financial-learning platform for rural users, students, first-time earners, and families making real-world money decisions. The whole experience leans on accessibility over jargon.

As ML developer: integrated Gemini/Mistral LLMs to simplify explanations, shipped an AI fraud-detection agent, built personalised learning flows from interaction signals, replaced traditional marks with a "Confidence Meter", and wrote a government-scheme simplifier that explains benefits in relatable terms.

Stack: Next.js, offline-first PWA architecture, IndexedDB (Dexie), LLM integration.`,
    tags: ["Fintech", "LLM", "Offline-First", "Podium"],
    team: ["Vansh Patil", "Omkar Kudalkar", "Atharva Mehta", "Riya Jain"],
    href: "https://www.linkedin.com/posts/vansh-patil_fintech-machinelearning-ai-ugcPost-7431774531716841475-jkw-",
  },
  {
    id: "rubix-26-tsec",
    tier: "bronze",
    tierLabel: "▪ Top 10 Finalist",
    name: "Rubix '26 — Health-Sync",
    num: "/06",
    org: "Thadomal Shahani College",
    date: "2026",
    location: "Mumbai",
    photoSlug: "rubix-26-2026",
    summary: `Top 10 finalist at Rubix 2026 — Thadomal Shahani College of Engineering.

The problem: hospitals lose hours to long OPD waits, no real-time visibility into bed availability, delayed admissions, and poor coordination during peak hours — plus connectivity gaps in rural areas.

We built Health-Sync — a hospital command-center platform. Dynamic OPD queue with priority-based routing, rule-based admission workflow, live bed-availability dashboard, inventory usage tracking, inter-hospital capacity-sharing APIs, and offline-first sync so rural deployments don't break on a flaky network. On top: AI surge prediction (disease outbreaks, AQI alerts) and predictive diagnostics for diabetes, CKD, and heart disease.

Stack: MERN (MongoDB, Express, React, Node.js), agentic AI, REST APIs, IndexedDB / Dexie.`,
    tags: ["HealthTech", "MERN", "Agentic AI", "Top 10"],
    team: ["Vansh Patil", "Omkar Kudalkar", "Atharva Mehta", "Riya Jain", "Jai Sumanth Nekkanti (UI/UX)"],
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7424120278705692673/",
  },
  {
    id: "megahack-5-stjohns",
    tier: "bronze",
    tierLabel: "▪ Top 10 / 70 — Full-Stack",
    name: "MegaHack 5.0 — Edemy",
    num: "/07",
    org: "St. John's, Palghar",
    date: "2025",
    location: "Palghar",
    photoSlug: "megahack-5-2026",
    summary: `Top 10 out of 70 teams in the Full-Stack Development domain at MegaHack 5.0 — St. John's, Palghar.

Built Edemy — a learning-management system for full-stack development students. The pitch: keep learners unstuck.

What we shipped: Doubtswallah, an LLM-powered chatbot that answers student questions in context; an interactive coding-and-debugging game built in React for hands-on practice; and a text-to-speech accessibility layer over the whole experience.`,
    tags: ["EdTech", "LLM", "React", "Top 10"],
    team: ["Vansh Patil", "Omkar Kudalkar", "Atharva Mehta"],
    href: "https://www.linkedin.com/posts/vansh-patil_hackathon-megahack5-fullstackdevelopment-ugcPost-7307802262813270016-fjkz",
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
