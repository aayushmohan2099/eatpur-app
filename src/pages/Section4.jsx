import React from "react";
import section4Bg from "../assets/temp/section4.png"; // apni template image ka exact naam yahan update kar lein

const responsibilities = [
  {
    name: "Eatpur Naturals LLP",
    hasBadge: true,
    accent: "border-l-[#d96c27]",
    bullet: "bg-[#d96c27]",
    duties: [
      "Share demand forecasts and crop specifications",
      "Support technical training and quality protocols",
      "Define procurement windows and pricing formulas",
      "Inspect lots and make payments as agreed",
      "Maintain procurement and traceability records",
    ],
  },
  {
    name: "FPO / farmer collective",
    hasBadge: false,
    accent: "border-l-[#5f7d4e]",
    bullet: "bg-[#5f7d4e]",
    duties: [
      "Mobilise and enrol interested farmers",
      "Coordinate crop planning and field-level communication",
      "Facilitate aggregation, cleaning and grading",
      "Maintain farmer and lot-level records",
      "Coordinate delivery and farmer payment communication",
    ],
  },
];

const mouTerms = [
  "Crop and quantity estimates",
  "Quality standards",
  "Transparent benchmark and quality premium",
  "Delivery schedule",
  "Weighment and rejection process",
  "Payment timeline",
  "Crop-failure and force-majeure terms",
  "Dispute resolution",
];

function CheckBadgeIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e4ecdc] text-[#5c7849]"
    >
      <svg
        viewBox="0 0 12 12"
        fill="none"
        className="h-2.5 w-2.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 6.2L4.8 8.5L9.5 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Section4() {
  return (
    <section
      className="farmer-section relative overflow-hidden bg-[#f7f5ef] bg-cover bg-center bg-no-repeat px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
      style={{ backgroundImage: `url(${section4Bg})` }}
    >
      {/* Subtle readability wash over background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f7f5f0]/80 via-[#f7f5f0]/50 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#3f4a45] sm:text-sm">
            FPO as aggregation partner
          </p>
          <h2 className="max-w-4xl font-serif text-3xl font-bold leading-tight tracking-tight text-[#163c42] sm:text-4xl lg:text-[2.65rem]">
            Proposed MoU: clear roles, fair terms
          </h2>
        </div>

        {/* Two Partner Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {responsibilities.map((partner) => (
            <article
              key={partner.name}
              className={`relative rounded-xl border border-white/70 border-l-[5px] ${partner.accent} bg-white/88 px-6 pb-6 pt-7 shadow-[0_14px_34px_-16px_rgba(20,35,30,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-1 sm:px-7 sm:pb-7 sm:pt-8`}
            >
              {/* Floating Leaf Badge on Eatpur Card */}
              {partner.hasBadge && (
                <div className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-lg border border-[#e6dfd3] bg-white shadow-md">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    className="h-7 w-7"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      stroke="#d96c27"
                      strokeWidth="1.5"
                      fill="#f8f5ef"
                    />
                    <path
                      d="M16 23V13M16 18C13 18 11 16 11 13C14 13 16 15 16 18ZM16 16C19 16 21 14 21 11C18 11 16 13 16 16Z"
                      stroke="#4f7443"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <h3 className="mb-4 font-sans text-xl font-bold text-[#1e2622] sm:text-[1.35rem]">
                {partner.name}
              </h3>

              <ul className="space-y-2.5">
                {partner.duties.map((duty) => (
                  <li
                    key={duty}
                    className="flex items-start gap-2.5 text-sm leading-6 text-[#2f3632] sm:text-[15px]"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${partner.bullet}`}
                    />
                    <span>{duty}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* MoU Essentials Card */}
        <div className="mt-6 rounded-xl border border-white/75 bg-[#edf2e7]/92 px-5 py-6 shadow-[0_14px_32px_-16px_rgba(20,35,30,0.32)] backdrop-blur-md sm:mt-7 sm:px-8 sm:py-7">
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#394537] sm:text-sm">
            MoU essentials
          </p>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {mouTerms.map((term) => (
              <li
                key={term}
                className="inline-flex items-center gap-2 rounded-full border border-[#d6e0ce] bg-white/95 px-3.5 py-1.5 text-xs font-medium text-[#273128] shadow-[0_2px_8px_-4px_rgba(20,35,30,0.3)] sm:text-[13px]"
              >
                <CheckBadgeIcon />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Dark Teal Note Bar */}
        <div className="mt-4 rounded-lg bg-[#163c46] px-5 py-3 shadow-[0_10px_24px_-12px_rgba(12,35,42,0.75)] sm:px-6">
          <p className="flex items-center justify-center gap-2 text-center text-xs font-medium leading-5 text-white/95 sm:text-sm">
            <span>
              Keep estimated production separate from firm procurement
              commitments. Publish rejection standards and avoid unilateral
              price changes.
            </span>
            <span
              aria-hidden="true"
              className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-white/80 sm:inline-block"
            />
          </p>
        </div>
      </div>
    </section>
  );
}