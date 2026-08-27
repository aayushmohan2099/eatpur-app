// src/components/PolicyModal.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// SVG Icons
const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const LeafIcon = () => (
  <svg
    className="w-6 h-6 text-[--color-eatpur-green-dark]"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// POLICY DATA MAP
// ---------------------------------------------------------------------------
const POLICIES = {
  1: {
    title: "Terms of Service & Limitation of Liability",
    sections: [
      {
        subtitle: "1.1. Acceptance of Terms",
        text: "By browsing this website or purchasing our millet-based products, you agree to these Terms of Service.",
      },
      {
        subtitle: '1.2. "As Is" Warranty Disclaimer',
        text: 'All products, ingredients, and information are provided on an "as is" and "as available" basis. EatPur Naturals LLP ("EatPur") expressly disclaims all implied warranties of merchantability, durability, and fitness for a particular purpose.',
      },
      {
        subtitle: "1.3. Damages Waiver & Liability Cap",
        text: 'EatPur Naturals LLP ("EatPur") shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages arising from the purchase or consumption of our products. Our total liability is strictly capped at the exact amount paid for the specific order giving rise to the claim, or EatPur Naturals LLP ("EatPur"), whichever is greater.',
      },
      {
        subtitle: "1.4. Mandatory Binding Arbitration & Class Action Waiver",
        text: "Any claims, controversies, or disputes arising from website use or product consumption shall be resolved exclusively through individual binding arbitration. By using this site, you waive any right to participate in class-action lawsuits.",
      },
      {
        subtitle: "1.5. Allergen, Health & Dietary Disclaimers",
        text: "1. Medical & Nutritional Disclaimer: Any dietary, nutritional, or health information regarding our millet products provided on the EatPur platform is for general informational purposes only and does not constitute medical advice. Consumers with celiac disease, gluten sensitivity, or severe food allergies should consult a physician before consuming our products.\n\n2. Shared Facility & Cross-Contact Warning: While millets are naturally gluten-free grains, our products are processed and packaged in a facility that also handles wheat, gluten, peanuts, tree nuts, soy, milk, and sesame. Although we follow strict Current Good Manufacturing Practices (cGMP) to prevent cross-contamination, a 100% allergen-free environment cannot be guaranteed.\n\n3. Product Formulation Variations & Packaging Governance: Ingredient sourcing and formulation for our millet foods may be updated periodically. While we strive to keep website listings accurate, physical product packaging and labels always serve as the final, governing source for accurate ingredient and allergen declarations. Always inspect the physical label before consumption.",
      },
    ],
  },
  2: {
    title: "Health, Allergen & Medical Disclaimers",
    sections: [
      {
        subtitle: "2.1. Medical Disclaimer",
        text: 'Any dietary, nutritional, or health information provided on EatPur Naturals LLP ("EatPur") is for general informational purposes only and does not constitute medical advice. Consumers with celiac disease or severe allergies should consult their physician before consuming our products.',
      },
      {
        subtitle: "2.2. Shared Facility & Cross-Contact Warning",
        text: "Please be aware that our millet products are prepared in a facility that also processes wheat, peanuts, tree nuts, soy, milk and sesame. While we implement strict Good Manufacturing Practices (cGMPs) to minimize risk, a zero-risk cross-contamination environment cannot be legally guaranteed.",
      },
      {
        subtitle: "2.3. Product Formulation Variations",
        text: "Manufacturers may alter their ingredient formulations without notice. Online product information may not immediately reflect the physical label. The physical product packaging always serves as the governing information source for ingredients and allergens.",
      },
    ],
  },
  3: {
    title: "Refund, Return & Quality Claims Policy",
    sections: [
      {
        subtitle: "3.1. Claim Window",
        text: "If you experience an issue with the quality of your order, you must submit a claim within 7 days of the delivery timestamp.",
      },
      {
        subtitle: "3.2. Required Evidence for Claims",
        text: "To process a quality claim, you must provide your order number, the batch/lot number, and clear photographic evidence of the product and any packaging damage.",
      },
      {
        subtitle: "3.3. Returns Rule",
        text: "Physical returns are only permitted for unopened, resalable, and shelf-stable items. We do not accept returns on opened food items.",
      },
      {
        subtitle: "3.4. Refund Remedies",
        text: "Approved claims will be resolved via replacement, refund to original payment method, or store credit, at our discretion.",
      },
      {
        subtitle: "3.5. Storage & Pest Liability",
        text: "Millet is a natural agricultural product. Upon delivery, the customer assumes all risk of proper storage. Customers must store the products in airtight containers to prevent household infestation. We are not liable for spoilage or infestation caused by improper storage after delivery.",
      },
    ],
  },
  4: {
    title: "Shipping & Delivery Policy",
    sections: [
      {
        subtitle: "4.1. Delivery Estimates & Delays",
        text: 'All delivery timelines are estimates. EatPur Naturals LLP ("EatPur") is not liable for deliveries delayed by extreme weather events, holiday carrier volumes, or third-party logistics failures.',
      },
      {
        subtitle: "4.2. Risk of Loss",
        text: "The risk of loss and title for the products pass to you once the package is delivered to the shipping address you provided at checkout. You are responsible for promptly retrieving the package.",
      },
      {
        subtitle: "4.3. Address Accuracy",
        text: "We are not responsible for spoilage, damage, or delivery failures caused by incorrect addresses provided by the customer or unattended packages.",
      },
    ],
  },
  5: {
    title: "Privacy Policy",
    sections: [
      {
        subtitle: "Data Collection & Usage",
        text: "We collect personal data and dietary profile information to fulfill your orders. Your data is securely processed and shared only with our third-party logistics (3PL) and delivery partners as necessary to route your shipment.",
      },
      {
        subtitle: "Full Privacy Policy",
        text: "For full details on our data protection practices, please view our full Privacy Policy at https://www.eatpur.in/privacy.",
      },
    ],
  },
};

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export default function PolicyModal({
  policyId = 1,
  children,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const policy = POLICIES[policyId] || POLICIES[1];

  // ---------------------------------------------------------------------------
  // HOVER & CLICK HANDLERS
  // ---------------------------------------------------------------------------
  const handleMouseEnter = () => {
    // Slight delay so it doesn't flash if the user quickly moves their mouse across the screen
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsOpen(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <div
      className={`relative inline-block cursor-help ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* TRIGGER ELEMENT */}
      <div className="inline-block transition-colors duration-300 hover:text-[--color-eatpur-green-dark]">
        {children}
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // Fixed full screen backdrop
            className="fixed inset-0 z-[9999] mt-7 flex items-center justify-center bg-[--color-eatpur-dark]/40 backdrop-blur-sm p-4 md:p-6"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            {/* MODAL CONTENT CARD */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              className="bg-[--color-eatpur-white-warm] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-[var(--shadow-image)] border border-[--color-eatpur-border] flex flex-col overflow-hidden relative pointer-events-auto"
            >
              {/* Header Bar */}
              <div className="px-6 py-5 border-b border-[--color-eatpur-yellow-light] bg-white flex items-start justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[--color-eatpur-green-pale] border border-[--color-eatpur-green-light] flex items-center justify-center shrink-0 shadow-sm">
                    <LeafIcon />
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-[--color-eatpur-dark] font-bold leading-tight">
                      {policy.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-[--color-eatpur-text-light] font-sans mt-0.5 font-bold">
                      EatPur Naturals LLP
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-2 -mr-2 text-[--color-eatpur-text-light] hover:text-[--color-eatpur-dark] hover:bg-[--color-eatpur-gray-light] rounded-full transition-colors focus:outline-none"
                  aria-label="Close Modal"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Scrollable Policy Body */}
              <div className="p-6 md:p-8 overflow-y-auto hide-scrollbar space-y-8 bg-[--color-eatpur-bg-light]">
                {policy.sections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="font-serif text-lg font-semibold text-[--color-eatpur-green-dark] tracking-wide border-b border-[--color-eatpur-border] pb-1 inline-block">
                      {section.subtitle}
                    </h4>
                    <p className="font-sans text-[--color-eatpur-text] leading-relaxed text-sm md:text-base text-justify">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white border-t border-[--color-eatpur-border] shrink-0 text-center">
                <p className="text-xs text-[--color-eatpur-text-light] font-sans italic">
                  By completing your purchase, you acknowledge and agree to the
                  policies stated above.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
