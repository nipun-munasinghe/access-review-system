"use client";
import ScrollFloat from "@/components/ui/ScrollFloat";

import { motion } from "framer-motion";
import {
  MapPinned,
  Accessibility,
  Star,
  UserRound,
  ShieldCheck,
  Map,
  Navigation,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Tiny reusable fade-up wrapper
───────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Fake map mockup — built entirely in Tailwind
───────────────────────────────────────────── */
function MapMockup() {
  const pins = [
    { top: "22%", left: "28%", color: "#FF0080", label: "City Mall" },
    { top: "55%", left: "58%", color: "#7928CA", label: "Central Park" },
    { top: "38%", left: "72%", color: "#0070F3", label: "Metro Hub" },
    { top: "68%", left: "30%", color: "#38BDF8", label: "Library" },
  ];

  const features = [
    { icon: "♿", label: "Ramp" },
    { icon: "🛗", label: "Lift" },
    { icon: "👁", label: "Braille" },
    { icon: "🔇", label: "Quiet" },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border border-gray-100 shadow-inner"
      style={{ height: "260px" }}>

      {/* Grid lines for map feel */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0070F3" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Faint roads */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#334155" strokeWidth="6" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#334155" strokeWidth="3" />
        <line x1="38%" y1="0" x2="38%" y2="100%" stroke="#334155" strokeWidth="6" />
        <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#334155" strokeWidth="3" />
      </svg>

      {/* Soft colour zone fills */}
      <div className="absolute rounded-full blur-2xl opacity-20"
        style={{ width: 100, height: 100, top: "10%", left: "20%", backgroundColor: "#FF0080" }} />
      <div className="absolute rounded-full blur-2xl opacity-15"
        style={{ width: 120, height: 120, top: "40%", left: "50%", backgroundColor: "#7928CA" }} />

      {/* Map pins */}
      {pins.map((p) => (
        <div
          key={p.label}
          className="absolute flex flex-col items-center"
          style={{ top: p.top, left: p.left, transform: "translate(-50%,-100%)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg text-white text-[10px] font-black ring-2 ring-white"
            style={{ backgroundColor: p.color }}
          >
            <MapPinned size={12} />
          </div>
          <div
            className="mt-0.5 px-2 py-0.5 rounded-full text-[8px] font-bold text-white shadow-md whitespace-nowrap"
            style={{ backgroundColor: p.color }}
          >
            {p.label}
          </div>
        </div>
      ))}

      {/* Bottom feature badge strip */}
      <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
        {features.map((f) => (
          <span
            key={f.label}
            className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm"
          >
            <span>{f.icon}</span> {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Floating info card (inside main card)
───────────────────────────────────────────── */
function FloatingInfoCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-4 -right-2 z-10 bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 border border-white/10"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#FF008022" }}
      >
        <Navigation size={16} style={{ color: "#FF0080" }} />
      </div>
      <div>
        <p className="text-[9px] uppercase font-black tracking-widest opacity-50">Nearby</p>
        <p className="text-xs font-black leading-tight">4 Accessible Spots</p>
      </div>
    </motion.div>
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
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section
───────────────────────────────────────────── */
export default function FeaturesBento() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-24 md:py-32">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[700px] rounded-full bg-gradient-to-br from-[#FF0080]/5 via-[#7928CA]/5 to-[#0070F3]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-80 rounded-full bg-[#38BDF8]/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* ── Section header ── */}
        <FadeUp className="flex flex-col items-center text-center gap-5 mb-16 mx-auto max-w-2xl">
          {/* Eyebrow */}
            <ScrollFloat
              containerClassName="!my-0 !overflow-visible"
              textClassName="!text-[0.68rem] !leading-none uppercase tracking-[0.22em] text-gray-400 font-semibold"
              animationDuration={0.85}
              ease="power2.out"
              stagger={0.012}
              scrollStart="center bottom+=25%"
              scrollEnd="bottom bottom-=55%"
            >
              Inclusive by Design
            </ScrollFloat>

          {/* Heading */}
          {/* ── Heading: single line via whitespace-nowrap on desktop ── */}
          <h2
            className="w-full font-black tracking-tight leading-[1.05] text-gray-900"
            style={{ fontSize: "clamp(1.6rem, 3.6vw, 3.5rem)" }}
          >
            Designed for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right,#FF0080,#7928CA,#0070F3)" }}
            >
              Inclusive
            </span>{" "}
            Exploration
          </h2>

          {/* Paragraph */}
          <p className="text-gray-500 text-base leading-relaxed max-w-xl">
            AccessAble helps you discover, review, and truly understand the accessibility of public
            spaces — powered by community-driven insights and meaningful real-world data.
          </p>
        </FadeUp>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ═══ MAIN HERO CARD — Interactive Map View ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 group"
          >
            <div className="relative h-full rounded-[2.5rem] border border-gray-100 bg-white p-8 lg:p-10 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

              {/* Card ambient glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse at 15% 10%, #FF008008 0%, transparent 60%)" }}
              />

              {/* Card header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: "#FF008018" }}
                  >
                    <Map size={22} style={{ color: "#FF0080" }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-gray-900">Interactive Map View</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Live Discovery</p>
                  </div>
                </div>
                {/* Window dots */}
                <div className="flex gap-1.5 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-300/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-300/60" />
                </div>
              </div>

              {/* Map mockup */}
              <div className="relative mb-8">
                <MapMockup />
                {/* Floating card sits over the bottom-right of the map */}
                <div className="absolute bottom-4 right-4">
                  <FloatingInfoCard />
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                Visualize accessible locations on a live, interactive map. Explore what's nearby,
                filter by facility type, and navigate every public space with total confidence.
              </p>

              {/* Mini location cards row */}
              <div className="mt-6 flex gap-3 flex-wrap">
                {[
                  { name: "City Mall", rating: 4, badge: "Wheelchair ✓", color: "#FF0080" },
                  { name: "Central Park", rating: 5, badge: "Quiet Zone ✓", color: "#7928CA" },
                  { name: "Metro Hub", rating: 3, badge: "Elevator ✓", color: "#0070F3" },
                ].map((loc) => (
                  <div
                    key={loc.name}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${loc.color}18` }}
                    >
                      <MapPinned size={14} style={{ color: loc.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-none mb-1">{loc.name}</p>
                      <Stars rating={loc.rating} />
                    </div>
                    <span
                      className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${loc.color}18`, color: loc.color }}
                    >
                      {loc.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-10 right-10 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to right, #FF0080, transparent)" }}
              />
            </div>
          </motion.div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* ── Side card 1: Explore Accessibility Features (accent) ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="group flex-1"
            >
              <div
                className="relative h-full rounded-[2.5rem] p-8 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #7928CA 0%, #0070F3 100%)" }}
              >
                {/* Blur glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#FF0080]/20 blur-2xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Accessibility size={22} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-black tracking-tight text-white mb-3 leading-tight">
                    Explore Accessibility Features
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Check wheelchair ramps, elevators, tactile paths, handrails, braille signage,
                    quiet zones, and accessible entrances — all in one place.
                  </p>
                </div>

                {/* Feature chips */}
                <div className="relative z-10 mt-7 flex flex-wrap gap-2">
                  {["♿ Ramp", "🛗 Lift", "👁 Braille", "🔇 Quiet", "🚪 Entry"].map((chip) => (
                    <span
                      key={chip}
                      className="text-[10px] font-bold bg-white/15 backdrop-blur-sm border border-white/20 text-white px-2.5 py-1 rounded-full"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Side card 2: Trusted Platform — stat card ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="group"
            >
              <div className="relative rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                {/* Subtle glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at 80% 80%, #38BDF808, transparent 65%)" }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: "#38BDF818" }}
                  >
                    <ShieldCheck size={22} style={{ color: "#38BDF8" }} />
                  </div>

                  <h3 className="text-xl font-black tracking-tight text-gray-900 mb-2 leading-tight">
                    Trusted & Inclusive Platform
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-7">
                    Community-powered and built on transparency — giving everyone
                    reliable information to move freely through the world.
                  </p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: "1,200+", label: "Reviews", color: "#FF0080" },
                      { val: "250+", label: "Places", color: "#7928CA" },
                      { val: "40+", label: "Features", color: "#0070F3" },
                    ].map(({ val, label, color }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center text-center rounded-2xl py-3 px-2"
                        style={{ backgroundColor: `${color}0D` }}
                      >
                        <span className="text-xl font-black leading-none" style={{ color }}>
                          {val}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to right, #38BDF8, transparent)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom 3-card strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
          {[
            {
              icon: MapPinned,
              title: "Discover Public Spaces",
              desc: "Find parks, malls, transit hubs, and buildings with community-verified accessibility details.",
              accent: "#FF0080",
              delay: 0,
            },
            {
              icon: Star,
              title: "Share Accessibility Reviews",
              desc: "Submit honest, experience-based reviews that help others navigate with confidence.",
              accent: "#7928CA",
              delay: 0.08,
            },
            {
              icon: UserRound,
              title: "Personalized Profiles",
              desc: "Track your contributions, manage reviews, and bookmark favourite accessible places.",
              accent: "#0070F3",
              delay: 0.16,
            },
          ].map(({ icon: Icon, title, desc, accent, delay }) => (
            <FadeUp key={title} delay={delay}>
              <div className="group relative rounded-3xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${accent}0A 0%, transparent 65%)` }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${accent}18` }}
                >
                  <Icon size={20} style={{ color: accent }} strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div
                  className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}