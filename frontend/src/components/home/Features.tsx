'use client';

import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';
import ScrollFloat from '@/components/ui/ScrollFloat';
import { motion } from 'framer-motion';
import {
  MapPinned,
  Accessibility,
  Star,
  UserRound,
  ShieldCheck,
  Map,
  Navigation,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Tiny reusable fade-up wrapper
───────────────────────────────────────────── */
// Note: This component is defined but not currently used in this file

/* ─────────────────────────────────────────────
   Fake map mockup — built entirely in CSS
───────────────────────────────────────────── */
function MapMockup() {
  const pins = [
    { top: '22%', left: '28%', color: '#FF0080', label: 'City Mall' },
    { top: '55%', left: '58%', color: '#7928CA', label: 'Central Park' },
    { top: '38%', left: '72%', color: '#0070F3', label: 'Metro Hub' },
    { top: '68%', left: '30%', color: '#38BDF8', label: 'Library' },
  ];

  const features = [
    { icon: '♿', label: 'Ramp' },
    { icon: '🛗', label: 'Lift' },
    { icon: '👁', label: 'Braille' },
    { icon: '🔇', label: 'Quiet' },
  ];

  return (
    <div className="relative h-[170px] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-blue-50 shadow-inner dark:border-white/10 dark:from-slate-900 dark:to-slate-950 sm:h-[220px]">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-feat" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0070F3" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-feat)" />
      </svg>
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#334155" strokeWidth="6" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#334155" strokeWidth="3" />
        <line x1="38%" y1="0" x2="38%" y2="100%" stroke="#334155" strokeWidth="6" />
        <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#334155" strokeWidth="3" />
      </svg>
      <div
        className="absolute rounded-full blur-2xl opacity-20"
        style={{
          width: 100,
          height: 100,
          top: '10%',
          left: '20%',
          backgroundColor: '#FF0080',
        }}
      />
      <div
        className="absolute rounded-full blur-2xl opacity-15"
        style={{
          width: 120,
          height: 120,
          top: '40%',
          left: '50%',
          backgroundColor: '#7928CA',
        }}
      />
      {pins.map((p) => (
        <div
          key={p.label}
          className="absolute flex flex-col items-center"
          style={{
            top: p.top,
            left: p.left,
            transform: 'translate(-50%,-100%)',
          }}
        >
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black text-white shadow-lg ring-2 ring-white dark:ring-slate-950 sm:h-7 sm:w-7 sm:text-[10px]"
            style={{ backgroundColor: p.color }}
          >
            <MapPinned size={12} />
          </div>
          <div
            className="mt-0.5 rounded-full px-1.5 py-0.5 text-[7px] font-bold text-white shadow-md whitespace-nowrap sm:px-2 sm:text-[8px]"
            style={{ backgroundColor: p.color }}
          >
            <span className="sm:hidden">{p.label.split(' ')[0]}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </div>
        </div>
      ))}
      <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 flex-wrap sm:gap-2">
        {features.slice(0, 3).map((f) => (
          <span
            key={f.label}
            className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/85 dark:text-slate-200 sm:px-2.5 sm:py-1 sm:text-[10px]"
          >
            <span>{f.icon}</span> {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Rating stars helper
───────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-200 fill-gray-200 dark:text-slate-700 dark:fill-slate-700'
          }
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature card definitions
───────────────────────────────────────────── */
const featureCards = [
  {
    id: 'header',
    content: (
      <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center gap-5 text-center sm:gap-7">
        <ScrollFloat
          containerClassName="!my-0 !overflow-visible"
          textClassName="!text-sm !leading-none uppercase tracking-[0.22em] text-gray-400 dark:text-slate-400 font-semibold"
          animationDuration={0.85}
          ease="power2.out"
          stagger={0.012}
          scrollStart="center bottom+=25%"
          scrollEnd="bottom bottom-=55%"
        >
          Inclusive by Design
        </ScrollFloat>

        <h2
          className="w-full font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white"
          style={{ fontSize: 'clamp(2.4rem, 8vw, 6rem)' }}
        >
          Designed for{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(to right,#FF0080,#7928CA,#0070F3)',
            }}
          >
            Inclusive
          </span>{' '}
          Exploration
        </h2>

        <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-slate-300 sm:hidden">
          Discover accessible spaces with quick, trusted insights from the community.
        </p>
        <p className="hidden max-w-2xl text-xl leading-relaxed text-gray-500 dark:text-slate-300 sm:block">
          AccessAble helps you discover, review, and truly understand the accessibility of public
          spaces — powered by community-driven insights and meaningful real-world data.
        </p>
      </div>
    ),
    itemClassName: 'bg-white border border-gray-100 dark:border-white/10 dark:bg-slate-900',
  },
  {
    id: 'map',
    gradient: null,
    bg: 'bg-white',
    content: (
      <div className="flex h-full flex-col items-center justify-between gap-5 sm:gap-8 lg:flex-row lg:gap-10">
        {/* Left: text */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-4 sm:mb-8 sm:gap-5">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ backgroundColor: '#FF008018', width: 60, height: 60 }}
            >
              <Map size={28} style={{ color: '#FF0080' }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">
                Live Discovery
              </p>
              <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Interactive Map View
              </h3>
            </div>
          </div>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-slate-300 sm:hidden">
            Explore nearby accessible places with fast, visual navigation.
          </p>
          <p className="hidden mb-8 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-slate-300 sm:block">
            Visualize accessible locations on a live, interactive map. Explore what's nearby, filter
            by facility type, and navigate every public space with total confidence.
          </p>
          <div className="flex gap-3 flex-wrap">
            {[
              {
                name: 'City Mall',
                rating: 4,
                badge: 'Wheelchair ✓',
                color: '#FF0080',
              },
              {
                name: 'Central Park',
                rating: 5,
                badge: 'Quiet Zone ✓',
                color: '#7928CA',
              },
              {
                name: 'Metro Hub',
                rating: 3,
                badge: 'Elevator ✓',
                color: '#0070F3',
              },
            ]
              .slice(0, 2)
              .map((loc) => (
                <div
                  key={loc.name}
                  className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-white/10 dark:bg-slate-950 sm:gap-3 sm:px-5 sm:py-3"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9"
                    style={{ backgroundColor: `${loc.color}18` }}
                  >
                    <MapPinned size={14} style={{ color: loc.color }} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold leading-none text-gray-900 dark:text-white sm:text-sm">
                      {loc.name}
                    </p>
                    <Stars rating={loc.rating} />
                  </div>
                  <span
                  className="ml-0.5 rounded-full px-2 py-0.5 text-[8px] font-bold sm:ml-1 sm:px-2.5 sm:py-1 sm:text-[10px]"
                    style={{
                      backgroundColor: `${loc.color}18`,
                      color: loc.color,
                    }}
                  >
                    <span className="sm:hidden">{loc.badge.split(' ')[0]} ✓</span>
                    <span className="hidden sm:inline">{loc.badge}</span>
                  </span>
                </div>
              ))}
          </div>
        </div>
        {/* Right: map mockup */}
        <div className="flex-1 w-full relative">
          <MapMockup />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-2 -bottom-4 z-10 hidden items-center gap-3 rounded-2xl border border-white/10 bg-gray-900 px-5 py-3.5 text-white shadow-2xl dark:bg-slate-950 lg:flex"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: '#FF008022' }}
            >
              <Navigation size={20} style={{ color: '#FF0080' }} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-black tracking-widest opacity-50">Nearby</p>
              <p className="text-sm font-black leading-tight">4 Accessible Spots</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    itemClassName: 'bg-white border border-gray-100 dark:border-white/10 dark:bg-slate-900',
  },
  {
    id: 'accessibility',
    content: (
      <div className="flex h-full flex-col items-center justify-between gap-5 sm:gap-8 lg:flex-row lg:gap-10">
        <div className="flex-1 flex flex-col justify-center">
          <div
            className="mb-6 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm sm:mb-8"
            style={{ width: 60, height: 60 }}
          >
            <Accessibility size={28} className="text-white" />
          </div>
          <h3 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:mb-5 sm:text-4xl">
            Explore Accessibility Features
          </h3>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-white/75 sm:hidden">
            Check the most important accessibility details before you go.
          </p>
          <p className="hidden mb-8 max-w-xl text-lg leading-relaxed text-white/75 sm:block">
            Check wheelchair ramps, elevators, tactile paths, handrails, braille signage, quiet
            zones, and accessible entrances — all in one place.
          </p>
          <div className="flex flex-wrap gap-2">
            {['♿ Ramp', '🛗 Lift', '👁 Braille', '🔇 Quiet'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4 sm:gap-5">
          {[
            { label: 'Wheelchair Ramps', count: '340+', icon: '♿' },
            { label: 'Elevator Access', count: '180+', icon: '🛗' },
            { label: 'Braille Signage', count: '95+', icon: '👁' },
            { label: 'Quiet Zones', count: '120+', icon: '🔇' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 rounded-3xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm sm:gap-2.5 sm:p-5"
            >
              <span className="text-xl sm:text-3xl">{item.icon}</span>
              <span className="text-xl font-black text-white sm:text-3xl">{item.count}</span>
              <span className="text-[11px] font-semibold leading-tight text-white/60 sm:text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    itemClassName: 'text-white overflow-hidden',
    style: { background: 'linear-gradient(135deg, #7928CA 0%, #0070F3 100%)' },
  },
  {
    id: 'trusted',
    content: (
      <div className="flex h-full flex-col items-center justify-between gap-5 sm:gap-8 lg:flex-row lg:gap-10">
        <div className="flex-1 flex flex-col justify-center">
          <div
            className="mb-6 flex items-center justify-center rounded-2xl sm:mb-8"
            style={{ backgroundColor: '#38BDF818', width: 60, height: 60 }}
          >
            <ShieldCheck size={28} style={{ color: '#38BDF8' }} />
          </div>
          <h3 className="mb-4 text-3xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:mb-5 sm:text-4xl">
            Trusted & Inclusive Platform
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-slate-300 sm:hidden">
            Reliable accessibility info, shaped by real community experiences.
          </p>
          <p className="hidden max-w-xl text-lg leading-relaxed text-gray-500 dark:text-slate-300 sm:block">
            Community-powered and built on transparency — giving everyone reliable information to
            move freely through the world.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 sm:gap-5">
          {[
            { val: '1200+', label: 'Reviews', color: '#FF0080' },
            { val: '250+', label: 'Places', color: '#7928CA' },
            { val: '40+', label: 'Features', color: '#0070F3' },
          ].map(({ val, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-3xl px-2 py-5 text-center sm:px-4 sm:py-8"
              style={{ backgroundColor: `${color}0D` }}
            >
              <span className="text-2xl font-black leading-none sm:text-5xl" style={{ color }}>
                {val}
              </span>
              <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-slate-400 sm:mt-3 sm:text-xs sm:tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    itemClassName: 'bg-white border border-gray-100 dark:border-white/10 dark:bg-slate-900',
  },
  {
    id: 'discover',
    content: (
      <div className="flex h-full flex-col items-center justify-between gap-5 sm:gap-8 lg:flex-row lg:gap-10">
        <div className="flex-1 flex flex-col justify-center">
          <div
            className="mb-6 flex items-center justify-center rounded-2xl sm:mb-8"
            style={{ backgroundColor: '#FF008018', width: 60, height: 60 }}
          >
            <MapPinned size={28} style={{ color: '#FF0080' }} />
          </div>
          <h3 className="mb-4 text-3xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:mb-5 sm:text-4xl">
            Discover Public Spaces
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-slate-300 sm:hidden">
            Browse public places with quick accessibility summaries.
          </p>
          <p className="hidden max-w-xl text-lg leading-relaxed text-gray-500 dark:text-slate-300 sm:block">
            Find parks, malls, transit hubs, and buildings with community-verified accessibility
            details. Never second-guess a venue again.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-3 sm:gap-4">
          {[
            {
              label: 'Parks & Recreation',
              places: '68 places',
              color: '#FF0080',
            },
            {
              label: 'Shopping Centres',
              places: '45 places',
              color: '#7928CA',
            },
            {
              label: 'Transit & Transport',
              places: '87 places',
              color: '#0070F3',
            },
            {
              label: 'Public Buildings',
              places: '52 places',
              color: '#38BDF8',
            },
          ]
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.label}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-slate-950 sm:px-6 sm:py-4"
            >
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <div
                    className="h-2.5 w-2.5 rounded-full sm:h-3.5 sm:w-3.5"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 sm:text-base">
                    <span className="sm:hidden">{item.label.split('&')[0]}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold sm:px-4 sm:py-1.5 sm:text-sm"
                  style={{
                    backgroundColor: `${item.color}18`,
                    color: item.color,
                  }}
                >
                  {item.places}
                </span>
              </div>
            ))}
        </div>
      </div>
    ),
    itemClassName: 'bg-white border border-gray-100 dark:border-white/10 dark:bg-slate-900',
  },
  {
    id: 'reviews',
    content: (
      <div className="flex h-full flex-col items-center justify-between gap-5 sm:gap-8 lg:flex-row lg:gap-10">
        <div className="flex-1 flex flex-col justify-center">
          <div
            className="mb-6 flex items-center justify-center rounded-2xl sm:mb-8"
            style={{ backgroundColor: '#7928CA18', width: 60, height: 60 }}
          >
            <Star size={28} style={{ color: '#7928CA' }} />
          </div>
          <h3 className="mb-4 text-3xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:mb-5 sm:text-4xl">
            Share Accessibility Reviews
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-slate-300 sm:hidden">
            Share fast, honest reviews that help others plan with confidence.
          </p>
          <p className="hidden max-w-xl text-lg leading-relaxed text-gray-500 dark:text-slate-300 sm:block">
            Submit honest, experience-based reviews that help others navigate with confidence. Your
            voice makes every space more accessible.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-3 sm:gap-4">
          {[
            {
              name: 'Ayesha M.',
              review: 'Wheelchair ramp was easy to use!',
              stars: 5,
              tag: 'Wheelchair ✓',
            },
            {
              name: 'Ravi K.',
              review: 'Elevator worked perfectly, great signage.',
              stars: 4,
              tag: 'Elevator ✓',
            },
            {
              name: 'Sophie L.',
              review: 'Quiet area helped me focus — brilliant.',
              stars: 5,
              tag: 'Quiet Zone ✓',
            },
          ]
            .slice(0, 2)
            .map((r) => (
              <div
                key={r.name}
              className="rounded-2xl border border-gray-100 bg-gray-50 px-3.5 py-3 dark:border-white/10 dark:bg-slate-950 sm:px-6 sm:py-5"
            >
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7928CA] to-[#0070F3] text-[11px] font-black text-white sm:h-10 sm:w-10 sm:text-sm">
                      {r.name[0]}
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white sm:text-sm">
                      {r.name}
                    </span>
                  </div>
                  <Stars rating={r.stars} />
                </div>
                <p className="mb-3 text-xs leading-relaxed text-gray-500 dark:text-slate-300 sm:text-sm">
                  <span className="sm:hidden">
                    "{r.review.split('!')[0] || r.review}"{!r.review.includes('!') ? '' : '!'}
                  </span>
                  <span className="hidden sm:inline">"{r.review}"</span>
                </p>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-[#7928CA] sm:px-3 sm:py-1 sm:text-xs"
                  style={{ backgroundColor: '#7928CA18' }}
                >
                  {r.tag}
                </span>
              </div>
            ))}
        </div>
      </div>
    ),
    itemClassName: 'bg-white border border-gray-100 dark:border-white/10 dark:bg-slate-900',
  },
  {
    id: 'profile',
    content: (
      <div className="flex h-full flex-col items-center justify-between gap-5 sm:gap-8 lg:flex-row lg:gap-10">
        <div className="flex-1 flex flex-col justify-center">
          <div
            className="mb-6 flex items-center justify-center rounded-2xl sm:mb-8"
            style={{ backgroundColor: '#0070F318', width: 60, height: 60 }}
          >
            <UserRound size={28} style={{ color: '#0070F3' }} />
          </div>
          <h3 className="mb-4 text-3xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:mb-5 sm:text-4xl">
            Personalised Profiles
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-slate-300 sm:hidden">
            Manage reviews, bookmarks, and your accessibility activity in one place.
          </p>
          <p className="hidden max-w-xl text-lg leading-relaxed text-gray-500 dark:text-slate-300 sm:block">
            Track your contributions, manage reviews, and bookmark favourite accessible places.
            Build your accessibility journey in one place.
          </p>
        </div>
        <div className="flex-1 rounded-3xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-slate-950 sm:p-8">
          <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-white/10 sm:mb-7 sm:gap-4 sm:pb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0070F3] to-[#7928CA] text-base font-black text-white sm:h-16 sm:w-16 sm:text-2xl">
              A
            </div>
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white sm:text-lg">
                Alex Johnson
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-400 sm:text-sm">
                Accessibility Advocate
              </p>
            </div>
            <span
              className="ml-auto rounded-full px-2 py-1 text-[9px] font-bold text-[#0070F3] sm:px-3 sm:py-1.5 sm:text-xs"
              style={{ backgroundColor: '#0070F318' }}
            >
              Verified ✓
            </span>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2 sm:mb-6 sm:gap-4">
            {[
              { val: '24', label: 'Reviews', color: '#0070F3' },
              { val: '11', label: 'Bookmarks', color: '#7928CA' },
              { val: '8', label: 'Places', color: '#FF0080' },
            ].map(({ val, label, color }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-2xl py-2.5 sm:py-4"
                style={{ backgroundColor: `${color}0D` }}
              >
                <span className="text-lg font-black sm:text-2xl" style={{ color }}>
                  {val}
                </span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400 sm:text-[10px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mb-2 text-[11px] font-semibold text-gray-400 dark:text-slate-400 sm:mb-3 sm:text-sm">
            Recent Activity
          </div>
          {['Reviewed City Mall', 'Bookmarked Central Park'].map((a) => (
            <div
              key={a}
              className="flex items-center gap-2.5 border-b border-gray-100 py-2 last:border-0 dark:border-white/10 sm:gap-3 sm:py-2.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#0070F3] sm:h-2 sm:w-2" />
              <span className="text-xs text-gray-600 dark:text-slate-300 sm:text-sm">{a}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    itemClassName: 'bg-white border border-gray-100 dark:border-white/10 dark:bg-slate-900',
  },
];

/* ─────────────────────────────────────────────
   Section
───────────────────────────────────────────── */
export default function FeaturesBento() {
  return (
    <section className="relative w-full overflow-visible bg-transparent transition-colors duration-300 dark:bg-slate-950">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[700px] rounded-full bg-gradient-to-br from-[#FF0080]/5 via-[#7928CA]/5 to-[#0070F3]/5 blur-3xl" />
      </div>

      {/* ScrollStack feature cards */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-32">
        <ScrollStack
          useWindowScroll={true}
          itemDistance={90}
          itemScale={0.0}
          itemStackDistance={0}
          stackPosition="25%"
          scaleEndPosition="10%"
          baseScale={1.05}
          rotationAmount={0}
          blurAmount={1}
          mobileStackPosition="50%"
          mobileScaleEndPosition="70%"
          mobilePinAlignment="center"
        >
          {featureCards.map((card) => (
            <ScrollStackItem
              key={card.id}
              itemClassName={`mx-auto h-[34rem] w-full max-w-[26rem] overflow-hidden p-5 sm:h-auto sm:max-w-none sm:min-h-[650px] sm:p-12 ${card.itemClassName ?? ''}`}
              style={card.style}
            >
              {card.content}
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
