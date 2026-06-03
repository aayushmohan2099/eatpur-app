export const SURVEY_SECTIONS = [
  {
    id: 1,
    key: "basicProfile",
    title: "Basic Profile",
    description: "Help us understand who you are and your household profile.",

    questions: [
      {
        id: "ageGroup",
        question: "What is your age group?",
        type: "radio",
        required: true,

        options: ["18–24", "25–34", "35–44", "45–54", "55+"],
      },

      {
        id: "city",
        question: "Which city do you live in?",
        type: "text",
        required: true,
        placeholder: "Enter your city",
      },

      {
        id: "profileType",
        question: "What best describes you?",
        type: "radio",
        required: true,

        options: [
          "Working Professional",
          "Homemaker",
          "Student",
          "Business Owner",
          "Fitness Enthusiast",
          "Parent with Kids",
          "Senior Citizen",
          "Other",
        ],
      },

      {
        id: "familyType",
        question: "What is your family type?",
        type: "radio",
        required: true,

        options: ["Single", "Couple", "Family with Kids", "Joint Family"],
      },
    ],
  },

  {
    id: 2,
    key: "foodHabits",
    title: "Food & Health Habits",
    description: "Tell us about your food preferences and health awareness.",

    questions: [
      {
        id: "healthConsciousness",
        question: "How health-conscious are you regarding daily food choices?",
        type: "rating",

        required: true,

        min: 1,
        max: 5,

        leftLabel: "Not Much",

        rightLabel: "Extremely Health-Conscious",
      },

      {
        id: "healthyProducts",
        question: "Which healthy food products do you already buy regularly?",

        type: "checkbox",

        required: true,

        options: [
          "Oats",
          "Muesli",
          "Protein snacks",
          "Millet products",
          "Organic foods",
          "Gluten-free products",
          "Sugar-free products",
          "Healthy ready-to-cook meals",
        ],
      },

      {
        id: "milletExperience",
        question: "Have you consumed millet-based foods before?",

        type: "radio",

        required: true,

        options: [
          "Regularly",
          "Occasionally",
          "Tried once or twice",
          "Heard about millets only",
          "Never tried",
        ],
      },

      {
        id: "milletReasons",
        question: "Why would you choose millet foods?",

        type: "checkbox",

        required: true,

        options: [
          "Better nutrition",
          "Weight management",
          "Diabetes-friendly",
          "High fiber",
          "High protein",
          "Kids’ nutrition",
          "Easy digestion",
          "Doctor recommendation",
          "Healthy lifestyle",
          "Taste",
        ],
      },
    ],
  },

  {
    id: 3,
    key: "painPoints",
    title: "Customer Pain Points",
    description: "Help us understand the challenges around millet consumption.",

    questions: [
      {
        id: "painPoints",
        question: "What prevents you from consuming millet foods more often?",

        type: "checkbox",

        required: true,

        options: [
          "Taste concerns",
          "Hard to cook",
          "Expensive",
          "Family doesn’t prefer it",
          "Limited product options",
          "Not easily available",
          "Lack of awareness",
          "Packaging does not look attractive",
          "Unsure how to use millet products",
        ],
      },

      {
        id: "eatingHabit",
        question: "Which statement best matches your current eating habits?",

        type: "radio",

        required: true,

        options: [
          "I actively search for healthy food",
          "I want healthy food but convenience matters",
          "I prefer taste over health",
          "I buy healthy food occasionally",
          "I rarely think about healthy packaged food",
        ],
      },
    ],
  },

  {
    id: 4,
    key: "productValidation",
    title: "Product Validation",
    description: "Tell us what products and attributes matter most to you.",

    questions: [
      {
        id: "preferredProducts",

        question: "Which Eatpur products would you most likely try?",

        type: "checkbox",

        required: true,

        options: [
          "Millet Atta",
          "Millet Cookies",
          "Millet Noodles/Pasta",
          "Millet Breakfast Mix",
          "Instant Millet Dosa Mix",
          "Healthy Kids Snacks",
          "Ready-to-Cook Meals",
          "Millet Namkeen",
          "Protein-rich Millet Snacks",
        ],
      },

      {
        id: "buyingFactors",

        question: "What matters MOST while buying healthy packaged food?",

        type: "matrix",

        required: true,

        rows: [
          "Taste",
          "Ingredients",
          "Price",
          "Brand Trust",
          "Convenience",
          "Nutrition",
          "Packaging",
          "No Preservatives",
        ],

        columns: ["Very Important", "Important", "Neutral", "Not Important"],
      },

      {
        id: "packagingStyle",

        question: "Which packaging style appeals most to you?",

        type: "radio",

        required: true,

        options: [
          "Modern Premium",
          "Natural & Traditional",
          "Minimal Clean Design",
          "Family-focused",
          "Kids-friendly colorful packaging",
        ],
      },
    ],
  },

  {
    id: 5,
    key: "pricing",

    title: "Pricing & Purchase Behavior",

    description:
      "Help us understand pricing expectations and buying preferences.",

    questions: [
      {
        id: "priceRange",

        question:
          "What price range feels reasonable for healthy millet snacks/products?",

        type: "radio",

        required: true,

        options: [
          "₹50–100",
          "₹100–200",
          "₹200–300",
          "Premium pricing is okay for quality products",
        ],
      },

      {
        id: "purchaseChannels",

        question: "Where would you prefer buying Eatpur products?",

        type: "checkbox",

        required: true,

        options: [
          "Eatpur Website",
          "Amazon",
          "Blinkit / Zepto",
          "Local Kirana Stores",
          "Modern Retail Stores",
          "Gyms & Health Stores",
          "WhatsApp Ordering",
        ],
      },

      {
        id: "purchaseIntent",

        question: "How likely are you to try Eatpur products?",

        type: "slider",

        required: true,

        min: 1,
        max: 10,

        leftLabel: "Not Likely",

        rightLabel: "Very Likely",
      },
    ],
  },

  {
    id: 6,
    key: "leadCollection",

    title: "Lead Collection",

    description: "Stay connected with Eatpur Naturals and receive updates.",

    questions: [
      {
        id: "leadPreferences",

        question: "Would you like:",

        type: "checkbox",

        required: false,

        options: [
          "Free Samples",
          "Early Launch Offers",
          "Healthy Millet Recipes",
          "WhatsApp Updates",
          "Product Testing Opportunities",
        ],
      },

      {
        id: "whatsappNumber",

        question: "Share your WhatsApp Number (Optional)",

        type: "text",

        required: false,

        inputType: "tel",

        placeholder: "9876543210",

        maxLength: 10,
      },

      {
        id: "suggestions",

        question: "Any suggestions for Eatpur Naturals?",

        type: "textarea",

        required: false,

        placeholder:
          "Share your feedback, product ideas, flavours, packaging suggestions, or anything else...",

        rows: 6,

        maxLength: 1000,
      },
    ],
  },
];

export const SURVEY_META = {
  brand: "Eatpur Naturals",

  title: "Healthy Millet Food Survey",

  estimatedTime: "3–5 Minutes",

  description:
    "We are building healthier millet-based foods for modern Indian families. Your feedback will help us create products that are tasty, convenient, and nutritious.",

  totalSections: 6,

  totalQuestions: 19,
};

export const INITIAL_FORM_DATA = {
  ageGroup: "",
  city: "",
  profileType: "",
  familyType: "",

  healthConsciousness: 0,

  healthyProducts: [],

  milletExperience: "",

  milletReasons: [],

  painPoints: [],

  eatingHabit: "",

  preferredProducts: [],

  buyingFactors: {},

  packagingStyle: "",

  priceRange: "",

  purchaseChannels: [],

  purchaseIntent: 5,

  leadPreferences: [],

  whatsappNumber: "",

  suggestions: "",
};
