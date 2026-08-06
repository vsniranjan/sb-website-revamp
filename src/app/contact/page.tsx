import type { Metadata } from "next";
import { SectionAnimations } from "@/components/animation/SectionAnimations";
import { ContactConsole } from "@/components/contact/ContactConsole";

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
            <ContactConsole />
          </div>
        </div>
      </section>
    </SectionAnimations>
  );
}
