import React, { useState } from "react";
import sectionBackground from "../assets/temp/section2.jpg";
import UPMap from "../styles/UpMap.jsx";
import "../styles/section2.css";

const crops = {
  bajra: {
    localName: "BAJRA",
    name: "Pearl millet",
    category: "Core crop - bulk procurement",
    description: "An established, drought-tolerant crop with potential for flour, blends and snacks.",
    accent: "bg-[#fcece9] text-[#a04733]",
    borderColor: "border-[#a04733]",
    dotColor: "bg-[#a04733]",
    dummyDetails: {
      yield: "1.2 - 1.5 tonnes/ha",
      water: "Low (250-300mm)",
      soil: "Sandy loam to shallow black",
      demand: "High in winter season",
    }
  },
  jowar: {
    localName: "JOWAR",
    name: "Sorghum",
    category: "Core crop - bulk procurement",
    description: "A versatile grain to explore for flour, blends and value-added foods.",
    accent: "bg-[#fdf6e7] text-[#be8b3c]",
    borderColor: "border-[#be8b3c]",
    dotColor: "bg-[#be8b3c]",
    dummyDetails: {
      yield: "1.5 - 2.0 tonnes/ha",
      water: "Moderate (400-500mm)",
      soil: "Heavy soils, well-drained",
      demand: "Year-round staple",
    }
  },
  cheena: {
    localName: "CHEENA",
    name: "Proso millet",
    category: "Trial crop",
    description: "A short-duration millet to assess for seed availability, local yield and market fit.",
    accent: "bg-[#eef2ef] text-[#2c4e3c]",
    borderColor: "border-[#2c4e3c]",
    dotColor: "bg-[#2c4e3c]",
    dummyDetails: {
      yield: "0.8 - 1.0 tonnes/ha",
      water: "Very Low (200mm)",
      soil: "Light, sandy soils",
      demand: "Niche dietary markets",
    }
  },
  sanwa: {
    localName: "SANWA",
    name: "Barnyard millet",
    category: "Specialty crop",
    description: "A specialty grain to explore for ready-to-cook foods, subject to local validation.",
    accent: "bg-[#faeaea] text-[#86372c]",
    borderColor: "border-[#86372c]",
    dotColor: "bg-[#86372c]",
    dummyDetails: {
      yield: "1.0 - 1.2 tonnes/ha",
      water: "Moderate (300-400mm)",
      soil: "Marginal lands",
      demand: "Fasting & specialty foods",
    }
  },
  kodo: {
    localName: "KODO",
    name: "Kodo millet",
    category: "Pilot crop - limited volumes",
    description: "Explore suitable growing clusters for khichdi and grain blends.",
    accent: "bg-[#f1f4f1] text-[#7a9379]",
    borderColor: "border-[#7a9379]",
    dotColor: "bg-[#7a9379]",
    dummyDetails: {
      yield: "0.9 - 1.1 tonnes/ha",
      water: "Low (250-350mm)",
      soil: "Gravelly and stony soils",
      demand: "Health & wellness sector",
    }
  },
};

// Map region IDs mapped to specific crops
const regionToCropMap = {
  31312: "bajra",   // Western UP -> Bajra
  31314: "jowar",   // Central UP -> Jowar
  31313: "kodo",    // Eastern UP -> Kodo
  31315: "sanwa",   // Bundelkhand -> Sanwa
  31311: "cheena",  // Southern UP -> Cheena
};

const CropCard = ({ cropKey, data, active, isEnlarged, isHidden, onActivate, onDeactivate }) => (
  <article
    tabIndex={0}
    onMouseEnter={() => onActivate(cropKey)}
    onMouseLeave={onDeactivate}
    onFocus={() => onActivate(cropKey)}
    onBlur={onDeactivate}
    className={`relative w-full rounded-2xl border-4 ${data.borderColor} bg-white/95 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-500 sm:p-5
      ${isHidden ? "opacity-0 pointer-events-none scale-95 absolute" : "opacity-100 relative"}
      ${isEnlarged ? "scale-[1.15] z-30 shadow-[0_24px_50px_rgba(41,51,43,0.25)] -translate-y-2" : ""}
      ${active && !isEnlarged && !isHidden ? "-translate-y-1 scale-[1.02] shadow-[0_16px_40px_rgba(41,51,43,0.18)]" : ""}
    `}
  >
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${data.accent}`}
        >
          {data.localName}
        </span>
        <h3 className="font-sans text-base font-semibold text-[#29332b] sm:text-lg">
          {data.name}
        </h3>
      </div>
      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${data.dotColor}`} />
    </div>
    
    <p className="mb-1.5 text-xs font-semibold text-[#4a554e] sm:text-sm">
      {data.category}
    </p>
    <p className="text-xs leading-5 text-slate-700 sm:text-sm sm:leading-6">
      {data.description}
    </p>

    {/* Dummy Data Section - Only visible when Map is hovered (isEnlarged) */}
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isEnlarged ? "max-h-[200px] mt-4 opacity-100" : "max-h-0 mt-0 opacity-0"
      }`}
    >
      <div className={`rounded-lg p-3 text-xs ${data.accent} bg-opacity-20`}>
        <p className="mb-1.5 font-bold uppercase tracking-wider text-[#29332b] text-[0.65rem]">
          Crop Statistics (Est.)
        </p>
        <ul className="space-y-1.5 text-slate-800">
          <li className="flex justify-between">
            <span className="font-semibold opacity-75">Avg. Yield:</span> 
            <span>{data.dummyDetails.yield}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold opacity-75">Water Req:</span> 
            <span>{data.dummyDetails.water}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold opacity-75">Soil Match:</span> 
            <span>{data.dummyDetails.soil}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold opacity-75">Demand:</span> 
            <span>{data.dummyDetails.demand}</span>
          </li>
        </ul>
      </div>
    </div>
  </article>
);

export default function Section2() {
  const [activeCrop, setActiveCrop] = useState(null);
  const [hoveredRegionId, setHoveredRegionId] = useState(null); 

  const activeCropFromMap = hoveredRegionId ? regionToCropMap[hoveredRegionId] : null;

  return (
    <section
      className="farmer-section relative isolate min-h-[720px] w-full overflow-hidden bg-[#f7f5ef] px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[760px] lg:px-12"
      style={{
        backgroundImage: `url(${sectionBackground})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-white/[0.03]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#556348] sm:text-sm">
            Indicative crop portfolio
          </p>
          <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[#1e2621] sm:text-5xl lg:text-[3.25rem]">
            Millets to explore in Central Uttar Pradesh
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
            Start with established regional grains, then explore additional
            millets where local growing conditions and demand make sense.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(220px,1fr)_minmax(330px,430px)_minmax(220px,1fr)] lg:gap-7 xl:gap-10">
          
          {/* Left Cards */}
          <div className="flex flex-col gap-5 lg:gap-24 lg:pt-8 relative">
            {["bajra", "cheena"].map((cropKey) => (
              <CropCard
                key={cropKey}
                cropKey={cropKey}
                data={crops[cropKey]}
                active={activeCrop === cropKey}
                isEnlarged={activeCropFromMap === cropKey}
                isHidden={activeCropFromMap !== null && activeCropFromMap !== cropKey}
                onActivate={setActiveCrop}
                onDeactivate={() => setActiveCrop(null)}
              />
            ))}
          </div>

          {/* Center Map & Sanwa Card */}
          <div className="relative mx-auto w-full max-w-[430px] z-10">
            <div className="relative aspect-[586/550] w-full">
              <UPMap onHover={setHoveredRegionId} />
            </div>

            <div className="mt-4 relative">
              <CropCard
                cropKey="sanwa"
                data={crops.sanwa}
                active={activeCrop === "sanwa"}
                isEnlarged={activeCropFromMap === "sanwa"}
                isHidden={activeCropFromMap !== null && activeCropFromMap !== "sanwa"}
                onActivate={setActiveCrop}
                onDeactivate={() => setActiveCrop(null)}
              />
            </div>
          </div>

          {/* Right Cards */}
          <div className="flex flex-col gap-5 lg:gap-24 lg:pb-8 relative">
            {["jowar", "kodo"].map((cropKey) => (
              <CropCard
                key={cropKey}
                cropKey={cropKey}
                data={crops[cropKey]}
                active={activeCrop === cropKey}
                isEnlarged={activeCropFromMap === cropKey}
                isHidden={activeCropFromMap !== null && activeCropFromMap !== cropKey}
                onActivate={setActiveCrop}
                onDeactivate={() => setActiveCrop(null)}
              />
            ))}
          </div>

        </div>

        <div className="mx-auto mt-8 max-w-5xl rounded-xl bg-[#a4a091]/95 px-5 py-4 text-center text-xs font-medium leading-5 text-white shadow-lg backdrop-blur-sm sm:px-6 sm:py-5 sm:text-sm sm:leading-6">
          Begin with bajra and jowar. Consider kodo, cheena and sanwa only after
          district-level validation with KVKs or agriculture experts. Crop
          suitability varies by soil, water, variety and local practice.
        </div>
      </div>
    </section>
  );
}