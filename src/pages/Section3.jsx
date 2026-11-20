import React from "react";
import sectionBackground from "../assets/temp/section12.png";

const supportSteps = [
  {
    number: "01",
    title: "Identify",
    description:
      "FPOs map interested farmers, land, crop history and suitable clusters.",
    outerBorder: "border-[#6e5642]",
    innerBorder: "border-[#4b6346]",
    accentFill: "#4b6346",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "EatPur shares crop, variety, quality and indicative demand before sowing.",
    outerBorder: "border-[#b55b37]",
    innerBorder: "border-[#b55b37]/40",
    accentFill: "#a8b38c",
  },
  {
    number: "03",
    title: "Support",
    description:
      "Training on good agricultural practices, harvesting, drying, cleaning and storage.",
    outerBorder: "border-[#5e4d3a]",
    innerBorder: "border-[#3c5737]",
    accentFill: "#3c5737",
  },
  {
    number: "04",
    title: "Aggregate",
    description:
      "FPO coordinates collection, weighing, grading and lot-level records.",
    outerBorder: "border-[#b8974b]",
    innerBorder: "border-[#8c9d6e]/60",
    accentFill: "#8c9d6e",
  },
  {
    number: "05",
    title: "Procure",
    description:
      "EatPur buys accepted lots under agreed pricing, quality and payment terms.",
    outerBorder: "border-[#8c6b3f]",
    innerBorder: "border-[#b55b37]/50",
    accentFill: "#b55b37",
  },
];

function LeafDivider() {
  return (
    <div
      aria-hidden="true"
      className="hidden shrink-0 items-center justify-center lg:flex"
    >
      <svg
        width="26"
        height="96"
        viewBox="0 0 26 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#5d684a] opacity-75"
      >
        <path
          d="M13 8C16 26 10 42 13 60C15 72 13 82 11 90"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M13 24C8 20 5 15 4 10C9 12 12 17 13 24Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M13 38C18 33 21 28 22 23C17 26 14 31 13 38Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M12 56C7 52 4 47 3 42C8 45 11 50 12 56Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M13 70C18 66 21 61 22 56C17 59 14 64 13 70Z"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

function StepIcon({ number, title }) {
  const iconClass = "h-24 w-24";

  if (number === "01") {
    return (
      <svg viewBox="0 0 96 96" aria-label={title} className={iconClass} fill="none">
        <circle cx="48" cy="48" r="38" fill="#eef1d9" />
        <path d="M48 61c-7-12-4-24 1-35 6 12 10 23 7 31M48 61c-11-7-18-16-21-27 13 2 20 9 21 27ZM49 61c10-7 18-15 20-28-12 3-18 10-20 28Z" stroke="#4b6346" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27 76h42M48 61v15" stroke="#2f4934" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (number === "02") {
    return (
      <svg viewBox="0 0 96 96" aria-label={title} className={iconClass} fill="none">
        <circle cx="48" cy="48" r="38" fill="#f1e5cf" />
        <rect x="25" y="23" width="46" height="52" rx="5" fill="#fffdf6" stroke="#a8b38c" strokeWidth="3" />
        <path d="M36 36h24M36 48h24M36 60h13" stroke="#b55b37" strokeWidth="3" strokeLinecap="round" />
        <circle cx="63" cy="63" r="10" fill="#b55b37" />
        <path d="M58 63l3 3 7-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (number === "03") {
    return (
      <svg viewBox="0 0 96 96" aria-label={title} className={iconClass} fill="none">
        <circle cx="48" cy="48" r="38" fill="#dfe9df" />
        <circle cx="48" cy="30" r="11" fill="#fffdf6" stroke="#4f704f" strokeWidth="3" />
        <path d="M48 41v26M34 50l14 8 14-8M30 73c3-12 9-18 18-18s15 6 18 18" stroke="#4f704f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 72h46" stroke="#9a7a48" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (number === "04") {
    return (
      <svg viewBox="0 0 96 96" aria-label={title} className={iconClass} fill="none">
        <circle cx="48" cy="48" r="38" fill="#edf0df" />
        <path d="M24 67V39l24-14 24 14v28H24Z" fill="#fffdf6" stroke="#7d8f62" strokeWidth="3" strokeLinejoin="round" />
        <path d="M24 39l24 14 24-14M48 53v14M35 46v21M61 46v21" stroke="#7d8f62" strokeWidth="3" strokeLinejoin="round" />
        <path d="M18 74h60" stroke="#9a7a48" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" aria-label={title} className={iconClass} fill="none">
      <circle cx="48" cy="48" r="38" fill="#f1e5d7" />
      <circle cx="48" cy="48" r="24" fill="#fffdf6" stroke="#a26f47" strokeWidth="3" />
      <path d="M48 34v28M56 39c-2-3-5-5-9-5-5 0-9 3-9 7 0 5 5 7 11 9 6 2 10 4 10 8 0 5-5 8-11 8-5 0-9-2-12-5" stroke="#a26f47" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Section3() {
  return (
    <section
      className="farmer-section relative overflow-hidden bg-[#f7f5ef] bg-cover bg-center bg-no-repeat px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      style={{ backgroundImage: `url(${sectionBackground})` }}
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#353d32] sm:text-sm">
            A practical support pathway
          </p>
          <h2 className="max-w-4xl font-serif text-3xl font-bold leading-tight tracking-tight text-[#944726] sm:text-4xl lg:text-5xl">
            How the partnership benefits farmers
          </h2>
        </div>

        {/* 5 Step Cards */}
        <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:items-stretch lg:gap-1.5">
          {supportSteps.map((step, index) => (
            <React.Fragment key={step.number}>
              <article
                className={`group relative flex flex-1 flex-col overflow-hidden rounded-xl border-[3px] ${step.outerBorder} bg-[#f5f0e2]/95 p-1.5 shadow-[0_10px_24px_-12px_rgba(45,35,20,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_-14px_rgba(45,35,20,0.5)]`}
              >
                {/* Inner Botanical Frame */}
                <div
                  className={`relative flex h-full flex-col rounded-lg border-2 ${step.innerBorder} bg-[#f7f3e6] px-4 py-4`}
                >
                  {/* Decorative corner foliage */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 60 60"
                    className="pointer-events-none absolute right-0 top-0 h-14 w-14 opacity-25"
                    fill={step.accentFill}
                  >
                    <path d="M60 0C44 2 34 12 30 26C44 22 54 12 60 0Z" />
                    <path d="M60 18C48 20 42 28 40 38C50 35 57 28 60 18Z" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 60 60"
                    className="pointer-events-none absolute bottom-0 left-0 h-12 w-12 rotate-180 opacity-20"
                    fill={step.accentFill}
                  >
                    <path d="M60 0C44 2 34 12 30 26C44 22 54 12 60 0Z" />
                  </svg>

                  {/* Step Number */}
                  <span className="relative z-10 font-sans text-lg font-extrabold tracking-wide text-[#9d7a3a]">
                    {step.number}
                  </span>

                  {/* Logo / Icon */}
                  <div className="relative z-10 my-2 flex h-24 items-center justify-center">
                    <StepIcon number={step.number} title={step.title} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="relative z-10 mb-1.5 font-sans text-lg font-bold text-[#243023]">
                    {step.title}
                  </h3>
                  <p className="relative z-10 text-xs leading-relaxed text-[#3a4236] sm:text-[13px]">
                    {step.description}
                  </p>
                </div>
              </article>

              {index < supportSteps.length - 1 && <LeafDivider />}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Bronze Plaque Banner */}
        <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
          <div className="rounded-md border-2 border-[#7b4f32] bg-gradient-to-r from-[#875234] via-[#d3aa89] to-[#875234] p-1 shadow-[0_10px_22px_-10px_rgba(45,28,15,0.65)]">
            <div className="rounded-sm border border-[#e7cbb0]/60 px-5 py-3.5 sm:px-8 sm:py-4">
              <p className="text-center text-sm font-bold leading-6 text-[#231912] sm:text-base sm:leading-7">
                Farmer benefit to measure: incremental net realisation after
                input, labour, transport and other cultivation costs—not just
                the sale price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}