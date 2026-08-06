import type { Metadata } from "next";
import { SectionAnimations } from "@/components/animation/SectionAnimations";

export const metadata: Metadata = {
  description:
    "Get in touch with IEEE MACE SB — Student Branch Headquarters at Mar Athanasius College of Engineering, Kothamangalam.",
};

export default function ContactPage() {
  return (
    <SectionAnimations>
      <section
        className='contact section'
        id='contact'
        aria-labelledby='contact-heading'
      >
        <div className='container'>
          <header className='section__head'>
            <p className='eyebrow'>Get In Touch</p>
            <h2 className='section__title' id='contact-heading'>
              Connect With <span className='outline'>Our Team</span>
            </h2>
            <p className='section__subtext'>
              Have questions about membership, events, or collaboration? Reach
              out to us through any of the channels below.
            </p>
          </header>
          <div className='contact__layout'>
            <address className='console' data-reveal>
              <p className='console__head' aria-hidden='true'>
                TRANSMISSION // IEEE-MACE-SB
              </p>
              <div className='console__line'>
                <p className='console__label'>Student Branch Headquarters</p>
                <p className='console__value'>
                  Mar Athanasius College of Engineering, Kothamangalam, Kerala -
                  686666, India
                </p>
              </div>
              <div className='console__line'>
                <p className='console__label'>Call Us</p>
                <p className='console__value'>
                  <a href='tel:+918921931121'>+91 8921931121</a>
                </p>
              </div>
              <div className='console__line'>
                <p className='console__label'>Email Us</p>
                <p className='console__value'>
                  <a href='mailto:ieeemacesbofficial@gmail.com'>
                    ieeemacesbofficial@gmail.com
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>
      </section>
    </SectionAnimations>
  );
}
