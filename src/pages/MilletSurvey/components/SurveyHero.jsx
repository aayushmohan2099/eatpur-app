import React from "react";
import { motion } from "framer-motion";
import Logo3D from "../../../assets/Logo3D.png";

const SurveyHero = ({
  brand = "Eatpur Naturals",
  title = "Healthy Millet Food Survey",
  description = "We are building healthier millet-based foods for modern Indian families. Your feedback will help us create products that are tasty, convenient, and nutritious.",
  estimatedTime = "3–5 Minutes",
}) => {
  return (
    <section className="relative px-4 pt-8 pb-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-eatpur-yellow-light
            bg-white
            shadow-xl
          "
        >
          {/* Background Decoration */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-eatpur-green-light/15
              via-transparent
              to-eatpur-yellow-light/15
            "
          />

          <div
            className="
              absolute
              -left-20
              -top-20
              h-52
              w-52
              rounded-full
              bg-eatpur-green-light/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -right-20
              -bottom-20
              h-52
              w-52
              rounded-full
              bg-eatpur-gold-light/15
              blur-3xl
            "
          />

          {/* Content */}
          <div
            className="
                relative
                flex
                flex-col
                items-center
                p-6
                text-center

                md:p-10
                lg:p-12
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: -10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="mb-8 flex justify-center"
            >
              <img
                src={Logo3D}
                alt="Eatpur Naturals"
                className="
                h-24
                w-auto

                md:h-32
                lg:h-40

                object-contain
                drop-shadow-xl
                "
              />
            </motion.div>

            {/* Top Row */}

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-4
              "
            >
              {/* Brand */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.1,
                }}
                className="
                inline-flex
                items-center
                rounded-full
                border
                border-eatpur-green-light
                bg-white/80
                backdrop-blur-md
                px-5
                py-2
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                    tracking-wide
                    text-eatpur-green-dark
                  "
                >
                  {brand}
                </span>
              </motion.div>

              {/* Time */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-eatpur-gold-light
                  bg-eatpur-white-warm
                  px-4
                  py-2
                "
              >
                <span>⏱</span>

                <span
                  className="
                    text-sm
                    font-medium
                    text-eatpur-dark
                  "
                >
                  {estimatedTime}
                </span>
              </motion.div>
            </div>

            {/* Heading */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
              }}
              className="
                mt-6
                text-center
                text-3xl
                font-bold
                leading-tight
                text-eatpur-dark

                md:text-5xl
                "
            >
              {title}
            </motion.h1>

            {/* Description */}

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.35,
              }}
              className="
                mt-5
                max-w-3xl
                text-center
                text-base
                leading-7
                text-eatpur-text-light

                md:text-lg
                "
            >
              {description}
            </motion.p>

            {/* Bottom Stats */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.45,
              }}
              className="
                mt-8
                flex
                flex-wrap
                justify-center
                gap-3
                "
            >
              <div
                className="
                  rounded-full
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-eatpur-green-dark
                  shadow-sm
                "
              >
                ✓ Consumer Research
              </div>

              <div
                className="
                  rounded-full
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-eatpur-green-dark
                  shadow-sm
                "
              >
                ✓ Product Development
              </div>

              <div
                className="
                  rounded-full
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-eatpur-green-dark
                  shadow-sm
                "
              >
                ✓ Millet Innovation
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SurveyHero;
