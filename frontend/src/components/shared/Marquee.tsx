import { MapPin, Star, Users, Zap, ShieldCheck, Navigation, BadgeCheck } from 'lucide-react';
import { AuroraText } from '@/components/shared/AuroraText';

const ITEMS = [
  { label: 'Accessible Spaces', icon: MapPin },
  { label: 'Inclusive Design', icon: ShieldCheck },
  { label: 'Smart Reviews', icon: Star },
  { label: 'Community Driven', icon: Users },
  { label: 'Real-Time Insights', icon: Zap },
  { label: 'Barrier-Free Access', icon: Navigation },
  { label: 'Verified Locations', icon: BadgeCheck },
];

function Separator() {
  return (
    <span className="mx-4 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-[#7928CA] to-[#0070F3] shadow-[0_0_6px_2px_rgba(121,40,202,0.4)]" />
  );
}

export function AccessifyMarquee() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <section className="w-full border-y border-white/60 bg-white/55 py-12 backdrop-blur-xl transition-colors duration-300 dark:border-transparent dark:bg-slate-950 sm:py-16">
      {/* Section label */}
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-slate-400">
        Everything you need with <AuroraText>AccessAble</AuroraText>
      </p>

      {/* Scrolling track */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex w-max cursor-default"
          style={{ animation: 'marquee 28s linear infinite' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'running')
          }
        >
          {track.map((item, i) => {
            const Icon = item.icon;
            return (
              <span
                key={i}
                className="flex flex-shrink-0 items-center gap-2.5 px-6 transition-transform duration-300 hover:scale-105 sm:px-8"
              >
                {/* Icon bubble */}
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7928CA] to-[#0070F3]">
                  <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
                </span>

                {/* Label */}
                <span className="bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#0070F3] bg-clip-text text-base font-semibold text-transparent sm:text-lg">
                  {item.label}
                </span>

                <Separator />
              </span>
            );
          })}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fbfcff] via-[#fbfcff]/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fcf8fb] via-[#fcf8fb]/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 sm:w-40" />
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
