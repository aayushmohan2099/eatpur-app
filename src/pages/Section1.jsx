import React from "react";
import sectionBackground from "../assets/temp/section1.jpg";
import logoCard1 from "../assets/temp/logocard11.png";
import logoCard2 from "../assets/temp/logocard22.png";
import logoCard3 from "../assets/temp/logocard33.png";

const audiences = [
  {
    name: "For EatPur",
    detail:
      "More predictable sourcing, clear grain specifications, better supply planning and stronger traceability.",
    accent: "border-t-[#ea580c]",
    indexColor: "text-[#ea580c]",
    logo: logoCard1,
  },
  {
    name: "For farmers",
    detail:
      "A buyer relationship before sowing, crop-diversification options, quality guidance and a potential route to better price realisation.",
    accent: "border-t-[#15803d]",
    indexColor: "text-[#15803d]",
    logo: logoCard2,
  },
  {
    name: "For consumers",
    detail:
      "A clearer origin story and greater access to convenient millet-based food choices.",
    accent: "border-t-[#ca8a04]",
    indexColor: "text-[#ca8a04]",
    logo: logoCard3,
  },
];

export default function Section1() {
  return (
    <section
      className="farmer-section relative isolate overflow-hidden bg-[#f7f2e7] bg-cover bg-center px-5 py-8 text-[#173629] sm:px-8 sm:py-10 lg:px-12 lg:py-12"
      style={{ backgroundImage: `url(${sectionBackground})` }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#fffdf7]/10" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-10 flex items-center gap-2 sm:mb-12">
          <span className="h-2 w-2 rounded-full bg-[#b8754e]" />
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#986747] sm:text-xs">
            EATPUR <span className="px-1 text-[#54745c]">·</span> EATPUR
            NATURALS LLP
          </p>
        </div>

        <div className="mb-8 max-w-3xl sm:mb-10">
          <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#315840] sm:text-xs">
            From product brand to farm-to-food value chain
          </p>
          <h1 className="font-serif text-4xl font-bold leading-[1.03] tracking-[-0.035em] text-[#173629] sm:text-5xl lg:text-6xl">
            Why build a farmer–FPO sourcing network?
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#26352e] sm:text-base sm:leading-7">
            A thoughtful connection between farmers, EatPur and consumers can
            make the millet value chain more transparent and predictable.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {audiences.map((audience, index) => (
            <article
              key={audience.name}
              className={`group relative min-h-48 overflow-hidden rounded-2xl border border-white/80 border-t-[5px] ${audience.accent} bg-white/65 p-5 shadow-[0_12px_32px_-18px_rgba(38,48,38,0.3)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_20px_38px_-18px_rgba(38,48,38,0.35)] sm:min-h-52 sm:p-6`}
            >
              <span
                className={`absolute right-5 top-3 font-serif text-3xl font-bold opacity-80 sm:text-4xl ${audience.indexColor}`}
              >
                0{index + 1}
              </span>

              <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/90 bg-white/75 p-1.5 shadow-[0_8px_20px_-12px_rgba(38,48,38,0.45)] sm:h-24 sm:w-24 sm:p-2">
                <img
                  src={audience.logo}
                  alt={audience.name}
                  className="h-full w-full scale-[1.50] rounded-full object-contain mix-blend-multiply"
                />
              </div>

              <h2 className="mb-2 font-serif text-xl font-bold text-[#18271e] sm:text-2xl">
                {audience.name}
              </h2>
              <p className="max-w-sm text-sm leading-6 text-[#2e3830]">
                {audience.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-white/80 bg-[#fffdf3]/75 px-5 py-5 shadow-[0_10px_28px_-18px_rgba(38,48,38,0.35)] backdrop-blur-md sm:mt-7 sm:px-8 sm:py-6">
          <p className="mx-auto max-w-4xl text-center text-sm font-semibold leading-6 text-[#1e3327] sm:text-base sm:leading-7">
            Proposed model: FPO-led farmer mobilisation + EatPur-led demand
            planning, quality standards, procurement and value addition.
          </p>
        </div>

        <p className="mx-auto mt-4 max-w-3xl text-center text-[0.68rem] leading-5 text-[#3e473e] sm:text-xs sm:leading-6">
          The aim is a fair commercial partnership—not a shift away from
          profitable crops or an unconditional purchase guarantee.
        </p>
      </div>
    </section>
  );
}
