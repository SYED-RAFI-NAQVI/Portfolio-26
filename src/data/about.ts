export const intro = {
  name: "Syed Rafi Naqvi",
  title: "AI / Software Engineer · Technical Founder",
  bio: [
    "I’m an engineer and founder who likes taking ideas from a blank repo to something real people can use. Over the last 6+ years, I’ve worked across frontend, backend, AI systems, enterprise software, and open source and built products of my own from first commit to paying customers.",
    "I’m drawn to problems that don’t fit neatly into one layer. I like understanding how the whole thing works: the model, the infrastructure, the interface, and the product decisions that hold it together.",
  ],
};

export const currently = [
  {
    name: "JoinAlif",
    description: "Enterprise intelligence that connects fragmented data across ERP systems, business apps, and manufacturing systems. Teams can query and act across operations through a single AI interface.",
    status: "BUILDING"
  },
  {
    name: "burn0",
    description: "Zero-code, local-first observability for LLMs and APIs. No proxies, no code changes, no data leaving your machine.",
    status: "OPEN SOURCE"
  }
];

export const locations = {
  current: {
    id: "current",
    city: "Atlanta",
    label: "US  Current",
    coordsStr: "33.7490° N, 84.3880° W",
    lat: 33.7490,
    lng: -84.3880,
    zoom: 4,
    svUrl: "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=33.7490,-84.3880"
  },
  born: {
    id: "born",
    label: "Born",
    city: "Kothagudem",
    address: "GJVF+RHH, Rama Talkies Rd, Sanyasi Basti, Ganeshbasthi, Kothagudem, Telangana 507101, India",
    coordsStr: "17.5446° N, 80.6239° E",
    lat: 17.5446251,
    lng: 80.623876,
    zoom: 4.5,
    svUrl: "https://www.google.com/maps/@17.5446251,80.623876,3a,75y,231.61h,81.79t/data=!3m7!1e1!3m5!1sWBAMdeb7cgHifhBDQ5hItg!2e0!7i13312!8i6656"
  }
};

export const howIBuild = {
  text: "I prioritize speed, reliability, and aesthetics. My technical foundation spans Next.js, Node, Python, and cloud infrastructure, but I am language-agnostic when solving hard problems.",
};

export type PathEntry = {
  company: string;
  role: string;
  period: string;
  description?: string;
  logo: string;
  type: "main" | "education" | "internship";
};

export const pathData: PathEntry[] = [
  {
    company: "Alif",
    role: "Founder & AI Engineer",
    period: "NOW",
    logo: "/alif-logo.svg",
    type: "main",
  },
  {
    company: "BeonAI",
    role: "Founder & AI Systems Engineer",
    period: "2025",
    logo: "/beonai-logo.svg",
    type: "main",
  },
  {
    company: "Paper Pilot",
    role: "Founder · CEO · Founding Engineer",
    period: "MAR 2024 — SEP 2025",
    logo: "/paperpilot-logo.png",
    type: "main",
  },
  {
    company: "University of Texas at Arlington",
    role: "M.S. Information Technology",
    period: "JAN 2024 — DEC 2025",
    logo: "/uta-logo.png",
    type: "education",
  },
  {
    company: "Gutenberg",
    role: "Full Stack Engineer",
    period: "JAN 2023 — MAR 2024",
    logo: "/gutenberg-logo.png",
    type: "main",
  },
  {
    company: "Basketo Finance",
    role: "Founder · Founding Engineer",
    period: "MAR 2022 — DEC 2022",
    logo: "/basketo-logo.png",
    type: "main",
  },
  {
    company: "Tecnotree",
    role: "Frontend Developer · Full Stack Engineer",
    period: "JUN 2021 — DEC 2022",
    logo: "/tecnotree-logo.jpeg",
    type: "main",
  },
  {
    company: "Futurize Digital",
    role: "Full Stack Developer",
    period: "NOV 2020 — MAY 2021",
    logo: "", // Missing logo
    type: "internship",
  },
  {
    company: "Prodjar",
    role: "Full Stack Engineer",
    period: "JUN 2020 — OCT 2020",
    logo: "/prodjar-logo.jpeg",
    type: "internship",
  },
  {
    company: "SPI Cinemas",
    role: "Software Engineer",
    period: "DEC 2018 — MAY 2019",
    logo: "/spi-logo.png",
    type: "internship",
  },
  {
    company: "RebelBase",
    role: "Junior Software Engineer",
    period: "JUL 2018 — DEC 2018",
    logo: "/rebelbase-logo.jpeg",
    type: "internship",
  },
  {
    company: "Dr. M.G.R. Educational & Research Institute",
    role: "B.Tech. Computer Science",
    period: "2017 — 2021",
    logo: "/mgr-logo.jpeg",
    type: "education",
  },
];

export const projects = [
  {
    name: "burn0",
    descriptor: "Local-first LLM & API observability",
    icon: "/brands/burn0.svg",
    href: "https://burn0.dev",
  },
  {
    name: "Alif",
    descriptor: "Digital platform for Islamic knowledge",
    icon: "/brands/alif.svg",
  },
  {
    name: "Hadith Q&A",
    descriptor: "AI-powered Hadith search and synthesis",
  },
  {
    name: "BeonAI",
    descriptor: "Provider-agnostic LLM toolset",
    href: "https://beonai.io",
  },
];

export const stats = [
  { value: "6+", label: "years building" },
  { value: "300K+", label: "LLM prompts evaluated" },
  { value: "50K+", label: "research answers / day" },
  { value: "5K+", label: "npm downloads" },
  { value: "6×", label: "hackathon wins" },
  { value: "$31K+", label: "hackathon prizes" },
];



export const awards = [
  {
    name: "LUXE NFT Hackathon",
    details: "$25K Winner · Best Interoperability Solution",
  },
  {
    name: "Freshworks Hackathon",
    details: "Runner-Up · $4.2K",
  },
  {
    name: "Square Hackathon",
    details: "Winner · Most Creative Use Case",
  },
];

export const links = [
  {
    label: "Email",
    href: "mailto:hello@example.com",
    text: "hello@example.com",
  },
  { label: "LinkedIn", href: "https://linkedin.com/in/syedrafinaqvi" },
  { label: "burn0.dev", href: "https://burn0.dev" },
  { label: "beonai.io", href: "https://beonai.io" },
];
