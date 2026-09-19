// src/pages/ReturnPolicy.jsx
import React from "react";
import { FaUndo, FaTruck, FaLock, FaEnvelope } from "react-icons/fa";

const policyData = [
  {
    title: "Refund, Return & Quality Claims",
    icon: <FaUndo className="text-eatpur-green-dark" size={20} />,
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
  {
    title: "Shipping & Delivery",
    icon: <FaTruck className="text-eatpur-green-dark" size={24} />,
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
  {
    title: "Privacy Policy",
    icon: <FaLock className="text-eatpur-green-dark" size={24} />,
    sections: [
      {
        subtitle: "5.1. Data Collection & Usage",
        text: "We collect personal data and dietary profile information to fulfill your orders. Your data is securely processed and shared only with our third-party logistics (3PL) and delivery partners as necessary to route your shipment.",
      },
      
    ],
  },
];

export default function ReturnPolicy() {
  

  return (
    <div className="min-h-screen bg-white py-16 px-6 lg:px-8 selection:bg-eatpur-green-dark selection:text-white">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 text-center md:text-left relative">
          <p className="text-eatpur-green-dark font-semibold tracking-wider uppercase text-sm mb-3">
            Legal & Policies
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-eatpur-dark mb-4 leading-tight">
            Commitment to <br className="hidden md:block" /> Quality & Trust
          </h1>
          <p className="text-gray-500 text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-eatpur-green-dark opacity-50"></span>
           
          </p>
          {/* Subtle background accent */}
          <div className="absolute top-0 right-0 -z-10 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        {/* Dynamic Content Section */}
        <div className="space-y-16">
          {policyData.map((policy, index) => (
            <section key={index} className="scroll-mt-24">
              {/* Section Heading */}
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3.5 bg-green-50 rounded-2xl shadow-sm border border-green-100/50">
                  {policy.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-eatpur-dark tracking-tight">
                  {policy.title}
                </h2>
              </div>
              
              {/* Clauses Container */}
              <div className="space-y-8 pl-4 md:pl-6 border-l-2 border-gray-100">
                {policy.sections.map((section, idx) => {
                  // Split subtitle into Number (e.g., "3.1.") and Text (e.g., "Claim Window")
                  const [clauseNumber, ...clauseTextArr] = section.subtitle.split(" ");
                  const clauseTitle = clauseTextArr.join(" ");

                  return (
                    <div 
                      key={idx} 
                      className="relative group transition-all duration-300 hover:translate-x-1"
                    >
                      {/* Interactive Accent Line */}
                      <div className="absolute -left-[18px] md:-left-[26px] top-1.5 w-[3px] h-0 bg-eatpur-green-dark transition-all duration-300 group-hover:h-full rounded-full"></div>
                      
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 flex items-baseline gap-2">
                        <span className="text-eatpur-green-dark/80 font-mono text-sm tracking-widest">
                          {clauseNumber}
                        </span>
                        <span>{clauseTitle}</span>
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {/* Auto-link formatting */}
                        {section.text.includes("https://") ? (
                          <span dangerouslySetInnerHTML={{
                            __html: section.text.replace(
                              /(https?:\/\/[^\s]+)/g,
                              '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-eatpur-green-dark font-medium underline decoration-eatpur-green-dark/30 hover:decoration-eatpur-green-dark transition-all">$1</a>'
                            )
                          }} />
                        ) : (
                          section.text
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Contact Section */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/50 p-8 rounded-3xl">
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">Still have questions?</h3>
            <p className="text-gray-500 text-sm">
              We're here to help clarify any doubts regarding our policies.
            </p>
          </div>
          <a 
            href="mailto:support@eatpur.com" 
            className="group flex items-center gap-2 px-7 py-3.5 bg-eatpur-dark text-white font-medium rounded-xl hover:bg-eatpur-green-dark transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 w-full md:w-auto justify-center"
          >
            <FaEnvelope className="opacity-70 group-hover:opacity-100 transition-opacity" />
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}