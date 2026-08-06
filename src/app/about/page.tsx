import type { Metadata } from "next";
import { SectionAnimations } from "@/components/animation/SectionAnimations";
import { AboutStats } from "@/components/about/AboutStats";
import { SocietiesGrid } from "@/components/about/SocietiesGrid";
import { CircuitTimeline } from "@/components/about/CircuitTimeline";

export const metadata: Metadata = {
  description:
    "The legacy of Mar Athanasius College of Engineering and IEEE Student Branch MACE, plus the IEEE Societies and Affinity Groups we cover.",
};

export default function AboutPage() {
  return (
    <SectionAnimations>
      <section
        className='about section'
        id='about'
        aria-labelledby='about-heading'
      >
        <div className='container'>
          <header className='section__head'>
            <p className='eyebrow'>Institutional Heritage</p>
            <h2 className='section__title' id='about-heading'>
              About <span className='outline'>MACE</span> &amp; <br />
              IEEE <span className='outline'>MACE</span> SB
            </h2>
            <p className='section__subtext'>
              Discover the legacy of engineering leadership and professional
              development that defines our institution.
            </p>
          </header>

          <CircuitTimeline />

          <div className='about__blocks'>
            <article className='sheet sheet--tilt-l' data-reveal>
              <p className='sheet__tag'>MACE Legacy</p>
              <h3 className='sheet__title'>
                Mar Athanasius College of Engineering
              </h3>
              <p>
                Mar Athanasius College of Engineering pioneered engineering
                education in central Kerala in 1961. Managed by the Mar
                Athanasius College Association and aided by the Government of
                Kerala, the college was the first in Asia under Christian
                management.
              </p>
              <p>
                Affiliated to APJ Abdul Kalam Technological University, MACE has
                grown to host six full-fledged departments alongside auxiliary
                departments of Mathematics, and Science and Humanities.
              </p>
              <div className='sheet__titleblock' aria-hidden='true'>
                <span>
                  <b>ESTD</b>1961
                </span>
                <span>
                  <b>LOC</b>KOTHAMANGALAM, KERALA
                </span>
                <span>
                  <b>SHEET</b>A-01
                </span>
              </div>
            </article>
            <article className='sheet sheet--tilt-r' data-reveal>
              <p className='sheet__tag'>IEEE MACE SB</p>
              <h3 className='sheet__title'>
                Pioneering Professional Excellence
              </h3>
              <p>
                Established on November 17th, 1988, the IEEE Student Branch MACE
                (Code: 32041) has served the student community for the past 38
                years, consistently aligning its initiatives with the vision and
                mission of IEEE — advancing technology for the benefit of
                humanity.
              </p>
              <p>
                Driven by a team of passionate engineering students committed to
                learning and excellence, we ensure that every initiative helps
                members develop their technical and professional skills while
                empowering them to contribute meaningfully to an ever-evolving
                world of technology. From hackathons and technical workshops to
                community outreach and social initiatives, every event is
                designed to create opportunities for learning, innovation, and
                collaboration.
              </p>
              <p>
                We offer a dedicated Hardware Laboratory for technical project
                development and regularly conduct training programs, talks,
                professional awareness sessions, hackathons, debates, and
                workshops.
              </p>
              <div className='sheet__titleblock' aria-hidden='true'>
                <span>
                  <b>ESTD</b>1988
                </span>
                <span>
                  <b>CODE</b>32041
                </span>
                <span>
                  <b>SHEET</b>A-02
                </span>
              </div>
            </article>
          </div>

          <AboutStats />
        </div>
      </section>

      <section
        className='chapters section'
        id='societies'
        aria-labelledby='chapters-heading'
      >
        <div className='container'>
          <header className='section__head'>
            <p className='eyebrow'>Subdivisions</p>
            <h2 className='section__title' id='chapters-heading'>
              Societies &amp; <span className='outline'>Affinity Groups</span>
            </h2>
            <p className='section__subtext'>
              Our Student Branch consists of multiple IEEE Societies and
              Affinity Groups, providing specialized training and networking
              opportunities in various tech domains.
            </p>
          </header>
          <SocietiesGrid />
        </div>
      </section>
    </SectionAnimations>
  );
}
