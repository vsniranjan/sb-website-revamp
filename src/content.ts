// Repeated card-grid content. Hero/About/Contact/Footer copy lives in index.html.
// Source: CONTENT.md — keep copy verbatim when editing.

export interface IntroCard {
  title: string
  body: string
}

export const introCards: IntroCard[] = [
  {
    title: 'What is IEEE?',
    body: 'IEEE is a global organization that develops standards to ensure the consistency, compatibility, and interoperability of technology. Covering electronics, telecommunications, and computing, IEEE enhances product reliability and fosters innovation across industries.',
  },
  {
    title: 'Our Mission',
    body: "IEEE's core purpose is to foster technological innovation and excellence for the benefit of humanity. We aim to inspire a global community through IEEE's highly cited publications, conferences, technology standards, and professional and educational activities.",
  },
  {
    title: 'Our Vision',
    body: 'IEEE is essential to the global technical community and to technical professionals everywhere, and is universally recognized for the contributions of technology and of technical professionals in improving global conditions.',
  },
]

export interface Benefit {
  title: string
  body: string
}

export const benefits: Benefit[] = [
  {
    title: 'Travel Grants, Scholarships & Fellowships',
    body: 'IEEE offers generous travel grants for student members to attend premium international conferences and present research papers, alongside academic scholarships and research fellowships.',
  },
  {
    title: 'IEEE eLearning Library Access',
    body: 'Unlock online access to a massive repository of peer-reviewed instructional courses, tutorials, and materials spanning core engineering disciplines, robotics, and emerging technologies.',
  },
  {
    title: 'Global Standards Exposure',
    body: 'Access globally recognized standards that shape interoperability and product reliability. Learn standard development practices and collaborate on consensus processes that guide global technology.',
  },
]

export interface BranchEvent {
  title: string
  tag: string
  body: string
}

export const events: BranchEvent[] = [
  {
    title: 'MACEHACK 2026',
    tag: 'Flagship Hackathon',
    body: 'Our premier 24-hour national hackathon, bringing together top student developers and designers to build innovative hardware and software solutions under intense timelines. Featuring mentorship, networking opportunities, and attractive cash prizes.',
  },
  {
    title: 'RoboVerse School',
    tag: 'Robotics Workshop',
    body: 'Hands-on robotics bootcamps introducing students to microcontrollers, embedded systems, and autonomous navigation architectures. Participants build and program their own functional robots from scratch.',
  },
  {
    title: 'MACE Conclave',
    tag: 'Conferences & Conclaves',
    body: 'A premier technological conference featuring keynote panels from distinguished IEEE Fellows and industrial tech leaders. Discussing future tech domains, research breakthroughs, and professional growth.',
  },
  {
    title: 'V-Tour (Industrial Visit)',
    tag: 'Industrial Visits',
    body: 'Experiential industrial visits to national research laboratories, tech parks, and advanced smart factories to study automation, industrial assembly processes, and telemetry operations in real-world environments.',
  },
  {
    title: 'SIGHT Clean Energy',
    tag: 'Humanitarian Initiatives',
    body: 'Community initiatives installing smart, solar-powered lighting systems and clean energy alternatives in local rural clinics, government schools, and underserved neighborhoods.',
  },
  {
    title: 'SkillUp Bootcamp',
    tag: 'Skill Development Programs',
    body: 'Intensive training program covering fullstack software engineering, cloud architecture, technical writing, and professional interview preparation to help students secure global opportunities.',
  },
]

export interface ExecomMember {
  name: string
  role: string
  email: string
  linkedin: string
  /** Path to a headshot; empty string renders the initials monogram. */
  photo: string
}

export const execom: ExecomMember[] = [
  { name: 'Dr. Bos Mathew Jos', role: 'Branch Counselor', email: 'bosmathew@mace.ac.in', linkedin: '#', photo: '' },
  { name: 'Eldho P. John', role: 'Student Branch Chair', email: 'chair@ieeemace.org', linkedin: '#', photo: '' },
  { name: 'Maria Theresa', role: 'Vice Chair', email: 'vicechair@ieeemace.org', linkedin: '#', photo: '' },
  { name: 'Albin George', role: 'Secretary', email: 'secretary@ieeemace.org', linkedin: '#', photo: '' },
  { name: 'Anjali Krishna', role: 'Treasurer', email: 'treasurer@ieeemace.org', linkedin: '#', photo: '' },
  { name: 'Nevin Joseph', role: 'Joint Secretary', email: 'jointsecretary@ieeemace.org', linkedin: '#', photo: '' },
]

export const galleryPosters: string[] = [
  'MACEHACK 2026',
  'RoboVerse School',
  'MACE Conclave',
  'V-Tour Industrial Visit',
  'SIGHT Clean Energy',
  'SkillUp Bootcamp',
  'Women In Tech Conclave',
  'IEEE Standards Hackathon',
]

export interface Chapter {
  name: string
  body: string
  url: string
}

export const chapters: Chapter[] = [
  {
    name: 'Computer Society',
    body: 'The IEEE Computer Society serves as a leading hub for knowledge, innovation, and community among computer science and engineering professionals globally. It supports individuals across all career stages with essential resources.',
    url: 'https://www.computer.org',
  },
  {
    name: 'Robotics and Automation Society (RAS)',
    body: 'The IEEE Robotics and Automation Society (RAS) dedicates itself to advancing robotics and automation through scientific and technological knowledge exchange, promoting benefits to the profession and society.',
    url: 'https://www.ieee-ras.org',
  },
  {
    name: 'Signal Processing Society (SPS)',
    body: 'The IEEE Signal Processing Society (SPS) leads advancements in signal processing and machine learning. It promotes global research, education, and collaboration among engineers and scientists.',
    url: 'https://signalprocessingsociety.org',
  },
  {
    name: 'Communications Society (ComSoc)',
    body: 'The IEEE Communications Society facilitates technological innovation and global information exchange among technical professionals. It supports member development through educational resources.',
    url: 'https://www.comsoc.org',
  },
  {
    name: 'Industry Applications Society (IAS)',
    body: 'The IEEE Industry Applications Society leads in advancing theory and practice for safe, sustainable, reliable, and smart electrical systems worldwide, supporting technology designs and manufacturing.',
    url: 'https://ias.ieee.org',
  },
  {
    name: 'Power & Energy Society (PES)',
    body: 'The IEEE Power & Energy Society (PES) serves as a premier global platform for advancing technological innovations in the electric power industry, setting standards and transmission research.',
    url: 'https://www.ieee-pes.org',
  },
  {
    name: 'IE/PELS Joint Chapter',
    body: 'The IEEE Power Electronics Society (PELS) and Industry Electronics Society (IES) joint chapter advances electronic power conversion and enhances industrial processes through control systems.',
    url: 'https://www.ieee-pels.org',
  },
  {
    name: 'Women in Engineering (WIE)',
    body: 'IEEE Women in Engineering (WIE) is a global network committed to promoting women in engineering and science, inspiring girls to pursue technical careers and fostering a diverse community.',
    url: 'https://wie.ieee.org',
  },
  {
    name: 'SIGHT Group',
    body: 'The IEEE Special Interest Group on Humanitarian Technology (SIGHT) is a global network of IEEE volunteers partnering with underserved communities to leverage technology for sustainable development.',
    url: 'https://sight.ieee.org',
  },
]

export interface Stat {
  value: number
  suffix: string
  label: string
}

export const aboutStats: Stat[] = [
  { value: 300, suffix: '+', label: 'Members' },
  { value: 35, suffix: '+', label: 'Years legacy' },
  { value: 1988, suffix: '', label: 'Established' },
]
