# Design brief: IEEE MACE Student Branch website

Paste everything below the line into the AI site designer.

---

Design a single-page website for the IEEE MACE Student Branch, the IEEE student chapter at Model Engineering College in Kochi, Kerala, India.

## What I want

The current site is cluttered. Far too much text, and the background is covered in drawings that look like scribbling. It is also terrible on mobile. I want a complete redesign: minimalistic and elegant. It must not look generic, and it must not look AI-generated. That last point matters more to me than anything else. I would rather have something restrained and unusual than something busy and templated.

Mobile is the primary target, not an afterthought. Design the phone layout first and let the desktop layout follow from it. Assume most visitors are students on a phone.

## Non-negotiable brand constraint

IEEE Blue, hex `#00629B`. This is mandated by the IEEE Brand Identity Guidelines for student branches. It is the only accent colour on the page. Do not introduce a second accent. Everything else should be neutral: an off-white and a near-black, neither of them pure `#ffffff` or `#000000`.

## The thing that makes this branch worth a website

Do not open with generic IEEE boilerplate about standards and global technical communities. Every IEEE branch page says that and it says nothing. This branch does field work in rural Kerala, and that is the story:

- **Light the Lives** (2019). Volunteers lived for a week in Kuttampuzha panchayat and installed two solar power systems in a community that had no reliable electricity.
- **Connect the Lives** (2021). After a survey of a tribal colony at Uriyampetty, they built a communication module at the local school so children could attend online classes, run by a trained resident teacher. It is still running.
- **Wild Elephant Tracker.** An early warning system that detects elephant movement at forest fringes and alerts nearby communities in real time, reducing human-elephant encounters.
- **Enhance their Lives** (upcoming). Sanitary pad incinerators and waste disposal systems for remote schools, alongside menstrual hygiene awareness.

Lead with this material.

## Content the site must carry

**Identity.** IEEE MACE Student Branch. Model Engineering College, Kochi. Chartered 1988. 38 years. 300+ members. 9 technical chapters. These are the only real numbers; do not invent additional precise-sounding statistics.

**Flagship events (5).**
- `>.hack();` the annual hackathon, 7 years running
- SPARC, a speaker series aimed at first-year students, 5 years running
- STEM Initiative, school outreach reaching roughly 500 students across 5 schools a year
- Hack-Her, a 24-hour hackathon for women, answering under-representation in engineering
- HACK-A-DDIT, a hackathon with the Lions Club on drug abuse awareness

**Field projects (4).** The four listed above.

**Technical chapters (9).** Computer Society, Robotics and Automation (RAS), Signal Processing (SPS), Communications (ComSoc), Industry Applications (IAS), Power and Energy (PES), IE/PELS Joint Chapter, Women in Engineering (WIE), SIGHT Group. Each links out to its parent society site.

**Executive committee (6).** Prof. Neethu Salim (Student Branch Counsellor), Jes Gigo (Chair), Jassim Mohammed Salim (Vice Chair), Ryan Nelson (Secretary), Navya Maria Vincent (Joint Secretary), Joseph Hamlin (Treasurer). Each has a photograph. All except the Counsellor publish an email and phone number.

**Why join (3).** Travel grants and scholarships for international conferences. IEEE eLearning Library access. Exposure to global technical standards.

**Event gallery.** 22 event posters, mixed portrait and square, roughly 720px wide. These are real designed posters, not photographs.

**Contact and footer.** Branch email, college address, social links.

## Copy length

This is the core of the clutter problem. Every item above currently carries a 40 to 60 word paragraph, and that is why the site feels dense. Cap body copy at roughly 12 to 15 words per item. If something genuinely needs more, hide it behind an interaction rather than printing it on the page. Headlines should run 8 words or fewer.

## Assets available

- IEEE MACE logo, SVG
- 6 executive committee photographs, roughly square
- 22 event posters, mixed portrait and square

There is **no photography of the field projects**. No pictures of the solar installation, the school, or the tracker deployment. If the design depends on that photography, say so explicitly, because it would have to be commissioned.

## Things that will make it read as AI-generated

Avoid all of these. This list is the difference between a distinctive site and a templated one.

- Em-dashes and en-dashes. Use a hyphen or restructure the sentence.
- Section-number labels above headings, such as `01 / INDEX` or `002 · Events`.
- Small uppercase wide-tracking eyebrow labels above every section. At most one per three sections; zero is better.
- Scroll cues. No `Scroll`, no `Scroll to explore`, no animated mouse-wheel icon.
- Custom mouse cursors.
- Decorative crosshairs, hairline grid overlays, technical-drawing flourishes, gauges, dials, rotors, or animated background sketches. This is exactly what the current site does wrong.
- Coloured status dots before list items or nav links.
- Locale, weather, or timestamp strips.
- A row of three equal feature cards.
- Long specification tables with a hairline rule under every single row.
- Fake product screenshots built from styled div rectangles.
- Pills, tags, or photo-credit captions overlaid on images.
- Version stamps such as `v1.4.2` or `BETA`.
- Text strips at the bottom of the hero, such as `DESIGN. BUILD. SHIP.`
- Purple and blue gradient glows, neon outer glows, generic glassmorphism on everything.
- Inter as the default typeface. Fraunces and Instrument Serif as display faces.
- Filler verbs: elevate, seamless, unleash, next-gen, revolutionize.
- Marketing phrasing like "Quietly trusted by" or poetic section labels like "Field notes".

## Technical requirements

- The hero must fit within the first viewport on a phone. Headline two lines maximum, supporting text 20 words maximum, and the primary call to action visible without scrolling.
- Navigation on a single line at desktop, 80px tall at most.
- No two sections should share the same layout pattern. Vary the composition down the page.
- Do not stack more than two consecutive alternating image-and-text rows.
- At most one horizontally scrolling element on the entire page.
- Use `min-height: 100dvh` rather than `100vh`, so the iOS Safari address bar does not cause layout jumps.
- Every animation needs a reason: hierarchy, sequence, or feedback. Motion for its own sake should be cut. Honour `prefers-reduced-motion: reduce`.
- Text must meet WCAG AA contrast, 4.5:1 for body text and 3:1 for large text. Any text sitting over an image needs a scrim behind it.
- One corner-radius system for the whole page, applied consistently.
- One theme for the whole page. Do not flip a light section into the middle of a dark page.

## Deliverable

A single responsive page. Show me the phone layout alongside the desktop layout. Explain the typeface choice and the reasoning behind the layout structure in a short note.
