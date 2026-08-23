/**
 * Project Hunter — slot machine data + matching engine.
 *
 * Three reels (Type / Domain / Skill) land on a combination; the machine
 * then resolves that combination against the project archive.
 */

export const TYPE_REEL = [
  "Founder",
  "Job",
  "Open Source",
  "Hackathon",
  "Personal",
] as const;

export const DOMAIN_REEL = [
  "Enterprise",
  "DevTools",
  "Research",
  "Marketing",
  "FinTech / Web3",
  "Creative / Gaming",
  "Consumer / Web",
] as const;

export const SKILL_REEL = [
  "JavaScript",
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  "Frontend Engineering",
  "Backend Engineering",
  "Full-Stack Engineering",
  "System Design",
  "Machine Learning",
  "Computer Vision",
  "Databases",
  "Vector Databases",
  "Queues & Background Jobs",
  "Streaming",
  "Smart Contracts",
  "WebGL / Creative Coding",
  "CLI & Developer Tooling",
  "Programmatic SEO",
  "AI Agents",
  "RAG",
  "LLM Evals",
  "Human-in-the-Loop",
  "Context & Memory",
  "AI Observability",
  "Founder",
  "0→1",
  "MVP",
  "First Users",
  "Paying Customers",
  "GTM",
  "Scaling",
  "Sales",
  "Leadership",
] as const;

export type ReelType = (typeof TYPE_REEL)[number];
export type ReelDomain = (typeof DOMAIN_REEL)[number];
export type ReelSkill = (typeof SKILL_REEL)[number];

export const REELS: readonly (readonly string[])[] = [
  TYPE_REEL,
  DOMAIN_REEL,
  SKILL_REEL,
];
export const REEL_LABELS = ["Type", "Domain", "Skill"] as const;

/**
 * Artwork for reel faces, keyed by value.
 *
 * Keys are reel values, not reel names — "Founder" appears on both the Type
 * and Skill reels and shares one card. Any value without an entry renders a
 * dot-matrix label card instead, so the machine works with a partial set and
 * each new PNG upgrades its face in place.
 */
/**
 * Card artwork, keyed per reel.
 *
 * Keying by reel and not by value alone matters: "Founder" sits on both the
 * Type and Skill reels and needs a different card on each — the Type card is a
 * scene, the Skill card is its own illustration. Values with no entry fall back
 * to a dot-matrix label plate, so a partial set still runs.
 */
export const TYPE_ART: Record<string, string> = {
  Founder: "/type/founder.webp",
  Job: "/type/job.webp",
  "Open Source": "/type/open_source.webp",
  Hackathon: "/type/hackathon.webp",
  Personal: "/type/personal.webp",
};

export const DOMAIN_ART: Record<string, string> = {
  Enterprise: "/domain/enterprise.webp",
  DevTools: "/domain/dev_tools.webp",
  Research: "/domain/research.webp",
  Marketing: "/domain/marketing.webp",
  "FinTech / Web3": "/domain/fintech_web3.webp",
  "Creative / Gaming": "/domain/creaive_gaming.webp",
  "Consumer / Web": "/domain/consumer_web.webp",
};

/**
 * Display order for the skills page, highest level of work first: what I own,
 * then how systems are shaped, then what they are built out of.
 *
 * Separate from `SKILL_REEL`, which is the machine's strip and whose order is
 * the reel's business. Anything missing here still renders — it falls to the
 * end in reel order rather than vanishing.
 */
export const SKILL_LEVEL_ORDER: readonly string[] = [
  // Ownership
  "Founder",
  "Leadership",
  "0→1",
  "MVP",
  "First Users",
  "Paying Customers",
  "GTM",
  "Sales",
  "Scaling",

  // Shape of the system
  "System Design",
  "Full-Stack Engineering",
  "Backend Engineering",
  "Frontend Engineering",

  // AI systems
  "AI Agents",
  "RAG",
  "LLM Evals",
  "Context & Memory",
  "Human-in-the-Loop",
  "AI Observability",
  "Machine Learning",
  "Computer Vision",

  // Core languages and frameworks
  "TypeScript",
  "JavaScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",

  // Specialisms
  "Databases",
  "Vector Databases",
  "Queues & Background Jobs",
  "Streaming",
  "CLI & Developer Tooling",
  "WebGL / Creative Coding",
  "Smart Contracts",
  "Programmatic SEO",
];

/** `SKILL_REEL` in level order, with anything unlisted appended in reel order. */
export function skillsByLevel(): string[] {
  const rank = new Map(SKILL_LEVEL_ORDER.map((s, i) => [s, i]));
  return [...SKILL_REEL].sort(
    (a, b) =>
      (rank.get(a) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(b) ?? Number.MAX_SAFE_INTEGER),
  );
}

export const SKILL_ART: Record<string, string> = {
  // Engineering
  JavaScript: "/skills/js.webp",
  TypeScript: "/skills/ts.webp",
  Python: "/skills/python.webp",
  React: "/skills/react.webp",
  "Next.js": "/skills/next1.webp",
  "Node.js": "/skills/node.webp",
  "Frontend Engineering": "/skills/frontend.webp",
  "Backend Engineering": "/skills/backend.webp",
  "Full-Stack Engineering": "/skills/fullstack.webp",
  "System Design": "/skills/system_design.webp",
  "Machine Learning": "/skills/ml.webp",
  "Computer Vision": "/skills/cv.webp",
  Databases: "/skills/dbs.webp",
  "Vector Databases": "/skills/vector_dbs.webp",
  "Queues & Background Jobs": "/skills/jobs.webp",
  Streaming: "/skills/streaming.webp",
  "Smart Contracts": "/skills/smart_contracts.webp",
  "WebGL / Creative Coding": "/skills/webgl.webp",
  "CLI & Developer Tooling": "/skills/cli.webp",
  "Programmatic SEO": "/skills/seo.webp",

  // AI
  "AI Agents": "/skills/ai_agents.webp",
  RAG: "/skills/rag.webp",
  "LLM Evals": "/skills/llm_evals.webp",
  "Human-in-the-Loop": "/skills/hitl.webp",
  "Context & Memory": "/skills/context_memory.webp",
  "AI Observability": "/skills/ai_observability.webp",

  // Builder
  Founder: "/skills/founder.webp",
  "0→1": "/skills/0_1.webp",
  MVP: "/skills/mvp.webp",
  "First Users": "/skills/first_users.webp",
  "Paying Customers": "/skills/paying_customers.webp",
  GTM: "/skills/go_to_market.webp",
  Scaling: "/skills/scaling.webp",
  Sales: "/skills/sales.webp",
  Leadership: "/skills/leadership.webp",
};

const REEL_ART = [TYPE_ART, DOMAIN_ART, SKILL_ART] as const;

/** Artwork for a face, or undefined when the reel should show a label plate. */
export const artFor = (reelIndex: number, value: string): string | undefined =>
  REEL_ART[reelIndex]?.[value];


export type Combo = {
  type: ReelType;
  domain: ReelDomain;
  skill: ReelSkill;
};

/**
 * How a project can be opened from inside the site. Every one of these is an
 * internal page — a case study, a live build and a playable demo all route
 * through the site rather than off it.
 *
 * A project's own public site is separate: see `href` on Project. That one is
 * outbound, and it never becomes the card's primary action, so the stretched
 * hit area covering the whole card is always an internal destination.
 */
export type ProjectLinkKind = "case-study" | "live" | "play";

export type ProjectLink = { kind: ProjectLinkKind; href: string };

export type Project = {
  id: string;
  name: string;
  role: string;
  period: string;
  blurb: string;
  logo?: string;
  /** The project's own site out in the world. Rendered as a secondary,
   *  outbound action; never the card's stretched primary link. */
  href?: string;
  /** Screenshot shown at the head of the card. */
  cover?: string;
  /**
   * A deployed, playable build. Present only where the project really is a
   * game — `domain: "Creative / Gaming"` covers demos and toys too, so it is
   * not a reliable test. The URL is embedded in an iframe, which means the
   * host must not send `X-Frame-Options` or a restrictive `frame-ancestors`.
   */
  play?: string;
  /** Internal destinations. Projects without any render no actions. */
  links?: ProjectLink[];
  /**
   * Long-form sections for the case-study page. Absent for every project
   * today — the page renders what the archive already knows and simply omits
   * this block, so adding prose later is additive rather than a migration.
   */
  story?: { heading: string; body: string }[];
  /** Projects can sit in more than one bucket — a repo can be Personal *and*
   *  Open Source, a product both Enterprise *and* Marketing. A reel hits if
   *  its value appears anywhere in the list. */
  type: ReelType[];
  domain: ReelDomain[];
  skills: ReelSkill[];
};

/* ─── Archive ─────────────────────────────────────────────────────────────
   Order is editorial: strongest work first. It doubles as the gallery's
   default ranking and as the tie-break inside a match tier.
   ────────────────────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  {
    id: "alif",
    name: "Alif",
    role: "Founder & AI Engineer",
    period: "2026 — NOW",
    blurb: "An enterprise intelligence layer, querying and acting across 20+ connectors.",
    logo: "/alif-logo.svg",
    href: "https://joinalif.com",
    type: ["Founder"],
    domain: ["Enterprise"],
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design",
      "AI Agents",
                  "Human-in-the-Loop",
      "Context & Memory",
      "AI Observability",
            "Founder",
      "0→1",
      "MVP",
      "Scaling",
      "Leadership"
    ],
  },
  {
    id: "beonai",
    name: "BeonAI",
    role: "Founder & AI Systems Engineer",
    period: "2025 — NOW",
    blurb: "A generative engine optimization platform, running 300K+ evaluations for 20+ paying brands.",
    logo: "/beonai-logo.svg",
    href: "https://beonai.io",
    type: ["Founder"],
    domain: ["Marketing", "Enterprise", "Consumer / Web"],
    skills: [
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design",
      "AI Agents",
      "LLM Evals",
                  "Human-in-the-Loop",
      "Context & Memory",
      "AI Observability",
            "Founder",
      "0→1",
      "MVP",
      "First Users",
      "Paying Customers",
      "GTM",
      "Scaling",
      "Sales",
      "Leadership"
    ],
  },
  {
    id: "paperpilot",
    name: "Paper Pilot",
    role: "Founder · CEO · Founding Engineer",
    period: "2024 — 2025",
    blurb: "An AI literature-review workspace, serving 50K+ answers a day to researchers.",
    logo: "/paperpilot-logo.png",
    href: "https://paperpilot.xyz",
    type: ["Founder"],
    domain: ["Research", "Consumer / Web"],
    skills: [
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design",
      "RAG",
                        "Founder",
      "0→1",
      "MVP",
      "First Users",
      "GTM",
      "Scaling",
      "Leadership"
    ],
  },
  {
    id: "burn0",
    name: "burn0",
    role: "Creator · Open Source",
    period: "2026 — NOW",
    blurb: "A local-first LLM cost tracker, one import, no proxy, no cloud.",
    logo: "/burn0-logo.svg",
    href: "https://burn0.dev",
    type: ["Open Source", "Personal"],
    domain: ["DevTools"],
    skills: [
      "TypeScript",
      "Node.js",
      "React",
      "Backend Engineering",
      "System Design",
      "AI Observability",
            "0→1",
      "MVP",
      "First Users",
      "GTM",
      "Scaling"
    ],
  },
  {
    id: "github-ask",
    name: "GitHub Ask",
    role: "Personal project",
    period: "2025",
    blurb: "An autonomous codebase agent, chunking any repo by AST rather than characters.",
    type: ["Personal"],
    domain: ["DevTools", "Research"],
    skills: [
      "Python",
      "React",
      "Next.js",
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design",
      "AI Agents",
      "RAG",
            "Context & Memory",
                  "0→1",
      "MVP"
      
    ],
  },
  {
    id: "hadith-qa",
    name: "Hadith Q&A",
    role: "Personal project",
    period: "ARCHIVE",
    blurb: "Semantic search over classical Hadith, returning citation-grounded answers with source grading.",
    type: ["Personal"],
    domain: ["Research", "Consumer / Web"],
    skills: [
      "Python",
      "RAG",
                        "0→1",
      "MVP",
      "First Users",
      "Scaling"
    ],
  },
  {
    id: "basketo",
    name: "Basketo Finance",
    role: "Founder · Founding Engineer",
    period: "2022",
    blurb: "Tokenized crypto baskets on Polygon, built as ERC-721 portfolios with a dApp.",
    logo: "/basketo-logo.png",
    cover: "/basketo/assest1.png",
    links: [{ kind: "case-study", href: "/work/basketo" }],
    type: ["Founder"],
    domain: ["FinTech / Web3", "Consumer / Web"],
    skills: [
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design",
      "Founder",
      "0→1",
      "MVP",
      "GTM",
      "Leadership"
    ],
  },
  {
    id: "gutenberg-campaign",
    name: "Gutenberg AI Campaign Platform",
    role: "Full Stack Engineer",
    period: "2023 — 2024",
    blurb: "A retrieval-backed campaign platform, searching marketing assets for global brand teams.",
    logo: "/gutenberg-logo.png",
    type: ["Job"],
    domain: ["Enterprise", "Marketing"],
    skills: [
      "React",
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design",
      "RAG"
                      ],
  },
  {
    id: "gutenberg-pricing",
    name: "Gutenberg Pricing System",
    role: "Full Stack Engineer",
    period: "2023 — 2024",
    blurb: "A quote and pricing engine, handling rate cards, approvals and regional rollups.",
    logo: "/gutenberg-logo.png",
    type: ["Job"],
    domain: ["Enterprise"],
    skills: [
      "Node.js",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design"
    ],
  },
  {
    id: "tecnotree",
    name: "Tecnotree",
    role: "Frontend Developer · Full Stack Engineer",
    period: "2021 — 2023",
    blurb: "A telecom BSS platform, serving 800M+ subscribers across catalog and billing.",
    logo: "/tecnotree-logo.jpeg",
    type: ["Job"],
    domain: ["Enterprise"],
    skills: [
      "TypeScript",
      "React",
      "Node.js",
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "System Design",
      "Scaling"
    ],
  },
  {
    id: "luxe",
    name: "LUXE NFT Hackathon",
    role: "1st Place · Best Interoperability · $25K",
    period: "2021",
    blurb: "A cross-chain portfolio rebalancer, built in 48 hours against 200+ teams.",
    type: ["Hackathon"],
    domain: ["FinTech / Web3"],
    skills: ["Full-Stack Engineering", "System Design", "0→1", "MVP"],
  },
  {
    id: "freshworks",
    name: "Freshworks Attachment Viewer",
    role: "2nd Place · $4.2K",
    period: "2021",
    blurb: "A Freshdesk sidebar extension, gathering scattered ticket attachments into one gallery.",
    type: ["Hackathon"],
    domain: ["Enterprise"],
    skills: [
      "JavaScript",
      "Frontend Engineering",
      "System Design",
      "0→1",
      "MVP"
    ],
  },
  {
    id: "square",
    name: "Square Self-Checkout",
    role: "Most Creative Use Case · $2.5K",
    period: "2021",
    blurb: "A phone-based self-checkout flow, repurposing the Square Invoices API entirely.",
    type: ["Hackathon"],
    domain: ["Consumer / Web"],
    skills: ["System Design", "0→1", "MVP"],
  },
  {
    id: "project-5000",
    name: "Project-5000",
    role: "Hackathon prototype",
    period: "2021",
    blurb: "A sandbox and proof-of-concept, later shipped as the Freshworks viewer.",
    type: ["Hackathon"],
    domain: ["Enterprise"],
    skills: ["JavaScript", "Frontend Engineering", "0→1", "MVP"],
  },
  {
    id: "three-js-text",
    cover: "/work/three-js-text.webp",
    play: "https://three-js-text-geomentry.vercel.app/",
    name: "Three.js Text Geometry",
    role: "Personal project",
    period: "2021",
    blurb: "A WebGL typography scene, extruding 3D typefaces under matcap lighting.",
    type: ["Personal"],
    domain: ["Creative / Gaming", "Consumer / Web"],
    skills: ["JavaScript", "Frontend Engineering", "0→1"],
  },
  {
    id: "colorize",
    cover: "/work/colorize.webp",
    play: "https://colorize-swart.vercel.app/",
    name: "colorize",
    role: "Personal project",
    period: "2021",
    blurb: "A hex colour generator, built from raw hexadecimal maths, no libraries.",
    type: ["Personal"],
    domain: ["Creative / Gaming", "Consumer / Web"],
    skills: ["JavaScript", "Frontend Engineering", "0→1"],
  },
  {
    id: "prodjar",
    name: "Responsive Site · Prodjar",
    role: "Full Stack Developer",
    period: "2020",
    blurb: "An agency take-home build, written with zero CSS frameworks, flexbox throughout.",
    logo: "/prodjar-logo.jpeg",
    type: ["Job"],
    domain: ["Consumer / Web"],
    skills: ["Frontend Engineering"],
  },
  {
    id: "hacker-news",
    cover: "/work/hacker-news.webp",
    play: "https://hacker-news-clone-one-red.vercel.app/",
    name: "Hacker News Clone",
    role: "Personal project",
    period: "2020",
    blurb: "A Hacker News client, resolving story IDs then items in parallel.",
    type: ["Personal"],
    domain: ["Consumer / Web"],
    skills: ["JavaScript", "React", "Frontend Engineering", "0→1", "MVP"],
  },
  {
    id: "fortres",
    name: "fortRes",
    role: "Personal project",
    period: "2019",
    blurb: "A personal portfolio hub, routed through a CNAME to GitHub Pages.",
    type: ["Personal"],
    domain: ["Consumer / Web"],
    skills: ["Frontend Engineering", "0→1", "MVP"],
  },
  {
    id: "portfolio-v1",
    name: "Portfolio v1",
    role: "Personal project",
    period: "2019",
    blurb: "My first portfolio site, with a canvas particle web tracking cursor velocity.",
    type: ["Personal"],
    domain: ["Consumer / Web", "Creative / Gaming"],
    skills: ["JavaScript", "Frontend Engineering", "0→1", "MVP"],
  },
  {
    id: "text-editor",
    cover: "/work/text-editor.webp",
    play: "https://text-editor-silk-kappa.vercel.app/",
    name: "Text Editor",
    role: "Personal project",
    period: "2019",
    blurb: "An in-browser code editor, piping keystrokes into a sandboxed live preview.",
    type: ["Personal"],
    domain: ["DevTools", "Consumer / Web"],
    skills: ["JavaScript", "Frontend Engineering", "0→1", "MVP"],
  },
  {
    id: "os-screen-time",
    name: "os-on-screen-time",
    role: "Author · npm package",
    period: "2019",
    blurb: "My first published package, reading OS uptime with zero dependencies.",
    type: ["Open Source", "Personal"],
    domain: ["DevTools"],
    skills: ["Node.js", "Backend Engineering", "0→1", "MVP"],
  },
  {
    id: "weather-app",
    name: "Weather App",
    role: "Personal project",
    period: "2019",
    blurb: "A production-shaped Express API, with full CRUD, Joi validation and Helmet.",
    type: ["Personal"],
    domain: ["Consumer / Web"],
    skills: ["Node.js", "Backend Engineering", "0→1", "MVP"],
  },
  {
    id: "note-app",
    name: "note-app-nodeJS",
    role: "Personal project",
    period: "2019",
    blurb: "A Node command-line notes tool, using yargs schemas and defensive JSON persistence.",
    type: ["Personal"],
    domain: ["DevTools"],
    skills: ["Node.js", "Backend Engineering", "0→1", "MVP"],
  },
  {
    id: "face-detection",
    name: "Face Detection",
    role: "Personal project",
    period: "2019",
    blurb: "Real-time webcam face tracking, using tuned multi-scale Haar cascade classifiers.",
    type: ["Personal"],
    domain: ["Research"],
    skills: ["Python"],
  },
  {
    id: "lane-detection",
    name: "Lane Detection",
    role: "Personal project",
    period: "2019",
    blurb: "A road lane detector, running Canny edges through a Hough transform.",
    type: ["Personal"],
    domain: ["Research"],
    skills: ["Python"],
  },
  {
    id: "linreg-scratch",
    name: "Linear Regression From Scratch",
    role: "Personal project",
    period: "2019",
    blurb: "Linear regression from scratch, deriving MSE partial derivatives by hand.",
    type: ["Personal"],
    domain: ["Research"],
    skills: ["Python"],
  },
  {
    id: "digit-svm",
    name: "Digit Recognition — SVM",
    role: "Personal project",
    period: "2019",
    blurb: "A handwritten digit classifier, tuning RBF kernels over 8×8 matrices.",
    type: ["Personal"],
    domain: ["Research"],
    skills: ["Python"],
  },
  {
    id: "first-linreg",
    name: "First Linear Regression",
    role: "Personal project",
    period: "2018",
    blurb: "My first machine learning project, fitting ordinary least squares to real data.",
    type: ["Personal"],
    domain: ["Research"],
    skills: ["Python"],
  },
  {
    id: "frontend-internship",
    name: "FrontEndInternship",
    role: "Frontend Intern",
    period: "2018",
    blurb: "My first professional React codebase, with a Redux store and custom Webpack.",
    logo: "/rebelbase-logo.jpeg",
    type: ["Job"],
    domain: ["Consumer / Web"],
    skills: ["JavaScript", "React", "Frontend Engineering"],
  },
  {
    id: "music-player",
    cover: "/work/music-player.webp",
    play: "https://music-player-mu-rouge.vercel.app/",
    name: "MUSIC-PLAYER",
    role: "Personal project",
    period: "2018",
    blurb: "A browser music player, driving playlist state through the Audio API.",
    type: ["Personal"],
    domain: ["Creative / Gaming", "Consumer / Web"],
    skills: ["JavaScript", "Frontend Engineering", "0→1", "MVP"],
  },
  {
    id: "cs-leets",
    cover: "/work/cs-leets.webp",
    play: "https://cs-leets.vercel.app/",
    name: "CS-LEETS",
    role: "Personal project",
    period: "2018",
    blurb: "A student community site, built on strict semantic HTML5 and hierarchy.",
    type: ["Personal"],
    domain: ["Consumer / Web"],
    skills: ["Frontend Engineering", "0→1", "MVP"],
  },
  {
    id: "need-for-speed",
    cover: "/work/need-for-speed.webp",
    play: "https://need-for-speed-amber.vercel.app/",
    name: "NEED-FOR-SPEED",
    role: "Personal project",
    period: "2018",
    blurb: "A full-viewport video hero, layering rgba overlays to keep text legible.",
    type: ["Personal"],
    domain: ["Creative / Gaming", "Consumer / Web"],
    skills: ["Frontend Engineering"],
  },
  {
    id: "space-x",
    cover: "/work/space-x.webp",
    play: "https://space-x-rho-fawn.vercel.app/",
    name: "SPACE-X",
    role: "Personal project",
    period: "2018",
    blurb: "A zero-JavaScript parallax page, built purely from background-attachment and mobile fallbacks.",
    type: ["Personal"],
    domain: ["Creative / Gaming", "Consumer / Web"],
    skills: ["Frontend Engineering"],
  },
  {
    id: "music-balls",
    cover: "/work/music-balls.webp",
    play: "https://music-balls.vercel.app/",
    name: "music-balls",
    role: "Personal project · Open Source",
    period: "2018",
    blurb: "A Paper.js canvas toy, running 26 polyphonic samples at 60 FPS.",
    type: ["Personal", "Open Source"],
    domain: ["Creative / Gaming", "Consumer / Web"],
    skills: ["JavaScript", "Frontend Engineering", "0→1"],
  },
  {
    id: "todo-list",
    cover: "/work/todo-list.webp",
    play: "https://to-do-list-app-iota-gules.vercel.app/",
    name: "TO-DO-LIST-APP",
    role: "Personal project",
    period: "2018",
    blurb: "A vanilla JavaScript to-do list, using event delegation so new items work.",
    type: ["Personal"],
    domain: ["Consumer / Web"],
    skills: ["JavaScript", "Frontend Engineering", "0→1"],
  },
  {
    id: "rgb-color-game",
    cover: "/work/rgb-color-game.webp",
    play: "https://rgb-color-game-neon.vercel.app/",
    name: "RGB Color Game",
    role: "Personal project",
    period: "2018",
    blurb: "My very first project, generating random RGB across three difficulty modes.",
    type: ["Personal"],
    domain: ["Creative / Gaming", "Consumer / Web"],
    skills: ["JavaScript", "Frontend Engineering", "0→1"],
  }
];

/* ─── Focus ──────────────────────────────────────────────────────────────── */

/**
 * An arrival that already knows what it came for.
 *
 * The home page's four entry points each name a slice of the archive. They
 * *rank* rather than filter — landing from "AI products" must not look like
 * the other thirty projects stopped existing — so every focus is a sort key,
 * never a subset.
 */
export type Focus = "games" | "startups" | "software" | "hackathons";

export const FOCUS_LABEL: Record<Focus, string> = {
  games: "Playable first",
  startups: "Startups first",
  software: "Company work first",
  hackathons: "Hackathons first",
};

export function isFocus(value: string | null): value is Focus {
  return value === "games" || value === "startups" || value === "software" ||
    value === "hackathons";
}

/**
 * Whether a project belongs to the slice a focus names.
 *
 * Every case reads `type`, which is why the four slices are disjoint: the
 * archive already sorts itself into founded / employed / hackathon, and a
 * project is only ever one of those. Earlier versions matched on skills and
 * produced slices that overlapped by three-quarters — two links opening the
 * same cards.
 */
export function matchesFocus(project: Project, focus: Focus): boolean {
  switch (focus) {
    case "games":
      return Boolean(project.play);
    case "startups":
      return project.type.includes("Founder");
    case "software":
      return project.type.includes("Job");
    case "hackathons":
      return project.type.includes("Hackathon");
  }
}

/* ─── Matching ───────────────────────────────────────────────────────────── */

export type MatchedDims = { type: boolean; domain: boolean; skill: boolean };

export type Match = {
  project: Project;
  score: 0 | 1 | 2 | 3;
  matched: MatchedDims;
};

export function scoreProject(project: Project, combo: Combo): Match {
  const matched: MatchedDims = {
    type: project.type.includes(combo.type),
    domain: project.domain.includes(combo.domain),
    skill: project.skills.includes(combo.skill),
  };
  const score = (Number(matched.type) +
    Number(matched.domain) +
    Number(matched.skill)) as 0 | 1 | 2 | 3;
  return { project, score, matched };
}

export type SpinResult = {
  combo: Combo;
  /** Highest score any project achieved: 3 = exact, 2 = partial, 1 = closest. */
  tier: 0 | 1 | 2 | 3;
  matches: Match[];
};

/**
 * Resolve a landed combination against the archive.
 *
 * Ranking is strictly tiered: if any project hits 3/3, only 3/3 projects are
 * returned. Otherwise the machine falls back to 2/3, then 1/3, so a pull
 * essentially always surfaces relevant work instead of dead-ending.
 */
const archiveIndex = (p: Project) => projects.findIndex((x) => x.id === p.id);

export function resolveCombo(combo: Combo): SpinResult {
  const scored = projects.map((p) => scoreProject(p, combo));
  const tier = Math.max(0, ...scored.map((m) => m.score)) as 0 | 1 | 2 | 3;
  if (tier === 0) return { combo, tier, matches: [] };

  const matches = scored
    .filter((m) => m.score === tier)
    // Within a tier, prefer a type hit, then a domain hit — keeps the most
    // conceptually-aligned project at the front of the results grid.
    .sort(
      (a, b) =>
        Number(b.matched.type) - Number(a.matched.type) ||
        Number(b.matched.domain) - Number(a.matched.domain) ||
        archiveIndex(a.project) - archiveIndex(b.project),
    );

  return { combo, tier, matches };
}

/**
 * Rank the whole archive against a combination.
 *
 * The gallery shows every project at all times; a spin re-orders it rather
 * than filtering it down, so the collection never flashes empty. Higher
 * scores float to the front, ties fall back to editorial archive order.
 */
export function rankProjects(combo: Combo | null): Match[] {
  if (!combo) {
    return projects.map((project) => ({
      project,
      score: 0 as const,
      matched: { type: false, domain: false, skill: false },
    }));
  }

  return projects
    .map((p) => scoreProject(p, combo))
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.matched.type) - Number(a.matched.type) ||
        Number(b.matched.domain) - Number(a.matched.domain) ||
        archiveIndex(a.project) - archiveIndex(b.project),
    );
}

/* ─── Landing policy ─────────────────────────────────────────────────────── */

/**
 * Share of pulls that are rigged to land on a combination a real project
 * satisfies 3/3. The remainder spin freely across all 1,200 combinations.
 *
 * This is the machine's personality dial:
 *   1.0  → every pull is a jackpot. Reliable, but the reels stop mattering.
 *   0.0  → honest randomness. Mostly 2/3 fallbacks, jackpots feel earned but rare.
 *   0.7  → frequent hits, with enough free spins that a jackpot still reads as one.
 */
export const JACKPOT_BIAS = 0.7;

const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/** Choose the combination the reels will land on for the next pull. */
export function pickSpinTarget(previous?: Combo): Combo {
  for (let attempt = 0; attempt < 12; attempt++) {
    let combo: Combo;

    if (Math.random() < JACKPOT_BIAS) {
      // Rigged: sample a project, then read a valid triple straight off it.
      const p = pick(projects);
      combo = {
        type: pick(p.type),
        domain: pick(p.domain),
        skill: pick(p.skills),
      };
    } else {
      combo = {
        type: pick(TYPE_REEL),
        domain: pick(DOMAIN_REEL),
        skill: pick(SKILL_REEL),
      };
    }

    const isRepeat =
      previous &&
      previous.type === combo.type &&
      previous.domain === combo.domain &&
      previous.skill === combo.skill;

    if (!isRepeat) return combo;
  }

  return {
    type: pick(TYPE_REEL),
    domain: pick(DOMAIN_REEL),
    skill: pick(SKILL_REEL),
  };
}

export const comboIndices = (combo: Combo): [number, number, number] => [
  TYPE_REEL.indexOf(combo.type),
  DOMAIN_REEL.indexOf(combo.domain),
  SKILL_REEL.indexOf(combo.skill)
];
