import React from "react";
import section5Bg from "../assets/temp/section5.png";
import section4Logo1 from "../assets/temp/section4logo.png";
import section4Logo2 from "../assets/temp/section4logo2.png";
import section4Logo3 from "../assets/temp/section4logo3.png";

const impactAreas = [
  {
    id: "livelihoods",
    eyebrow: "People & opportunity",
    title: "Rural livelihoods",
    description:
      "Potential additional market access, FPO service revenue and local work in aggregation, grading, storage and transport.",
    logo: section4Logo1,
  },
  {
    id: "consumer",
    eyebrow: "From farm to table",
    title: "Consumer choice",
    description:
      "Convenient millet products can make traditional grains easier to include in everyday meals.",
    logo: section4Logo2,
  },
  {
    id: "food-system",
    eyebrow: "Local resilience",
    title: "Food system",
    description:
      "Crop diversification and better post-harvest handling can support a more resilient local value chain.",
    logo: section4Logo3,
  },
];

const socialOutcomes = [
  "Women’s SHGs-Farmer Groups/Club may participate in primary processing and allied services.",
  "Local sourcing can strengthen producer–processor connections.",
  "Millet nutrition and health claims must be product-specific, lab-verified and FSSAI-compliant.",
];

export default function Section5() {
  return (
    <section
      className="farmer-section relative overflow-hidden bg-[#f7f5ef] bg-cover bg-center bg-no-repeat px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      style={{ backgroundImage: `url(${section5Bg})` }}
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Centered Header */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#2c342b] sm:text-sm">
            Farm livelihoods, food choice and local value addition
          </p>
          <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[#254d2d] sm:text-5xl">
            The wider impact
          </h2>
        </div>

        {/* 3 Framed Impact Cards */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {impactAreas.map((area) => (
            <article
              key={area.title}
              className="group rounded-[26px] border-[5px] border-[#305437] bg-[#d4bc94] p-[3px] shadow-[0_18px_34px_-16px_rgba(25,45,28,0.45)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-16px_rgba(25,45,28,0.55)]"
            >
              <div className="flex h-full flex-col items-center rounded-[20px] bg-gradient-to-b from-[#fbfaf6] to-[#efeae0] px-6 py-7 text-center shadow-[inset_0_2px_10px_rgba(35,55,35,0.12)]">
                {/* Logo */}
                <div className="mb-4 flex h-20 items-center justify-center">
                  <img
                    src={area.logo}
                    alt={area.title}
                    className="max-h-full max-w-[96px] object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Eyebrow */}
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3a4239]">
                  {area.eyebrow}
                </p>

                {/* Title */}
                <h3 className="mb-3 font-serif text-2xl font-bold text-[#182219]">
                  {area.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-6 text-[#2d352d]">
                  {area.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Potential Social Outcomes Card */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/80 bg-[#f6f4ec]/90 px-6 py-6 shadow-[0_14px_30px_-18px_rgba(25,40,28,0.35)] backdrop-blur-sm sm:mt-10 sm:px-8 sm:py-7">
          {/* Subtle Gold Corner Accents */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-[3px] border-t-[3px] border-[#c8a15a]/80"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-[3px] border-l-[3px] border-[#c8a15a]/80"
          />

          <div className="mb-3.5 flex items-center gap-2.5">
            <h3 className="font-serif text-xl font-bold text-[#182219] sm:text-2xl">
              Potential social outcomes
            </h3>
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#92a586] text-sm font-bold text-white"
            >
              +
            </span>
          </div>

          <ul className="space-y-2">
            {socialOutcomes.map((outcome, index) => (
              <li
                key={outcome}
                className="flex items-start gap-2.5 text-sm leading-6 text-[#252d26] sm:text-[15px]"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b8914f]"
                />
                <span>
                  {outcome}
                  {index === 2 && (
                    <>
                      {" "}
                      <span className="font-bold text-[#182219]">
                        Do not position foods as disease treatments.
                      </span>{" "}
                      <span
                        aria-hidden="true"
                        className="inline-flex h-4 w-4 translate-y-[1px] items-center justify-center rounded-full bg-[#b38961] text-[10px] font-bold text-white"
                      >
                        !
                      </span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}