// Repeated card-grid content. Hero/About/Contact/Footer copy lives in index.html.
// Source: CONTENT.md — keep copy verbatim when editing.

export interface IntroCard {
  title: string;
  body: string;
}

export const introCards: IntroCard[] = [
  {
    title: "What is IEEE?",
    body: "IEEE is a global organization that develops standards to ensure the consistency, compatibility, and interoperability of technology. Covering electronics, telecommunications, and computing, IEEE enhances product reliability and fosters innovation across industries.",
  },
  {
    title: "Our Mission",
    body: "IEEE's core purpose is to foster technological innovation and excellence for the benefit of humanity. We aim to inspire a global community through IEEE's highly cited publications, conferences, technology standards, and professional and educational activities.",
  },
  {
    title: "Our Vision",
    body: "IEEE is essential to the global technical community and to technical professionals everywhere, and is universally recognized for the contributions of technology and of technical professionals in improving global conditions.",
  },
];

export interface Benefit {
  title: string;
  body: string;
}

export const benefits: Benefit[] = [
  {
    title: "Travel Grants, Scholarships & Fellowships",
    body: "IEEE offers generous travel grants for student members to attend premium international conferences and present research papers, alongside academic scholarships and research fellowships.",
  },
  {
    title: "IEEE eLearning Library Access",
    body: "Unlock online access to a massive repository of peer-reviewed instructional courses, tutorials, and materials spanning core engineering disciplines, robotics, and emerging technologies.",
  },
  {
    title: "Global Standards Exposure",
    body: "Access globally recognized standards that shape interoperability and product reliability. Learn standard development practices and collaborate on consensus processes that guide global technology.",
  },
];

export interface BranchEvent {
  title: string;
  tag: string;
  body: string;
}

export const events: BranchEvent[] = [
  {
    title: ">.hack();_",
    tag: "Flagship Hackathon",
    body: "The annual flagship event of IEEE MACE SB, a cornerstone of the branch for the past seven years. Each edition gives college students a platform to turn ideas into impactful projects, and every year has brought a larger crop of innovative solutions from our budding engineers.",
  },
  {
    title: "SPARC",
    tag: "Speaker Series",
    body: "Conducted for the past five years and designed primarily for first-year students. Accomplished speakers from diverse fields share their experiences, insights and guidance, giving students perspective on personal growth, career planning and the opportunities ahead.",
  },
  {
    title: "STEM Initiative",
    tag: "School Outreach",
    body: "Interactive workshops, demonstrations and hands-on sessions that take STEM to school students across IoT and embedded systems, mechatronics, software development, and cybersecurity and data analytics. Each year the initiative reaches nearly 500 students across five schools.",
  },
  {
    title: "Hack-Her",
    tag: "Women In Tech",
    body: "A 24-hour ideation and implementation challenge exclusively for women, answering the under-representation of women in engineering and technology. Beyond technical skill it builds confidence, leadership, networking and peer learning.",
  },
  {
    title: "Hack-a-addict",
    tag: "Social Impact Hackathon",
    body: "A hackathon organised with the Lions Club to raise awareness of drug abuse and its effects. Participants proposed technically feasible, socially relevant ideas for prevention, awareness and rehabilitation while learning the real consequences of substance abuse.",
  },
  {
    title: "Light the Lives (LTL)",
    tag: "Humanitarian Project",
    body: "Kuttampuzha Grama Panchayat lacked access to reliable energy resources. With approval from the local authorities, a team of volunteers stayed in the locality for a week and installed two solar power systems, giving the community a dependable and sustainable source of electricity.",
  },
  {
    title: "Connect the Lives (CTL)",
    tag: "Humanitarian Project",
    body: "After LTL, the tribal colony at Uriyampetty raised the problem of children with limited access to schooling. A detailed survey led to a communication module at the local school for online classes, run by a trained resident teacher. A year on, it still serves the community.",
  },
  {
    title: "Fauna Flash",
    tag: "Humanitarian Technology",
    body: "An early warning system developed under the leadership of Madhav K. Anil that detects elephant movement in forest fringe areas and alerts nearby communities in real time, cutting the risk of human–elephant encounters and supporting coexistence.",
  },
  {
    title: "Enhance their Lives (ETL)",
    tag: "Upcoming Initiative",
    body: "A planned programme to establish sanitary pad incinerators and proper waste disposal systems in remote schools and underserved localities, offering a safe and environmentally responsible option while promoting menstrual hygiene awareness.",
  },
];

export interface ExecomMember {
  name: string;
  role: string;
  /** Blank when the member publishes no address — the plate then shows `unit`. */
  email: string;
  /** Blank when the member publishes no number — the plate then shows `unit`. */
  phone: string;
  /** Shown in the third spec row when neither email nor phone is published. */
  unit: string;
  /** File name inside /public/team, served as-is; empty renders the monogram. */
  photo: string;
}

export const execom: ExecomMember[] = [
  {
    name: "Prof. Neethu Salim",
    role: "Student Branch Counsellor",
    email: "",
    phone: "",
    unit: "IEEE MACE SB",
    photo: "neethu-salim.webp",
  },
  {
    name: "Jes Gigo",
    role: "Student Branch Chair",
    email: "jesgigo10@ieee.org",
    phone: "+91 88486 68497",
    unit: "IEEE MACE SB",
    photo: "jes-gigo.webp",
  },
  {
    name: "Jassim Mohammed Salim",
    role: "Vice Chair",
    email: "jassimmohdsalim@ieee.org",
    phone: "+91 70341 47924",
    unit: "IEEE MACE SB",
    photo: "jassim-mohammed-salim.webp",
  },
  {
    name: "Ryan Nelson",
    role: "Secretary",
    email: "ryannelson@ieee.org",
    phone: "+91 94461 08674",
    unit: "IEEE MACE SB",
    photo: "ryan-nelson.webp",
  },
  {
    name: "Navya Maria Vincent",
    role: "Joint Secretary",
    email: "navyamariavincent@ieee.org",
    phone: "+91 62382 85215",
    unit: "IEEE MACE SB",
    photo: "navya-maria-vincent.webp",
  },
  {
    name: "Joseph Hamlin",
    role: "Treasurer",
    email: "jhamlim@ieee.org",
    phone: "+91 85901 46947",
    unit: "IEEE MACE SB",
    photo: "joseph-hamlin.webp",
  },
];

/**
 * Extended 2026 Executive Committee roster (31 members) — every domain
 * coordinator and IEEE society/affinity group Chair + Secretary pair, beyond
 * the 5 Student Branch officers already shown in `execom` above (the source
 * PDF lists 36 total; the 5 officers are excluded here to avoid showing them
 * twice on the Team page). Source: docs/IEEE MACE SB ExeCom 2026.pdf.
 *
 * No contact info here by design (unlike `execom`) — only name/designation/
 * class are published for the extended roster.
 *
 * `group` drives the collapsible sections on the Team page — one group per
 * role/society, shown in `GROUP_ORDER` order (see ExecomGroups.tsx).
 */
export interface ExecomFullMember {
  /** Which collapsible group this member is listed under on the Team page. */
  group: string;
  designation: string;
  name: string;
  class: string;
  /** File name inside /public/team, served as-is; empty renders the monogram. */
  photo: string;
}

export const execomFull: ExecomFullMember[] = [
  { group: "Webmasters", designation: "Webmaster", name: "Devadathan MR", class: "S5 DS", photo: "" },
  { group: "Webmasters", designation: "Webmaster", name: "Niranjan V S", class: "S3 DSA", photo: "" },
  { group: "Webmasters", designation: "Webmaster", name: "Josin Jojy", class: "S3 AI", photo: "" },
  { group: "Membership Development Coordinator", designation: "Membership Development Coordinator", name: "Navaneetha Sinoj", class: "S5 LA", photo: "" },
  { group: "Electronic Communications Coordinator", designation: "Electronic Communications Coordinator", name: "Noel Eldho Nommy", class: "S3 CS", photo: "" },
  { group: "Electronic Communications Coordinator", designation: "Electronic Communications Coordinator", name: "Shyamjth CP", class: "S5 CA", photo: "" },
  { group: "Social Media Manager", designation: "Social Media Manager", name: "Alphin Philip", class: "S5 LA", photo: "" },
  { group: "Social Media Manager", designation: "Social Media Manager", name: "Gouri S Prakash", class: "S5 LB", photo: "" },
  { group: "Program Coordinator", designation: "Program Coordinator", name: "Mohammed Aflah T", class: "S5 CS", photo: "" },
  { group: "Technical Coordinator", designation: "Technical Coordinator", name: "Sreehari Jayan", class: "S7 EB", photo: "" },
  { group: "Projects and Lab Coordinator", designation: "Projects and Lab Coordinator", name: "Madhav K Anil", class: "S5 LA", photo: "" },
  { group: "Computer Society", designation: "Computer Society Chair", name: "Ameena R", class: "S7 DS", photo: "" },
  { group: "Computer Society", designation: "Computer Society Secretary", name: "Adithya Krishna", class: "S5 EB", photo: "" },
  { group: "Communications Society", designation: "Communications Society Chair", name: "Sooraj N S", class: "S5 EB", photo: "" },
  { group: "Communications Society", designation: "Communications Society Secretary", name: "Meritta Elizabeth S", class: "S5 LA", photo: "" },
  { group: "Robotics and Automation Society", designation: "Robotics and Automation Society Chair", name: "Kalyani B", class: "S5 LB", photo: "" },
  { group: "Robotics and Automation Society", designation: "Robotics and Automation Society Secretary", name: "Sivapriya P H", class: "S5 LB", photo: "" },
  { group: "Power and Energy Society", designation: "Power and Energy Society Chair", name: "Adwaith T M", class: "S5 AI", photo: "" },
  { group: "Power and Energy Society", designation: "Power and Energy Society Secretary", name: "Hridhya Elizabeth", class: "S3 LB", photo: "" },
  { group: "Industry Applications Society", designation: "Industry Applications Society Chair", name: "Deeya Saju", class: "S5 DS", photo: "" },
  { group: "Industry Applications Society", designation: "Industry Applications Society Secretary", name: "Abhishek C S", class: "S5 LA", photo: "" },
  { group: "IE/PELS Joint Chapter", designation: "IE/PELS Jt. Chapter Chair", name: "Gauthami C", class: "S5 LB", photo: "" },
  { group: "IE/PELS Joint Chapter", designation: "IE/PELS Jt. Chapter Secretary", name: "Jinta Maria Joby", class: "S3 DSB", photo: "" },
  { group: "Signal Processing Society", designation: "Signal Processing Society Chair", name: "Alwafa Ziyad", class: "S5 LB", photo: "" },
  { group: "Signal Processing Society", designation: "Signal Processing Society Secretary", name: "Shreya Zubin Nair", class: "S3 DS", photo: "" },
  { group: "Women in Engineering (WiE)", designation: "WiE Affinity Group Chair", name: "Shifa Usman", class: "S5 DS", photo: "" },
  { group: "Women in Engineering (WiE)", designation: "WiE Affinity Group Secretary", name: "Alna Biju Gregory", class: "S5 CS", photo: "" },
  { group: "SIGHT", designation: "SIGHT Chair", name: "Abhishek K M", class: "S7 EA", photo: "" },
  { group: "SIGHT", designation: "SIGHT Secretary", name: "George Sunibabu", class: "S5 LB", photo: "" },
  { group: "Vehicular Technology Society", designation: "Vehicular Technology Society Chair", name: "Leethiya Francis", class: "S5 EB", photo: "" },
  { group: "Vehicular Technology Society", designation: "Vehicular Technology Society Secretary", name: "Akash I", class: "S7 MB", photo: "" },
];

/**
 * The one width every poster is encoded at. A poster renders ~300 CSS px wide at
 * most, so 720 covers a 2x desktop plate and a 3x phone from a single file; the
 * repo keeps one image per poster and nothing else.
 */
export const POSTER_WIDTH = 720;

export interface GalleryPoster {
  /** Source file inside /images — the optimizer's input. */
  source: string;
  /** Output basename under /public/gallery, also the manifest key. */
  slug: string;
  title: string;
  tag: string;
}

/**
 * Event posters, ordered for the reel — mixed portrait/square on purpose so the
 * strip never reads as a uniform grid. Rendered sizes come from the generated
 * manifest (`npm run gallery`), never from this list.
 */
export const galleryPosters: GalleryPoster[] = [
  {
    source: "akiassc-2026.jpeg",
    slug: "akiassc-2026",
    title: "AKIASSC 2026 — Industry & Entrepreneurship",
    tag: "IAS · Student Conclave",
  },
  {
    source: "error-404-debugging.jpeg",
    slug: "error-404-debugging",
    title: "Error 404 — Debugging Competition",
    tag: "Computer Society · Contest",
  },
  {
    source: "connect-the-lives.jpeg",
    slug: "connect-the-lives",
    title: "Connect the Lives — Uriyampetty",
    tag: "SIGHT · Humanitarian Project",
  },
  {
    source: "morse-code-contest.jpeg",
    slug: "morse-code-contest",
    title: "Morse Code Contest",
    tag: "IE/PELS · Technical Contest",
  },
  {
    source: "ai-robotics-space-sustainability.jpeg",
    slug: "ai-robotics-space-sustainability",
    title: "AI Robotics for Space Sustainability",
    tag: "RAS · Distinguished Lecture",
  },
  {
    source: "women-in-tech-beyond-stereotypes.jpeg",
    slug: "women-in-tech-beyond-stereotypes",
    title: "Women in Tech — Beyond the Stereotypes",
    tag: "ComSoc · Talk Session",
  },
  {
    source: "environment-day.jpeg",
    slug: "environment-day",
    title: "Environment Day",
    tag: "SIGHT · Community Outreach",
  },
  {
    source: "pes-day-2026.jpeg",
    slug: "pes-day-2026",
    title: "IEEE PES Day 2026",
    tag: "PES · Online Session",
  },
  {
    source: "sps-world-of-opportunities.jpeg",
    slug: "sps-world-of-opportunities",
    title: "IEEE SPS World of Opportunities",
    tag: "SPS · Interactive Talk",
  },
  {
    source: "a-robo-roadmap.jpeg",
    slug: "a-robo-roadmap",
    title: "A Robo Roadmap — Passion to Profession",
    tag: "RAS · Talk Session",
  },
  {
    source: "women-leading-innovation.jpeg",
    slug: "women-leading-innovation",
    title: "Women Leading Innovation for Sustainable Development",
    tag: "WIE · Panel Discussion",
  },
  {
    source: "linkedin-industry-success.jpeg",
    slug: "linkedin-industry-success",
    title: "Engineering Your Professional Identity",
    tag: "IAS · Career Session",
  },
  {
    source: "power-electronics-talk.jpeg",
    slug: "power-electronics-talk",
    title: "The Technology Behind Modern Grid Systems",
    tag: "IE/PELS · Talk Session",
  },
  {
    source: "farewell-2026.jpeg",
    slug: "farewell-2026",
    title: "Farewell — >.hack(); Team",
    tag: "Student Branch · Community",
  },
  {
    source: "informatyka-agentic-ai.jpeg",
    slug: "informatyka-agentic-ai",
    title: "Beginner's Guide to Agentic AI & n8n",
    tag: "Informatyka 6.0 · Talk Session",
  },
  {
    source: "understanding-gender-reality.jpeg",
    slug: "understanding-gender-reality",
    title: "Understanding Gender Reality",
    tag: "WIE · Awareness Session",
  },
  {
    source: "distinguished-lecture-deep-learning.jpeg",
    slug: "distinguished-lecture-deep-learning",
    title: "From Pixels to Decisions — Deep Learning",
    tag: "SPS · Distinguished Lecture",
  },
  {
    source: "sps-scholarship-guidance.jpeg",
    slug: "sps-scholarship-guidance",
    title: "Unlocking Opportunities — SPS Scholarships",
    tag: "SPS · Guidance Session",
  },
  {
    source: "ethical-ai-session-1.jpeg",
    slug: "ethical-ai-session-1",
    title: "Session 1 — Ethical AI",
    tag: "WIE Profept · Session Series",
  },
  {
    source: "the-power-quest.jpeg",
    slug: "the-power-quest",
    title: "The Power Quest",
    tag: "PES Day · Quiz",
  },
  {
    source: "linkedin-industry-success-rescheduled.jpeg",
    slug: "linkedin-industry-success-rescheduled",
    title: "Engineering Your Professional Identity — Rescheduled",
    tag: "IAS · Career Session",
  },
  {
    source: "ev-career-pathways.jpeg",
    slug: "ev-career-pathways",
    title: "Career Pathways in EV & Automotive Industry",
    tag: "VTS · Talk Session",
  },
];

export interface Chapter {
  name: string;
  body: string;
  url: string;
}

export const chapters: Chapter[] = [
  {
    name: "Computer Society",
    body: "The IEEE Computer Society serves as a leading hub for knowledge, innovation, and community among computer science and engineering professionals globally. It supports individuals across all career stages with essential resources.",
    url: "https://www.computer.org",
  },
  {
    name: "Robotics and Automation Society (RAS)",
    body: "The IEEE Robotics and Automation Society (RAS) dedicates itself to advancing robotics and automation through scientific and technological knowledge exchange, promoting benefits to the profession and society.",
    url: "https://www.ieee-ras.org",
  },
  {
    name: "Signal Processing Society (SPS)",
    body: "The IEEE Signal Processing Society (SPS) leads advancements in signal processing and machine learning. It promotes global research, education, and collaboration among engineers and scientists.",
    url: "https://signalprocessingsociety.org",
  },
  {
    name: "Communications Society (ComSoc)",
    body: "The IEEE Communications Society facilitates technological innovation and global information exchange among technical professionals. It supports member development through educational resources.",
    url: "https://www.comsoc.org",
  },
  {
    name: "Industry Applications Society (IAS)",
    body: "The IEEE Industry Applications Society leads in advancing theory and practice for safe, sustainable, reliable, and smart electrical systems worldwide, supporting technology designs and manufacturing.",
    url: "https://ias.ieee.org",
  },
  {
    name: "Power & Energy Society (PES)",
    body: "The IEEE Power & Energy Society (PES) serves as a premier global platform for advancing technological innovations in the electric power industry, setting standards and transmission research.",
    url: "https://www.ieee-pes.org",
  },
  {
    name: "IE/PELS Joint Chapter",
    body: "The IEEE Power Electronics Society (PELS) and Industry Electronics Society (IES) joint chapter advances electronic power conversion and enhances industrial processes through control systems.",
    url: "https://www.ieee-pels.org",
  },
  {
    name: "Women in Engineering (WIE)",
    body: "IEEE Women in Engineering (WIE) is a global network committed to promoting women in engineering and science, inspiring girls to pursue technical careers and fostering a diverse community.",
    url: "https://wie.ieee.org",
  },
  {
    name: "SIGHT Group",
    body: "The IEEE Special Interest Group on Humanitarian Technology (SIGHT) is a global network of IEEE volunteers partnering with underserved communities to leverage technology for sustainable development.",
    url: "https://sight.ieee.org",
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const aboutStats: Stat[] = [
  { value: 300, suffix: "+", label: "Members" },
  { value: 38, suffix: "", label: "Years legacy" },
  { value: 1988, suffix: "", label: "Established" },
];
