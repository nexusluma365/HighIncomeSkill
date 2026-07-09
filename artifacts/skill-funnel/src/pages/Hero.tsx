import { useRef, useState } from 'react';
import { Link } from 'wouter';
import georgeVideo from '../assets/media/george-web.mp4';
import naphtaliVideo from '../assets/media/naphtali-web.mp4';
import lumaVideo from '../assets/media/luma.mp4';
import heroVideo from '../assets/media/voice-ai-offer-hero.mp4';
import chatgptMayNineImage from '../assets/media/chatgpt-may-9.png';
import productImage from '../assets/media/product-image.png';
import georgePoster from '../assets/generated/george-thumb.jpg';
import naphtaliPoster from '../assets/generated/naphtali-thumb.jpg';
import spidermanPoster from '../assets/generated/spiderman-thumb.jpg';
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Compass,
  FileText,
  Globe2,
  LockKeyhole,
  Map,
  MessageSquareText,
  Palmtree,
  Rocket,
  ShieldCheck,
  Star,
  TrendingDown,
  Users,
  Workflow,
  XCircle,
} from 'lucide-react';

const heroProofPoints = [
  'Beginner Friendly',
  'Step-By-Step Roadmap',
  'Real Skills Real Proof',
  'Freedom Lifestyle',
];

const featureCards = [
  {
    icon: Users,
    title: 'Beginner Friendly',
    copy: 'No experience? No problem.',
  },
  {
    icon: Map,
    title: 'Step-By-Step Roadmap',
    copy: 'Everything you need to get started.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Real Skills Real Proof',
    copy: 'Build proof you can show.',
  },
  {
    icon: Palmtree,
    title: 'Freedom Lifestyle',
    copy: 'Work from anywhere with direction.',
  },
];

const learnItems = [
  {
    title: 'AI Assistant Builder Training',
    copy: 'Learn how to create simple AI assistants businesses can use to answer questions, capture leads, and save time.',
  },
  {
    title: 'Website Building System',
    copy: 'Learn how to build clean business websites that help companies look professional and get more leads.',
  },
  {
    title: 'AI Automation Workflows',
    copy: 'Learn how to use AI and simple automations to help businesses reduce repetitive tasks.',
  },
  {
    title: 'Voice AI Assistant Guide',
    copy: 'Learn how voice AI can help businesses answer calls, qualify leads, and improve customer response time.',
  },
  {
    title: 'Prompt Library',
    copy: 'Get ready-to-use prompts for content, websites, offers, client work, and business workflows.',
  },
  {
    title: 'Templates & Starter Projects',
    copy: 'Use editable templates so you are not starting from a blank screen.',
  },
  {
    title: 'Sales Scripts & Client Offer Kit',
    copy: 'Learn how to explain your service, talk to potential clients, and present your offer with confidence.',
  },
  {
    title: '30-Day Action Plan',
    copy: 'Follow a simple plan that helps you choose a skill, build proof, create your first offer, and start showing up online.',
  },
];

const skillMatterBullets = [
  'Website projects can often be sold as starter services.',
  'AI assistants and automation setups can be positioned as time-saving business solutions.',
  'Sales funnels and lead capture pages help businesses turn visitors into leads.',
  'Client scripts and templates help you stop guessing what to say.',
];

const includes = [
  { icon: CalendarClock, label: '5 Focused Challenge Days' },
  { icon: MessageSquareText, label: 'Daily Confidence Prompts' },
  { icon: FileText, label: 'Templates & Scripts' },
  { icon: Workflow, label: 'AI Workflows' },
  { icon: Compass, label: '30-Day Action Plan' },
  { icon: Users, label: 'Private Student Community' },
];

const blueprintCards = [
  {
    icon: Globe2,
    title: 'Simple Business Websites',
    copy: 'Help businesses create a professional online presence.',
    outcome: 'A starter service many businesses understand.',
  },
  {
    icon: Bot,
    title: 'AI Chat Assistants',
    copy: 'Help businesses answer questions, collect leads, and support customers.',
    outcome: 'A simple AI service path.',
  },
  {
    icon: Workflow,
    title: 'Automation Workflows',
    copy: 'Help businesses save time by making repeated tasks easier.',
    outcome: 'Time-saving business solutions.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Funnels & Lead Capture Pages',
    copy: 'Help businesses turn traffic into leads and bookings.',
    outcome: 'A clear path from visitor to lead.',
  },
];

const whoThisIsFor = [
  'You are tired of working harder without feeling further ahead.',
  'You want practical digital skills you can build from home or while traveling.',
  'You are willing to follow a clear roadmap instead of jumping between random ideas.',
  'You want to use AI as a tool that makes your work more valuable.',
];

const whoThisIsNotFor = [
  'You want instant results without learning anything new.',
  'You are looking for another random course to collect and never finish.',
  'You are not willing to practice, build proof, or follow a process.',
  'You want to keep waiting for the perfect time before you start.',
];

const urgencyCosts = [
  'Another month of guessing what skill to learn.',
  'Another month watching others build online while you stay stuck.',
  'Another month working overtime instead of building a skill.',
  'Another month letting AI feel confusing instead of using it.',
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
    question: 'Who is the AI & Digital Skills Bundle for?',
    answer:
      'It is for beginners who want a clear path to learn practical AI, website, automation, and digital service skills businesses already pay for.',
  },
  {
    question: 'Do I need experience before starting?',
    answer:
      'No. The point of the Blueprint is to help you start from where you are and build direction, proof, and confidence one step at a time.',
  },
  {
    question: 'What skills will I learn?',
    answer:
      'You will learn how websites, AI automation, appointment booking systems, email marketing, templates, workflows, and client-ready systems fit together.',
  },
  {
    question: 'Can I use these skills from home?',
    answer:
      'Yes. These skills are designed to be built and delivered from anywhere you have a laptop, a phone, and an internet connection.',
  },
  {
    question: 'What if I do not know which skill to choose first?',
    answer:
      'That is exactly why the roadmap exists. It helps you stop guessing and follow a simple sequence so you know what to focus on next.',
  },
  {
    question: 'Is this just another course?',
    answer:
      'No. It is built as a complete learning plan with practical steps, templates, prompts, workflows, and resources you can use while building real proof.',
  },
  {
    question: 'What happens after I say yes?',
    answer:
      'You will move through a secure checkout. After successful payment, your download buttons appear on the thank-you page for instant digital access.',
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
      className="group relative mx-auto aspect-video w-full max-w-[780px] overflow-hidden rounded-[4px] border-4 border-[#173e69] bg-[#061322] shadow-[0_12px_48px_rgba(0,0,0,0.55)]"
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
      <div className={`absolute inset-0 bg-[#061322]/40 transition duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
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
          AI & Digital <span className="text-[#5ab8ff]">Skills</span>
        </div>
      </header>

      <section className="bg-[#111923] px-5 py-10 text-center sm:px-8 sm:py-14">
        <p className="mb-1 text-sm font-black uppercase tracking-[0.08em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
          Complete AI & Digital Skills Business Starter System
        </p>
        <p className="mb-5 text-sm font-black uppercase tracking-[0.08em] text-[#5ab8ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
          Before you waste months on random videos, start with one clear roadmap
        </p>

        <h1 className="mx-auto max-w-[1000px] text-[2.4rem] font-black uppercase leading-[1.05] tracking-[0.02em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-[4rem]">
          Working Overtime But Still Falling Behind?
          <br />
          Learn <span className="text-[#5ab8ff]">AI, Websites & Automation</span> Skills Businesses Already Pay For.
        </h1>

        <p className="mx-auto mt-6 max-w-[780px] text-base font-semibold leading-[1.75] text-[#d6e7f6]">
          Start with one clear roadmap that shows you what to learn, what to build, and how to turn your new skill into a simple service offer you can sell from home.
        </p>

        <div className="mx-auto mt-7 grid max-w-[850px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {heroProofPoints.map((point) => (
            <div
              key={point}
              className="flex min-h-[46px] items-center justify-center gap-2 rounded-[6px] border border-[#2f74ad]/50 bg-white/7 px-3 py-2 text-sm font-black uppercase tracking-[0.04em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]"
            >
              <Star size={14} fill="currentColor" className="text-[#5ab8ff]" />
              {point}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <VideoContainer />
        </div>

        <div className="mx-auto mt-8 flex justify-center">
          <CtaButton>Yes, Start Building From Home Today</CtaButton>
        </div>
        <p className="mt-3 text-xs font-semibold text-[#9cb6cb]">
          Educational content only. Results depend on your action, market, skill, and execution.
        </p>
      </section>

      <section className="border-t-[5px] border-[#020812] bg-white px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading
          kicker="The Complete System"
          title="The Complete AI & Digital Skills Bundle"
          accent="Everything In One Place."
          copy="Instead of guessing what to learn, you get a beginner-friendly system with training, templates, prompts, scripts, funnels, and action steps designed to help you build real digital service skills faster."
        />

        <div className="mx-auto mt-10 grid max-w-[1120px] gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col items-center justify-start">
            <div className="mb-4 flex w-full max-w-[560px] items-center justify-center gap-2 text-xl font-black uppercase tracking-[0.06em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              <Rocket className="text-[#0f7ee8]" size={22} />
              Your Digital Skill System
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
              What You Get
            </div>
            <div className="space-y-3">
              {learnItems.map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-[8px] border border-[#e1e8ef] bg-[#fbfdff] p-4 shadow-[0_6px_14px_rgba(0,0,0,0.03)]">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#0f7ee8] text-white">
                    <CheckCircle2 size={17} strokeWidth={2.8} />
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-[#425d78]">
                    <span className="block font-black uppercase text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">{item.title}</span>
                    {item.copy}
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
              <CtaButton>Yes, Start Building From Home Today</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Why These Skills Matter"
          title="Businesses Already Need"
          accent="Digital Help."
          copy="Businesses are already paying for help with websites, AI tools, automations, lead capture systems, content, funnels, and customer response systems."
        />

        <div className="mx-auto mt-8 max-w-[900px] space-y-5 text-center text-base font-semibold leading-[1.75] text-[#425d78]">
          <p>
            You do not need a degree to start learning these skills. You need a clear path, simple tools, proof that you can do the work, and the confidence to offer your service.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-[980px] gap-3 md:grid-cols-2">
          {skillMatterBullets.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[8px] border border-[#d7e6f4] bg-white p-4 text-sm font-bold leading-relaxed text-[#425d78] shadow-[0_8px_20px_rgba(6,19,34,0.06)]">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#0f7ee8]" size={18} />
              <p>{item}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-[780px] text-center text-xs font-semibold leading-relaxed text-[#7a8fa3]">
          Income is not guaranteed. Client pricing depends on your skill level, market, offer, communication, and execution.
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-4 border-y border-[#d7e6f4] bg-[#f5f8fb] px-6 py-5">
        <ShieldCheck size={38} className="text-[#0f7ee8]" />
        <div>
          <strong className="block text-base font-black uppercase tracking-[0.04em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            Clear Roadmap. Beginner Friendly. Action Focused.
          </strong>
          <span className="text-sm font-semibold text-[#425d78]">
            Built from 2+ years of testing and working with tools businesses use every day. Beginner-friendly. Action-focused. No fluff.
          </span>
        </div>
      </div>

      <section className="bg-white px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Does This Sound Like You?"
          title="Working Hard But Still Feeling Behind"
          accent="Is Exhausting."
        />
        <div className="mx-auto mt-8 max-w-[760px] space-y-6 text-lg font-semibold leading-[1.8] text-[#425d78]">
          <p>You&apos;re working overtime...</p>
          <p>But it still feels like you&apos;re falling behind.</p>
          <p>By the time you get home...</p>
          <p>You&apos;re exhausted.</p>
          <p>You want to learn something that could change your future...</p>
          <p>But you don&apos;t know where to start.</p>
          <p className="font-black text-[#07192f]">You are not lazy. You may just be missing a clear skill path.</p>
          <p>
            Would you say that is you? <span className="font-black uppercase text-[#0f7ee8]">Yes</span>....
          </p>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="What Most People Never Realize"
          title="The People Winning Online"
          accent="Became The Opportunity."
          copy="The people winning online did not magically get lucky. They learned skills businesses already needed, built simple proof, and started offering solutions."
        />
        <div className="mx-auto mt-8 max-w-[760px] space-y-6 text-lg font-semibold leading-[1.8] text-[#425d78]">
          <p>The question stopped being...</p>
          <p>
            &quot;<span className="font-black uppercase text-[#0f7ee8]">AM I</span>?&quot;
          </p>
          <p>
            <span className="font-black uppercase text-[#0f7ee8]">AM I</span> capable of more?
          </p>
          <p>
            <span className="font-black uppercase text-[#0f7ee8]">AM I</span> able to spend more time with family?
          </p>
          <p>
            <span className="font-black uppercase text-[#0f7ee8]">AM I</span> smart enough to do this?
          </p>
          <p>And the answers started being</p>
          <p>
            <span className="font-black uppercase text-[#0f7ee8]">I AM!</span>
          </p>
        </div>
      </section>

      <section className="border-t-[5px] border-[#0f7ee8] bg-[#111923] px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Why This Was Built"
          title="Everything I Wish Someone Had Given Me"
          accent="On Day One"
          dark
        />
        <div className="mx-auto mt-8 max-w-[760px] space-y-6 text-lg font-semibold leading-[1.8] text-[#b8d5ee]">
          <p>Hey, I&apos;m Eli.</p>
          <p>A little over two years ago, I stopped asking...</p>
          <p className="font-black text-white">&quot;How can I make more money?&quot;</p>
          <p>And started asking...</p>
          <p className="font-black text-white">&quot;What skills are businesses already paying for?&quot;</p>
          <p>That one decision led me to web development, AI, automation, and the digital systems businesses use every day.</p>
          <p>Not because I wanted another degree.</p>
          <p>Not because I wanted another job.</p>
          <p>Because I wanted more freedom. More opportunities. More control over my future.</p>
          <p className="font-black text-white">One project showed me how valuable practical digital skills can become when they solve a real business problem.</p>
          <p>One client. One valuable skill. One laptop. One phone. A few AI tools.</p>
          <p className="font-black text-white">Businesses do not pay the most to people who work the hardest. They pay the most to people who know how to solve valuable problems.</p>
          <p>But enough about who <span className="font-black uppercase text-[#5ab8ff]">I AM</span>...</p>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading
          kicker="What You Can Learn To Offer"
          title="Practical Services"
          accent="Businesses Understand"
        />

        <div className="mx-auto mt-10 grid max-w-[980px] gap-8 md:grid-cols-2 lg:grid-cols-4">
          {blueprintCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="relative min-h-[280px]">
                <div className="absolute inset-0 rotate-[-7deg] rounded-[10px] bg-[#d7eaff]" />
                <div className="absolute inset-0 rotate-[7deg] rounded-[10px] bg-[#b8d5ee]" />
                <article className="relative z-10 flex h-full flex-col rounded-[10px] border border-[#d7e6f4] bg-white p-6 text-center shadow-[0_18px_34px_rgba(0,0,0,0.14)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#0f7ee8] text-white">
                    <Icon size={26} />
                  </div>
                  <div className="mx-auto mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#9cc8f2] text-lg font-black text-[#0f7ee8] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-black uppercase leading-tight text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm font-semibold leading-relaxed text-[#425d78]">{item.copy}</p>
                  <div className="mt-auto rounded-[6px] bg-[#eef7ff] px-3 py-3 text-xs font-black uppercase leading-relaxed text-[#0f7ee8]">
                    {item.outcome}
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 flex justify-center">
          <CtaButton>Yes, Start Building From Home Today</CtaButton>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-[1040px] gap-6 lg:grid-cols-2">
          <div className="border border-emerald-300 bg-white p-6 shadow-[0_16px_34px_rgba(0,0,0,0.08)] ring-2 ring-emerald-400/70">
            <div className="mb-5 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={28} />
              <h3 className="text-3xl font-black uppercase text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                Who This Is For
              </h3>
            </div>
            <div className="space-y-4">
              {whoThisIsFor.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-bold leading-relaxed text-[#425d78]">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-red-300 bg-white p-6 shadow-[0_16px_34px_rgba(0,0,0,0.08)] ring-2 ring-red-400/70">
            <div className="mb-5 flex items-center gap-3">
              <XCircle className="text-red-600" size={28} />
              <h3 className="text-3xl font-black uppercase text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
                Who This Is Not For
              </h3>
            </div>
            <div className="space-y-4">
              {whoThisIsNotFor.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-bold leading-relaxed text-[#425d78]">
                  <XCircle className="mt-0.5 shrink-0 text-red-600" size={18} />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-[5px] border-[#0f7ee8] bg-[#111923] px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Urgency"
          title="What Waiting"
          accent="Is Costing You"
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
          <CtaButton>Yes, Start Building From Home Today</CtaButton>
        </div>
      </section>

      <section className="bg-white px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="Testimonial Proof"
          title="Real Students."
          accent="Real Progress."
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

      <section className="bg-[#f5f8fb] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-[1120px] items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="overflow-hidden rounded-[8px] border border-[#d7e6f4] bg-white p-3 shadow-[0_20px_44px_rgba(0,0,0,0.12)]">
            <img
              src={chatgptMayNineImage}
              alt="Live masterclass offer graphic for building a first high-value offer"
              className="aspect-[4/5] w-full rounded-[6px] object-cover object-top"
            />
          </div>
          <div className="text-center lg:text-left">
            <p className="mb-3 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#0f7ee8] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] lg:justify-start">
              <Star size={15} fill="currentColor" />
              And That&apos;s Just The Beginning
            </p>
            <div className="space-y-4 text-base font-semibold leading-relaxed text-[#425d78]">
              <p>Every lesson builds on the last.</p>
              <p>Every resource has a purpose.</p>
              <p>Every skill moves you closer to becoming someone businesses are willing to invest in.</p>
              <p>Because the goal isn&apos;t simply to learn another skill...</p>
              <p>
                <strong className="text-[#0f7ee8]">
                  It&apos;s to build a future with more freedom, more opportunities, and more control than you had yesterday.
                </strong>
              </p>
            </div>
            <div className="mt-8">
              <CtaButton>Yes, Start Building From Home Today</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-[5px] border-[#020812] bg-[#111923] px-5 py-12 text-white sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-[1040px] gap-10 lg:grid-cols-[1fr_0.78fr]">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#5ab8ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              <Star size={16} fill="currentColor" />
              What You&apos;ll Learn
            </p>
            <h2 className="max-w-[620px] text-4xl font-black uppercase leading-[1.02] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-5xl">
              Everything you need to go from beginner to visible builder
            </h2>

            <ul className="mt-8 space-y-3">
              {learnItems.map((item) => (
                <li key={item.title} className="flex items-start gap-3 text-sm font-bold text-[#d7ecff]">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#5ab8ff]" size={18} />
                  <span>
                    <span className="font-black text-white">{item.title}: </span>
                    {item.copy}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <CtaButton>Unlock My Digital Skills Bundle</CtaButton>
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

      <section className="bg-white px-5 py-12 text-center sm:px-8 sm:py-16">
        <SectionHeading
          kicker="See What Clients Are Saying"
          title="Real Voices From People"
          accent="Building Real Skills"
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
            title="Questions Before You"
            accent="Start?"
            copy="Here are the answers most people need before they decide to move forward."
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
    </div>
  );
}
