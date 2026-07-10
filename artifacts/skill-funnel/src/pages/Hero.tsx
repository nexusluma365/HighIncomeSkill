import { useRef, useState } from 'react';
import { Link } from 'wouter';
import georgeVideo from '../assets/media/george-web.mp4';
import naphtaliVideo from '../assets/media/naphtali-web.mp4';
import lumaVideo from '../assets/media/luma.mp4';
import heroVideo from '../assets/media/voice-ai-offer-hero.mp4';
import productImage from '../assets/media/product-image.png';
import georgePoster from '../assets/generated/george-thumb.jpg';
import naphtaliPoster from '../assets/generated/naphtali-thumb.jpg';
import spidermanPoster from '../assets/generated/spiderman-thumb.jpg';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Compass,
  FileText,
  LockKeyhole,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Star,
  TrendingDown,
  Users,
  Workflow,
} from 'lucide-react';

const heroProofPoints = [
  'Laptop + Phone Friendly',
  'Digital Skills Roadmap',
  'Build From Anywhere',
];

const learnItems = [
  {
    title: 'LEARN',
    copy: 'AI, websites, SEO, automation, digital products, business foundations, and modern online tools.',
  },
  {
    title: 'BUILD',
    copy: 'Projects, portfolio pieces, websites, ebooks, AI systems, automations, SEO projects, and digital assets that can work beyond one conversation.',
  },
  {
    title: 'CREATE OPPORTUNITIES',
    copy: 'Client offers, digital product ideas, business templates, prompt libraries, workflows, resources, and action plans.',
  },
];

const digitalWorldCards = [
  {
    title: 'Digital Products Are Not New',
    copy: 'If you have watched cable, streamed a show, listened to music in your car, bought an ebook, or played a course online, you have already paid attention to a digital product.',
  },
  {
    title: 'The Market Expanded',
    copy: 'Today people build on YouTube, websites, ebooks, courses, memberships, templates, automated services, and tools that can reach customers anywhere there is internet.',
  },
  {
    title: 'Skills Create Leverage',
    copy: 'Websites, SEO, AI, and automation help people create offers, serve clients, sell digital products, and build systems that are not limited to one physical location.',
  },
];

const transformationBullets = [
  'People are using digital skills to build client income, online stores, digital products, content channels, and automated services.',
  'Some people build five-figure months and beyond, but the real lesson is that skills create options. Results depend on action, execution, market, and consistency.',
  'A laptop, a phone, and internet access can now give someone a doorway into work, business, learning, and income opportunities from almost anywhere.',
  'This roadmap helps you stop watching the digital economy from the outside and start learning the pieces that make it work.',
];

const skillMatterBullets = [
  "You're working hard but still feel behind.",
  "You're tired of depending on overtime.",
  'You want another option.',
  'You want the ability to work from anywhere.',
  "You've watched people succeed online but never knew where to begin.",
  "You're willing to learn.",
  'You simply want a roadmap.',
];

const includes = [
  { icon: CalendarClock, label: '5 Focused Challenge Days' },
  { icon: MessageSquareText, label: 'Daily Confidence Prompts' },
  { icon: FileText, label: 'Templates & Scripts' },
  { icon: Workflow, label: 'AI Workflows' },
  { icon: Compass, label: '30-Day Action Plan' },
  { icon: Users, label: 'Private Student Community' },
];

const urgencyCosts = [
  'Every month you wait, someone else gains experience.',
  'Someone else builds confidence.',
  'Someone else creates opportunities.',
  'The world keeps moving.',
  'Technology keeps evolving.',
  "A year from now, you'll either be thankful you started or wish you had.",
];

const proofMessages = [
  {
    from: 'them',
    text: 'Eli thank you so much. The ebook you helped me put together has generated me $1,500 so far.',
  },
  {
    from: 'me',
    text: "That's whatsup. I'm glad I could help.",
  },
  {
    from: 'them',
    text: 'The Blueprint made it make sense. I stopped guessing and finally had an offer people understood.',
  },
];

const clientVideos = [
  {
    name: 'George',
    role: 'Website skill proof',
    poster: georgePoster,
    src: georgeVideo,
    type: 'video/mp4',
  },
  {
    name: 'Luma',
    role: 'Creative offer proof',
    poster: spidermanPoster,
    src: lumaVideo,
    type: 'video/mp4',
  },
  {
    name: 'Naphtali',
    role: 'Client result proof',
    poster: naphtaliPoster,
    src: naphtaliVideo,
    type: 'video/mp4',
  },
];

const videoFaqs = [
  {
    question: 'Is this beginner friendly?',
    answer:
      'Yes. This was built for beginners who want a clear place to start and a simple roadmap to follow.',
  },
  {
    question: 'Do I need experience?',
    answer:
      'No. You only need a willingness to learn and follow the roadmap one step at a time.',
  },
  {
    question: 'What equipment do I need?',
    answer:
      'A computer, internet access, and time to work through the resources are enough to begin.',
  },
  {
    question: 'What exactly will I learn?',
    answer:
      'You will learn how AI, websites, SEO, automation, business foundations, and modern online tools fit together inside one roadmap.',
  },
  {
    question: 'Can I learn at my own pace?',
    answer:
      'Yes. You get digital access, so you can move through it on your own schedule.',
  },
  {
    question: 'How long do I have access?',
    answer:
      'You get lifetime access to the digital products included with your purchase.',
  },
  {
    question: 'Is payment secure?',
    answer:
      'Yes. Payments are processed securely through Stripe. Your card information is not stored by this site.',
  },
  {
    question: 'What happens after purchase?',
    answer:
      'After payment is confirmed, your download button appears so you can save the digital product to your computer.',
  },
];

function CtaButton({ children, href = '/pain' }: { children: string; href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[64px] w-full max-w-[600px] items-center justify-center gap-3 rounded-[4px] border border-[#0b4c93] border-t-white/25 border-b-[#05264d] bg-[#0f7ee8] px-8 py-5 text-center text-lg font-black uppercase leading-tight tracking-[0.06em] text-white shadow-[0_8px_24px_rgba(15,126,232,0.38)] transition hover:-translate-y-0.5 hover:bg-[#1594ff] hover:shadow-[0_12px_30px_rgba(15,126,232,0.5)] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]"
    >
      <LockKeyhole size={18} strokeWidth={2.6} />
      {children}
      <ArrowRight size={18} strokeWidth={2.8} />
    </Link>
  );
}

function SectionHeading({
  kicker,
  title,
  accent,
  copy,
  dark = false,
}: {
  kicker?: string;
  title: string;
  accent?: string;
  copy?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-[1040px] text-center">
      {kicker && (
        <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-[#0f7ee8] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
          {kicker}
        </p>
      )}
      <h2 className={`text-[2rem] font-black uppercase leading-[1.05] tracking-[0.02em] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-5xl ${dark ? 'text-white' : 'text-[#07192f]'}`}>
        {title}
        {accent && <span className="text-[#0f7ee8]"> {accent}</span>}
      </h2>
      {copy && (
        <p className={`mx-auto mt-4 max-w-[760px] text-base font-semibold leading-[1.75] ${dark ? 'text-[#b8d5ee]' : 'text-[#425d78]'}`}>
          {copy}
        </p>
      )}
    </div>
  );
}

function VideoContainer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={togglePlayback}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          togglePlayback();
        }
      }}
      className="group relative mx-auto aspect-video w-full max-w-[780px] overflow-hidden rounded-[4px] border-4 border-[#173e69] bg-black shadow-[0_12px_48px_rgba(0,0,0,0.55)]"
      aria-label={isPlaying ? 'Pause video' : 'Play video'}
    >
      <video
        ref={videoRef}
        src={heroVideo}
        className={`h-full w-full object-cover transition duration-300 ${isPlaying ? 'opacity-100' : 'opacity-55'}`}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          lastTimeRef.current = Math.max(lastTimeRef.current, event.currentTarget.currentTime);
        }}
        onSeeking={(event) => {
          const video = event.currentTarget;
          if (video.currentTime < lastTimeRef.current) {
            video.currentTime = lastTimeRef.current;
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
      />
      <div className={`absolute inset-0 bg-black/40 transition duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
      <div className="absolute left-4 top-4 rounded-[3px] bg-[#0f7ee8] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
        Watch First
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition duration-300 ${isPlaying ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <span className="text-2xl font-black uppercase tracking-[0.08em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
          Click me
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="overflow-hidden bg-white text-[#07192f]">
      <header className="flex items-center justify-center bg-[#020812] px-6 py-4 text-center">
        <div className="text-2xl font-black uppercase tracking-[0.05em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
          Work From <span className="text-[#5ab8ff]">Home</span>
        </div>
      </header>

      <section className="bg-black px-5 py-10 text-center sm:px-8 sm:py-14">
        <p className="mb-1 text-sm font-black uppercase tracking-[0.08em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
          A Beginner-Friendly Roadmap To Creating More Opportunities
        </p>
        <p className="mb-5 text-sm font-black uppercase tracking-[0.08em] text-[#5ab8ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
          What if the opportunity you&apos;ve been waiting for starts with one decision today?
        </p>

        <h1 className="mx-auto max-w-[1000px] text-[2.4rem] font-black uppercase leading-[1.05] tracking-[0.02em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-[4rem]">
          STOP Trading More Hours
          <br />
          For <span className="text-[#5ab8ff]">More Money.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[780px] text-base font-semibold leading-[1.75] text-[#d6e7f6]">
          Digital skills are how people are building new income paths, traveling more, working from anywhere, and creating assets that can keep moving online. This roadmap was built to give you a clear place to start with a laptop, a phone, internet access, and the willingness to learn.
        </p>

        <div className="mx-auto mt-7 grid max-w-[850px] grid-cols-1 gap-3 sm:grid-cols-3">
          {heroProofPoints.map((point) => (
            <div
              key={point}
              className="flex min-h-[64px] items-center justify-center gap-3 rounded-[6px] border border-[#2f74ad]/50 bg-white/7 px-5 py-3 text-center text-sm font-black uppercase tracking-[0.04em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]"
            >
              <Star size={14} fill="currentColor" className="text-[#5ab8ff]" />
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-5 py-10 text-center sm:px-8 sm:py-14">
        <div>
          <div className="mx-auto mb-5 max-w-[760px]">
            <h2 className="text-3xl font-black uppercase tracking-[0.02em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">Watch This First</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#b8d5ee]">
              Before you decide, take a moment to see why this roadmap exists and what it can help you begin.
            </p>
          </div>
          <VideoContainer />
        </div>

        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>YES, SHOW ME WHERE TO START</CtaButton>
        </div>
        <p className="mt-3 text-xs font-semibold text-[#9cb6cb]">
          Educational content only. Results depend on your action, market, skill, and execution.
        </p>
      </section>

      <section className="bg-black px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Why I Built This Roadmap"
          title="The Story That Changed"
          accent="My Direction"
          dark
        />
        <div className="mx-auto mt-8 max-w-[760px] space-y-6 text-lg font-semibold leading-[1.8] text-[#b8d5ee]">
          <p>I grew up in a single-parent home, watching my mom do the best she could to provide for us on one income.</p>
          <p>We did not have much, but we always had enough to be thankful for. Seeing how hard she worked made me dream of a different life, not just for me, but for her too.</p>
          <p>When she bought me my first computer, I was hooked.</p>
          <p>I spent hours playing games, making music, and browsing the internet back when AOL was how everyone got online. Looking back, I had no idea that computer would end up changing the direction of my life.</p>
          <p>As the years went by, I started noticing a shift.</p>
          <p>More businesses were moving online. More people were building careers through the internet. Digital products were already around us, even if most of us did not call them that. The shows people watched, the music people bought, the downloads people used, and the websites people visited were all part of a world where attention could become a product.</p>
          <p>Technology kept evolving, and so did the opportunities. YouTube, websites, ebooks, streaming, online courses, automated services, templates, and digital tools made it possible for regular people to build in ways that used to feel out of reach.</p>
          <p>Fast forward to today, and we are living in a world where valuable skills can create opportunities that simply did not exist when I was growing up. With a laptop, a phone, internet access, and the willingness to learn, people are building businesses, helping companies, selling digital products, and creating income from almost anywhere.</p>
          <p>That journey is what inspired me to put together this roadmap.</p>
          <p>I wanted to create the guide I wish someone had handed me years ago, a clear path to learning valuable skills, building something meaningful, and creating opportunities that can change the direction of your life.</p>
          <p className="font-black text-white">If you are ready to bet on yourself, I&apos;ll show you where to start.</p>
        </div>
        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>YES, SHOW ME WHERE TO START</CtaButton>
        </div>
      </section>

      <section className="bg-black px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Testimonial Proof"
          title="Get Results"
          dark
        />

        <div className="mx-auto mt-8 max-w-[560px] space-y-4">
          {proofMessages.map((message, index) => {
            const isMe = message.from === 'me';
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[86%] rounded-[20px] px-5 py-4 text-left text-[15px] font-semibold leading-snug shadow-[0_10px_20px_rgba(0,0,0,0.14)] ${isMe ? 'rounded-br-[6px] bg-[#0f7ee8] text-white' : 'rounded-bl-[6px] bg-[#eeeeef] text-[#111]'}`}>
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-black px-5 py-12 text-white sm:px-8 sm:py-16">
        <SectionHeading
          kicker="The Digital Shift"
          title="This Is Bigger Than"
          accent="Learning A Skill"
          copy="Digital skills are connected to the way attention, business, entertainment, and money already move. The question is not whether the digital world is real. The question is whether you are ready to learn how to participate in it."
          dark
        />

        <div className="mx-auto mt-9 grid max-w-[1040px] gap-4 md:grid-cols-3">
          {digitalWorldCards.map((item) => (
            <article key={item.title} className="rounded-[8px] border border-[#2f74ad]/50 bg-white/7 p-5 text-left">
              <h3 className="text-xl font-black uppercase leading-tight text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-[#b8d5ee]">
                {item.copy}
              </p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-[900px] space-y-3">
          {transformationBullets.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[8px] border border-[#2f74ad]/50 bg-white/7 p-5 text-left text-sm font-bold leading-relaxed text-[#d7ecff]">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#5ab8ff]" size={20} />
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>YES, I WANT DIGITAL SKILLS</CtaButton>
        </div>
      </section>

      <section className="bg-black px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading
          kicker="What Is Included"
          title="Here's What You'll Learn"
          accent="Along The Way"
          copy="This is not just information. It is a guided path into the skills people use to build websites, create digital products, automate simple work, grow attention, and turn what they know into something people can buy, book, watch, download, or use."
          dark
        />

        <div className="mx-auto mt-8 grid max-w-[980px] gap-3 md:grid-cols-3">
          {learnItems.map((item) => (
            <div key={item.title} className="flex min-h-[176px] items-start gap-3 rounded-[8px] border border-[#d7e6f4] bg-white p-4 text-sm font-bold leading-relaxed text-[#425d78] shadow-[0_8px_20px_rgba(6,19,34,0.06)]">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#0f7ee8]" size={18} />
              <p>
                <span className="block font-black uppercase text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">{item.title}</span>
                {item.copy}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>SHOW ME EVERYTHING INCLUDED</CtaButton>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-4 border-y border-[#2f74ad]/50 bg-black px-6 py-5">
        <ShieldCheck size={38} className="text-[#0f7ee8]" />
        <div>
          <strong className="block text-base font-black uppercase tracking-[0.04em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            Clear Roadmap. Beginner Friendly. Action Focused.
          </strong>
          <span className="text-sm font-semibold text-[#b8d5ee]">
            Built from 2+ years of testing and working with tools businesses use every day. Beginner-friendly. Action-focused. No fluff.
          </span>
        </div>
      </div>

      <section className="border-t-[5px] border-[#020812] bg-black px-5 py-12 text-white sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-[1040px] gap-10 lg:grid-cols-[1fr_0.78fr]">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#5ab8ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              <Star size={16} fill="currentColor" />
              Pricing / Offer
            </p>
            <h2 className="max-w-[620px] text-4xl font-black uppercase leading-[1.02] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-5xl">
              Everything You Need In One Clear Roadmap
            </h2>

            <div className="mt-8 space-y-5 text-base font-semibold leading-relaxed text-[#d7ecff]">
              <p>This is not about collecting more information.</p>
              <p>It is about learning the skills behind the digital world people already use every day, websites, digital products, AI tools, automation, content, offers, and online systems.</p>
              <p>Instead of trying to figure everything out alone, follow one roadmap that helps you know what to learn, what to build, and what to do next.</p>
              <p>Results are never guaranteed, but skills can change the options you see in front of you.</p>
            </div>

            <div className="mt-9">
              <CtaButton>YES, I&apos;M READY TO START</CtaButton>
            </div>
          </div>

          <div className="rounded-[8px] border border-[#2f74ad]/50 bg-white/7 p-7 text-white">
            <h3 className="mb-6 text-xl font-black uppercase text-[#5ab8ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">Includes</h3>
            <div className="divide-y divide-[#2f74ad]/45">
              {includes.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 py-4">
                    <Icon className="text-[#5ab8ff]" size={24} strokeWidth={1.8} />
                    <span className="text-sm font-black uppercase text-white">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-[5px] border-[#020812] bg-white px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Transformation"
          title="Imagine Looking Back"
          accent="One Year From Today..."
          copy="Imagine having skills that can travel with you. Skills you can use for clients, digital products, websites, content, automation, and online offers. Skills that give you more choices than trading time in one location forever."
        />

        <div className="mx-auto mt-10 grid max-w-[1120px] gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col items-center justify-start">
            <div className="mb-4 flex w-full max-w-[560px] items-center justify-center gap-2 text-xl font-black uppercase tracking-[0.06em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              <Rocket className="text-[#0f7ee8]" size={22} />
              More Freedom. More Flexibility.
            </div>
            <div className="w-full max-w-[620px] overflow-hidden rounded-[8px] border border-[#e0e8f0] bg-white p-3 shadow-[0_28px_60px_rgba(0,0,0,0.18)]">
              <img
                src={productImage}
                alt="Complete digital skills bundle preview"
                className="aspect-[3/2] w-full rounded-[6px] object-contain"
              />
            </div>
            <div className="mt-5 grid w-full max-w-[620px] grid-cols-2 gap-2 text-left sm:grid-cols-3">
              {includes.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 rounded-[6px] border border-[#d7e6f4] bg-[#f8fbff] p-3 text-xs font-black uppercase text-[#425d78]">
                    <Icon size={16} className="shrink-0 text-[#0f7ee8]" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-3 text-xl font-black uppercase tracking-[0.06em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              <FileText className="text-[#0f7ee8]" size={22} />
              Every New Chapter Begins With One Decision
            </div>
            <div className="space-y-3">
              {[
                'The goal is not simply to learn another thing.',
                'The goal is becoming the kind of person who understands how digital opportunity works.',
                'More freedom over your time.',
                'More flexibility over where you can build.',
                'More opportunity through skills that businesses and audiences already value.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-4 rounded-[8px] border border-[#e1e8ef] bg-[#fbfdff] p-4 shadow-[0_6px_14px_rgba(0,0,0,0.03)]">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#0f7ee8] text-white">
                    <CheckCircle2 size={17} strokeWidth={2.8} />
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-[#425d78]">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 rounded-[8px] border border-[#d7e6f4] bg-[#07192f] p-5 text-center sm:grid-cols-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.08em] text-[#b8d5ee] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                  Includes
                </div>
                <div className="text-2xl font-black text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                  Roadmap + Templates
                </div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.08em] text-[#b8d5ee] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                  Access
                </div>
                <div className="text-2xl font-black text-[#5ab8ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                  Start Today
                </div>
              </div>
            </div>

            <div className="mt-6">
              <CtaButton>YES, I WANT THAT FUTURE</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="I AM"
          title="I AM Building"
          accent="A Better Future"
          copy="Sometimes the first change is the way you talk to yourself. This roadmap is here to help you move from waiting to beginning."
        />
        <div className="mx-auto mt-8 max-w-[760px] space-y-6 text-lg font-semibold leading-[1.8] text-[#425d78]">
          <p>I AM ready to stop waiting.</p>
          <p>I AM creating more opportunities.</p>
          <p>I AM investing in myself.</p>
          <p>I AM learning valuable skills.</p>
          <p>I AM building confidence.</p>
          <p>I AM creating more freedom.</p>
          <p>I AM becoming more valuable.</p>
          <p>I AM ready to begin today.</p>
        </div>
        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>YES I AM</CtaButton>
        </div>
      </section>

      <section className="bg-black px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="What Waiting Is Costing You"
          title="The Cost Of Waiting"
          accent="Is Higher Than You Think"
          dark
        />
        <div className="mx-auto mt-8 grid max-w-[900px] gap-4 md:grid-cols-2">
          {urgencyCosts.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[8px] border border-[#2f74ad]/50 bg-white/7 p-5 text-left text-sm font-bold leading-relaxed text-[#d7ecff]">
              <TrendingDown className="mt-0.5 shrink-0 text-[#5ab8ff]" size={20} />
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>I&apos;M READY TO START TODAY</CtaButton>
        </div>
      </section>

      <section className="bg-white px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Who This Is For"
          title="This Was Built"
          accent="For You If..."
        />
        <div className="mx-auto mt-8 max-w-[760px] space-y-6 text-lg font-semibold leading-[1.8] text-[#425d78]">
          {skillMatterBullets.map((item) => (
            <p key={item}>✓ {item}</p>
          ))}
          <p className="font-black text-[#07192f]">You do not have to know everything today.</p>
          <p>You only have to be willing to begin.</p>
        </div>
        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>YES...THIS IS FOR ME</CtaButton>
        </div>
      </section>

      <section className="bg-white px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="FAQ"
          title="Questions Before"
          accent="You Begin?"
        />

        <div className="relative z-10 mx-auto mt-12 h-auto max-w-[1180px] md:h-[790px]">
          {clientVideos.map((video, index) => {
            const desktopPosition = [
              'md:left-1/2 md:-translate-x-[104%] md:rotate-[-6deg] md:z-10',
              'md:left-1/2 md:-translate-x-1/2 md:rotate-0 md:z-30',
              'md:left-1/2 md:translate-x-[4%] md:rotate-[6deg] md:z-10',
            ][index];

            return (
              <article
                key={video.name}
                className={`group absolute left-1/2 top-0 w-full max-w-[330px] -translate-x-1/2 rounded-[22px] border border-[#d7e6f4] bg-white p-4 shadow-[0_22px_54px_rgba(6,19,34,0.18)] transition-all duration-300 hover:z-40 hover:-translate-y-5 hover:rotate-0 md:w-[340px] lg:w-[380px] lg:max-w-[380px] max-md:static max-md:mx-auto max-md:mb-6 max-md:translate-x-0 ${desktopPosition}`}
                style={{ top: `${index * 22}px` }}
              >
                <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] bg-[#07192f]">
                  <video className="h-full w-full object-cover" controls preload="none" poster={video.poster}>
                    <source src={video.src} type={video.type} />
                  </video>
                  <div className="pointer-events-none absolute left-4 top-4 rounded-[3px] bg-[#0f7ee8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                    Client Story
                  </div>
                </div>
                <div className="px-2 py-5 text-center">
                  <h3 className="text-lg font-black uppercase text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">{video.name}</h3>
                  <p className="mt-1 text-sm font-bold text-[#425d78]">{video.role}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-[980px] rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-5 text-left shadow-[0_18px_44px_rgba(6,19,34,0.1)] sm:p-8">
          <SectionHeading
            kicker="Frequently Asked Questions"
            title="Simple Answers"
            accent="Before You Decide"
            copy="Here are the answers most people need before they take the first step."
          />

          <div className="mt-8 grid gap-3">
            {videoFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[6px] border border-[#d7e6f4] bg-white p-5 shadow-[0_8px_20px_rgba(6,19,34,0.06)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black uppercase leading-tight text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f7ee8] text-base text-white transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[820px] text-base font-semibold leading-[1.75] text-[#425d78]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-12 text-center sm:px-8 sm:pb-16">
        <div className="mx-auto mt-12 max-w-[820px] rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-6 text-center shadow-[0_18px_44px_rgba(6,19,34,0.1)] sm:p-10">
          <h2 className="text-4xl font-black uppercase leading-tight text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            Every New Opportunity Begins With One Decision.
          </h2>
          <div className="mx-auto mt-6 max-w-[660px] space-y-4 text-base font-semibold leading-relaxed text-[#425d78]">
            <p>You do not have to know exactly where this path will take you.</p>
            <p>You simply have to decide that where you are today is not where you want to stay.</p>
            <p>The future you&apos;re hoping for will not arrive on its own.</p>
            <p>Every journey begins with someone deciding to take the first step.</p>
          </div>
          <div className="mx-auto mt-8 flex justify-center">
            <CtaButton>YES, I AM READY TO START TODAY</CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
}
