import type { Metadata } from "next";
import { SectionAnimations } from "@/components/animation/SectionAnimations";
import { ReflexTest } from "@/components/playground/ReflexTest";
import { FunFactWheel } from "@/components/home/FunFactWheel";
import { SignalLostGame } from "@/components/not-found/SignalLostGame";

export const metadata: Metadata = {
  description:
    "A small interactive corner of the IEEE MACE SB site — spin for a fun fact, test your reflexes, jump some obstacles.",
};

export default function PlaygroundPage() {
  return (
    <SectionAnimations>
      <section
        className='playground section'
        id='playground'
        aria-labelledby='playground-heading'
      >
        <div className='container'>
          <header className='section__head'>
            <p className='eyebrow'>Just For Fun</p>
            <h2 className='section__title' id='playground-heading'>
              The <span className='outline'>Playground</span>
            </h2>
          </header>
          <div className='playground__layout'>
            <div className='playground__block' data-reveal>
              <p className='eyebrow'>Fun fact wheel</p>
              <FunFactWheel />
            </div>
            <div className='playground__block' data-reveal>
              <p className='eyebrow'>Reflex test</p>
              <ReflexTest />
            </div>
            <div className='playground__block' data-reveal>
              <p className='eyebrow'>Signal runner</p>
              <SignalLostGame />
            </div>
          </div>
        </div>
      </section>
    </SectionAnimations>
  );
}
