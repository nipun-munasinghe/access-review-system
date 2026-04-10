export default function HomePageLightBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden dark:hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,1)_0%,rgba(240,246,255,0.92)_45%,rgba(252,242,248,0.95)_100%)]" />

      <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_50%_28%,rgba(0,112,243,0.08),transparent_52%)]" />
      <div className="absolute inset-x-0 top-[34rem] h-[28rem] bg-[radial-gradient(circle_at_50%_50%,rgba(121,40,202,0.05),transparent_62%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[26rem] bg-[radial-gradient(circle_at_50%_70%,rgba(255,0,128,0.05),transparent_60%)]" />

      <div className="absolute -left-24 top-10 h-[22rem] w-[22rem] rounded-full bg-[#0070F3]/12 blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-[24rem] w-[24rem] rounded-full bg-[#FF0080]/10 blur-3xl" />
      <div className="absolute left-1/2 top-[40%] h-[26rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#7928CA]/10 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-[12%] h-[18rem] w-[18rem] rounded-full bg-[#38BDF8]/10 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[10%] h-[20rem] w-[20rem] rounded-full bg-[#FF0080]/8 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.7)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="absolute inset-x-0 top-[28rem] h-px bg-gradient-to-r from-transparent via-[#7928CA]/14 to-transparent" />
      <div className="absolute inset-x-0 top-[62rem] h-px bg-gradient-to-r from-transparent via-[#0070F3]/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-[28rem] h-px bg-gradient-to-r from-transparent via-[#FF0080]/12 to-transparent" />
    </div>
  );
}
