export type SkillRow = {
  num: string;
  name: string;
  cat: "languages" | "ml" | "data" | "backend" | "infra" | "cv";
  items: SkillCell[];
};

export type SkillCell = {
  n: number;
  sym: string;
  name: string;
  desc: string;
  projects: number;
  dots: 1 | 2 | 3 | 4 | 5;
  theme: string;
};

export type Experience = {
  date: string;
  role: string;
  org: string;
  /** Filename in /public/orgs/ — e.g. "iit-patna.png". Renders next to the org name when present. */
  logo?: string;
  loc: string;
  bullets: { text: string; strong?: string }[];
  metrics: { value: string; label: string }[];
};

export type Project = {
  num: string;
  title: string;
  desc: string;
  stack: string[];
  thumbId: number;
  tag?: string;
  href?: string;
  code?: string;
  video?: string;
  media?: string;
};

export const HERO = {
  eyebrow: "AVAILABLE FOR SUMMER '26 · RESEARCH & ML ROLES",
  titleHtml: `<span class="ht-line">Vansh</span> <span class="ht-line">Pa<em>til</em>.</span>`,
  roleHtml: `<span class="hl">ML ENGINEER</span> <span class="sep">·</span> RESEARCHER <span class="sep">·</span> <span class="hl">IIT PATNA</span>`,
  sub: `Computer Science undergrad researching transformer architectures and speech processing at <strong>IIT Patna's Speech &amp; NLP Lab</strong>. I ship end-to-end ML pipelines — from multimodal parsing to production FastAPI backends — and occasionally win hackathons in 24 hours.`,
  meta: [
    { k: "GPA", v: `<span class="accent">9.34</span> / 10.0` },
    { k: "Focus", v: "NLP · Speech · RAG" },
    { k: "Based in", v: "Mumbai, IN" },
    { k: "Status", v: `<span class="accent">● </span>Open to collab` },
  ],
};

export const ABOUT_PARAS: string[] = [
  `I'm a second-year CS student at <em>DJ Sanghvi College of Engineering</em>, but most of my time goes into research and building things that didn't exist last week.`,
  `Right now I'm at IIT Patna working on <em>CitationEdge</em> — automated claim extraction from scientific papers using multimodal parsing and hybrid semantic search. Before that, I was optimizing classification pipelines as an AI/ML intern at Xproguard.`,
  `Outside of research I like hackathons. I've won five national ones so far. They're a good forcing function for shipping — you can't overthink architecture when there are 22 hours on the clock.`,
];

export const ABOUT_CARD: { k: string; v: string; hl?: boolean }[] = [
  { k: "role", v: "Research Intern" },
  { k: "org", v: "IIT Patna", hl: true },
  { k: "project", v: "CitationEdge" },
  { k: "stack", v: "Docling · Neo4j · LanceDB" },
  { k: "recall", v: "85%", hl: true },
  { k: "extraction", v: "95%", hl: true },
  { k: "also", v: "Xproguard · AI/ML Intern" },
];

export const EXPERIENCE: Experience[] = [
  {
    date: "JAN '26 — JUN '26",
    role: "Research Intern",
    org: "IIT Patna",
    logo: "iit-patna.png",
    loc: "Hybrid · Speech & NLP Lab",
    bullets: [
      {
        text: 'Built <strong style="color:var(--fg)">CitationEdge</strong> — automated claim extraction from scientific papers via multimodal parsing (Docling + vision models) and hybrid semantic search on Neo4j + LanceDB.',
      },
      {
        text: "Implemented evidence grounding with verifiability scoring and novelty positioning; deployed as a production system with full docs.",
      },
    ],
    metrics: [
      { value: "95%", label: "extraction" },
      { value: "85%", label: "search recall" },
      { value: "72%", label: "auto-verify" },
    ],
  },
  {
    date: "JAN '26 — NOW",
    role: "AI / ML Developer Intern",
    org: "Xproguard",
    logo: "xproguard.png",
    loc: "Remote",
    bullets: [
      {
        text: "Developed and optimized ML models (Scikit-learn, TensorFlow), improving classification accuracy; built scalable end-to-end data pipelines.",
      },
      {
        text: "Deployed models via FastAPI with REST APIs, applying MLOps practices — CI/CD, model versioning — on AWS (S3, EC2).",
      },
    ],
    metrics: [
      { value: "+18%", label: "accuracy" },
      { value: "−40%", label: "prep time" },
      { value: "AWS", label: "S3 · EC2" },
    ],
  },
  {
    date: "2024 — 2028",
    role: "B.Tech · CS & Data Science",
    org: "DJ Sanghvi College of Engineering",
    loc: "SVKM's · Mumbai",
    bullets: [
      {
        text: 'GPA <strong style="color:var(--accent)">9.34 / 10</strong>. Coursework in DL, systems, distributed computing, and probability.',
      },
      {
        text: "Focus on applied research — speech, multimodal NLP, and knowledge-graph-backed retrieval.",
      },
    ],
    metrics: [],
  },
];

export const PROJECTS: Project[] = [
  {
    num: "/001",
    title: "SignSync",
    desc: "Real-time bi-directional Sign↔Speech platform with sub-200ms inference. MediaPipe landmarks, TFLite, SiGML 3D avatars, and live Jitsi translation overlays.",
    stack: ["MediaPipe", "TFLite", "FastAPI"],
    thumbId: 1,
    href: "https://signsync-brown.vercel.app/",
  },
  {
    num: "/002",
    title: "AI Studio for Writers",
    desc: "Knowledge-graph-driven narrative platform extracting entities and relationships from 10k+ docs. RAG + LLM validation detecting inconsistencies at 92% precision.",
    stack: ["Neo4j", "Pinecone", "spaCy", "Docker"],
    thumbId: 2,
    href: "https://nolan-lemon.vercel.app/",
    video: "https://drive.google.com/file/d/16jQxOQHNO7lU40cTjOfJm8jU2WXLV84K/view",
  },
  {
    num: "/003",
    title: "Market Intelligence",
    desc: "Financial analytics platform for time-series forecasting and peer benchmarking. NLP sentiment over 500+ daily articles; 60% lower load time via caching.",
    stack: ["Python", "Streamlit", "Finnhub"],
    thumbId: 3,
    href: "https://market-analysis-vanshpatil.streamlit.app/",
    code: "https://github.com/vanshpatil16/stock-market-peer-analysis",
  },
  {
    num: "/004",
    title: "CitationEdge",
    tag: "research",
    desc: "Automated claim extraction from scientific papers. Multimodal parsing with Docling + vision models, hybrid Neo4j/LanceDB semantic search.",
    stack: ["Docling", "Neo4j", "LanceDB"],
    thumbId: 4,
    href: "https://omkarkudalkar23-citationedge.hf.space/",
    media: "/projects/citationedge.gif",
  },
];

export const SKILL_ROWS: SkillRow[] = [
  {
    num: "01",
    name: "Languages",
    cat: "languages",
    items: [
      { n: 1, sym: "Py", name: "Python", desc: "Primary — research, backend, scripting.", projects: 12, dots: 5, theme: "t-py" },
      { n: 2, sym: "C++", name: "C++", desc: "Low-level systems & competitive programming.", projects: 4, dots: 3, theme: "t-cpp" },
      { n: 3, sym: "C", name: "C", desc: "Systems fundamentals & embedded.", projects: 3, dots: 3, theme: "t-c" },
      { n: 4, sym: "Jv", name: "Java", desc: "OOP coursework + Android basics.", projects: 3, dots: 3, theme: "t-jv" },
      { n: 5, sym: "SQL", name: "SQL", desc: "Postgres, complex joins, query optimization.", projects: 7, dots: 4, theme: "t-sql" },
    ],
  },
  {
    num: "02",
    name: "ML / AI",
    cat: "ml",
    items: [
      { n: 6, sym: "TF", name: "TensorFlow", desc: "Deep learning training & deployment.", projects: 5, dots: 4, theme: "t-tf" },
      { n: 7, sym: "Sk", name: "Sklearn", desc: "Classical ML — pipelines, feature selection.", projects: 9, dots: 5, theme: "t-sk" },
      { n: 8, sym: "Tx", name: "Transformer", desc: "Attention, BERT, custom heads — core research.", projects: 6, dots: 5, theme: "t-tr" },
      { n: 9, sym: "◉", name: "Attention", desc: "Cross-attention, self-attention mechanisms.", projects: 4, dots: 4, theme: "t-at" },
      { n: 10, sym: "LC", name: "LangChain", desc: "Agent chains, tools, memory & prompting.", projects: 5, dots: 4, theme: "t-lc" },
      { n: 11, sym: "▣", name: "LangGraph", desc: "Stateful multi-agent graph orchestration.", projects: 3, dots: 4, theme: "t-lg" },
      { n: 12, sym: "◈", name: "LangSmith", desc: "Tracing, eval & observability for LLM apps.", projects: 2, dots: 3, theme: "t-ls" },
      { n: 13, sym: "RAG", name: "Retrieval", desc: "Hybrid semantic + keyword retrieval systems.", projects: 6, dots: 5, theme: "t-rag" },
      { n: 14, sym: "◆", name: "Knowl. Graph", desc: "Neo4j-backed structured knowledge bases.", projects: 3, dots: 4, theme: "t-kg" },
    ],
  },
  {
    num: "03",
    name: "Data Science",
    cat: "data",
    items: [
      { n: 15, sym: "Pd", name: "Pandas", desc: "Every dataset — cleaning, grouping, reshaping.", projects: 11, dots: 5, theme: "t-pd" },
      { n: 16, sym: "Np", name: "NumPy", desc: "Vectorized math everywhere.", projects: 11, dots: 5, theme: "t-np" },
      { n: 17, sym: "⌲", name: "Matplotlib", desc: "Publication-ready figures & EDA.", projects: 8, dots: 4, theme: "t-mpl" },
      { n: 18, sym: "Sb", name: "Seaborn", desc: "Statistical visualization & quick insights.", projects: 6, dots: 4, theme: "t-sns" },
      { n: 19, sym: "∿", name: "Time Series", desc: "ARIMA/LSTM forecasting, seasonality.", projects: 4, dots: 4, theme: "t-ts" },
      { n: 20, sym: "ƒx", name: "Feat. Eng", desc: "Domain-driven feature extraction.", projects: 7, dots: 4, theme: "t-fe" },
    ],
  },
  {
    num: "04",
    name: "Web / Backend",
    cat: "backend",
    items: [
      { n: 21, sym: "Fa", name: "FastAPI", desc: "Production async APIs for ML services.", projects: 6, dots: 5, theme: "t-fa" },
      { n: 22, sym: "Fl", name: "Flask", desc: "Lightweight prototypes & demos.", projects: 4, dots: 3, theme: "t-fl" },
      { n: 23, sym: "{ }", name: "REST", desc: "API design, OpenAPI spec, auth patterns.", projects: 7, dots: 4, theme: "t-api" },
      { n: 24, sym: "</>", name: "HTML · CSS", desc: "Clean, semantic markup + modern CSS.", projects: 8, dots: 4, theme: "t-html" },
    ],
  },
  {
    num: "05",
    name: "Tools & Platforms",
    cat: "infra",
    items: [
      { n: 25, sym: "Dk", name: "Docker", desc: "Containerized ML + backend deployments.", projects: 5, dots: 4, theme: "t-dk" },
      { n: 26, sym: "S3", name: "AWS S3", desc: "Object storage, model artifacts.", projects: 3, dots: 3, theme: "t-aws" },
      { n: 27, sym: "EC2", name: "AWS EC2", desc: "GPU compute for training runs.", projects: 3, dots: 3, theme: "t-aws" },
      { n: 28, sym: "Git", name: "Git", desc: "Daily driver — branching, rebasing, reviews.", projects: 20, dots: 5, theme: "t-git" },
      { n: 29, sym: "↻", name: "CI / CD", desc: "GH Actions pipelines for test + deploy.", projects: 4, dots: 3, theme: "t-ci" },
      { n: 30, sym: "N4", name: "Neo4j", desc: "Graph database for knowledge bases.", projects: 3, dots: 4, theme: "t-n4" },
      { n: 31, sym: "Mg", name: "Mongo", desc: "Document store for unstructured data.", projects: 3, dots: 3, theme: "t-mg" },
      { n: 32, sym: "◉", name: "Pinecone", desc: "Vector DB for production RAG.", projects: 4, dots: 4, theme: "t-pc" },
      { n: 33, sym: "Dbx", name: "Databricks", desc: "Spark notebooks, MLflow tracking.", projects: 2, dots: 3, theme: "t-db" },
    ],
  },
  {
    num: "06",
    name: "CV & Specialized",
    cat: "cv",
    items: [
      { n: 34, sym: "Cv", name: "OpenCV", desc: "Classical computer vision pipelines.", projects: 5, dots: 4, theme: "t-cv" },
      { n: 35, sym: "Yo", name: "YOLO", desc: "Real-time object detection.", projects: 4, dots: 4, theme: "t-yolo" },
      { n: 36, sym: "Mp", name: "MediaPipe", desc: "Pose, hands, face tracking.", projects: 3, dots: 3, theme: "t-mp" },
      { n: 37, sym: "TFL", name: "TF Lite", desc: "On-device model deployment.", projects: 2, dots: 3, theme: "t-tfl" },
      { n: 38, sym: "Dl", name: "Docling", desc: "Multimodal document parsing.", projects: 2, dots: 3, theme: "t-dl" },
      { n: 39, sym: "Ln", name: "LanceDB", desc: "Embedded vector search.", projects: 2, dots: 3, theme: "t-ln" },
      { n: 40, sym: "Gr", name: "Gradio", desc: "Quick ML demo interfaces.", projects: 5, dots: 4, theme: "t-gr" },
      { n: 41, sym: "St", name: "Streamlit", desc: "Internal dashboards & data apps.", projects: 4, dots: 4, theme: "t-st" },
    ],
  },
];

// Achievements moved to lib/achievements.ts — see public/achievements/README.md

export const CONTACT_LINKS = [
  { label: "Email", handle: "patilvansh822@gmail.com ↗", href: "mailto:patilvansh822@gmail.com" },
  { label: "GitHub", handle: "@vanshpatil16 ↗", href: "https://github.com/vanshpatil16" },
  { label: "LinkedIn", handle: "/in/vansh-patil ↗", href: "https://linkedin.com/in/vansh-patil" },
  { label: "Phone", handle: "+91 9923 796 333 ↗", href: "tel:+919923796333" },
];

export const NAV_SECTIONS = [
  { id: "hero", label: "00 · INDEX" },
  { id: "about", label: "01 · ABOUT" },
  { id: "experience", label: "02 · WORK" },
  { id: "projects", label: "03 · BUILDS" },
  { id: "skills", label: "04 · STACK" },
  { id: "awards", label: "05 · WINS" },
  { id: "contact", label: "06 · SIGNAL" },
];
