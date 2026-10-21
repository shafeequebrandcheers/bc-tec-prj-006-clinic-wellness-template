/* =========================================================
   CLINIC & WELLNESS TEMPLATE - CENTRAL CONFIGURATION
   ---------------------------------------------------------
   Edit only this file to set up a new business.
   Sample data below is placeholder content for an Ayurvedic
   clinic - replace it with the business's real, verified details.
   ========================================================= */

const clinicConfig = {
  // Options: "ayurvedic-clinic", "dental", "medical", "dermatology", "physiotherapy", "spa"
  businessType: "ayurvedic-clinic",

  brandName: "Vedica Ayur & Wellness",
  tagline: "Rooted in Ancient Wisdom, Backed by Care",
  description: "Personalised Ayurvedic consultations and classical therapies in a calm, caring environment.",
  logo: "", // e.g., "images/logo.png" - leave empty to show the brand icon

  contact: {
    phone: "+91 98765 43210",
    whatsapp: "919876543210", // Country code + number, digits only
    email: "care@vedicaayur.com",
    address: "12 Wellness Boulevard, Indiranagar",
    mapLink: "https://maps.google.com/?q=Indiranagar"
  },

  // Set closed: true for days the clinic is closed.
  workingHours: [
    { day: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
    { day: "Sunday", closed: true }
  ],

  // Image paths or URLs. Leave empty to show a placeholder.
  images: {
    heroImage: "",  // e.g., "images/hero.jpg"
    aboutImage: ""  // e.g., "images/about.jpg"
  },

  hero: {
    headline: "Rooted in Ancient Wisdom, Backed by Care",
    description: "Consult experienced Ayurvedic practitioners for personalised guidance, classical therapies and lifestyle support suited to your body and routine."
  },

  // Dynamic Service categories & items rendered automatically
  // "All" is added automatically if missing. Leave the list empty to build it from the services.
  serviceCategories: ["All", "Consultations", "Panchakarma", "Therapies"],
  services: [
    { id: 1, name: "General Ayurvedic Consultation", category: "Consultations", duration: "45 Mins", price: "₹800", description: "In-depth pulse diagnosis and personalized lifestyle/dietary guidance.", icon: "🩺", image: "" },
    { id: 2, name: "Abhyanga Full Body Therapy", category: "Therapies", duration: "60 Mins", price: "₹2,500", description: "Traditional warm herbal oil massage to relieve fatigue and detoxify.", icon: "💆", image: "" },
    { id: 3, name: "Diet & Lifestyle Guidance", category: "Consultations", duration: "30 Mins", price: "₹600", description: "Practical guidance on food, daily routine and seasonal habits suited to your constitution.", icon: "🥗", image: "" },
    { id: 4, name: "Shirodhara", category: "Therapies", duration: "45 Mins", price: "₹2,200", description: "A gentle, steady stream of warm medicated oil poured over the forehead in a calm setting.", icon: "💧", image: "" },
    { id: 5, name: "Panchakarma Programme", category: "Panchakarma", duration: "7 - 21 Days", price: "On consultation", description: "A supervised multi-day programme of classical cleansing therapies, planned after a detailed consultation.", icon: "🪷", image: "" },
    { id: 6, name: "Virechana", category: "Panchakarma", duration: "Planned after consultation", price: "On consultation", description: "A classical Panchakarma procedure, recommended only after assessment by a physician.", icon: "🌿", image: "" }
  ],

  // Practitioners / Doctors list
  // Optional fields (qualifications, experience, image, bio) are hidden when empty.
  team: [
    { name: "Dr. Ananya Sharma", role: "Chief Ayurveda Physician", qualifications: "B.A.M.S, M.D.", experience: "14+ Years Experience", image: "", bio: "Focuses on personalised consultations, lifestyle guidance and long-term wellness plans." },
    { name: "Dr. Rahul Nair", role: "Panchakarma Physician", qualifications: "B.A.M.S", experience: "8+ Years Experience", image: "", bio: "Plans and supervises Panchakarma programmes and classical therapies." },
    { name: "Lakshmi Pillai", role: "Senior Ayurvedic Therapist", qualifications: "Diploma in Ayurvedic Therapy", experience: "10+ Years Experience", image: "", bio: "" }
  ],

  about: {
    title: "Holistic care, personalised for you",
    subtitle: "Classical Ayurveda practised with attention and care",
    paragraph1: "Our clinic offers Ayurvedic consultations and therapies based on classical principles. Every visit begins with understanding your health history, daily routine and individual constitution.",
    paragraph2: "Treatment plans are discussed openly with you and may include therapies, dietary guidance and lifestyle recommendations. We encourage you to continue any care prescribed by your other healthcare providers.",
    stats: [] // Optional, e.g. { label: "Years of Practice", value: "15+" } - only add verified figures
  },

  // Trust indicators shown below the hero
  highlights: [
    { icon: "🩺", title: "Qualified Practitioners", text: "Consultations led by registered Ayurvedic physicians." },
    { icon: "🌿", title: "Personalised Plans", text: "Care recommendations tailored to your constitution and routine." },
    { icon: "🤝", title: "Clear Communication", text: "Treatment options, durations and costs explained upfront." },
    { icon: "🔒", title: "Private Consultations", text: "One-to-one sessions in private consultation rooms." }
  ],

  facilities: [
    { icon: "🚪", label: "Private consultation rooms" },
    { icon: "🛏️", label: "Dedicated therapy suites" },
    { icon: "♨️", label: "Herbal steam room" },
    { icon: "🌱", label: "Herbal dispensary" },
    { icon: "♿", label: "Wheelchair accessible" },
    { icon: "🅿️", label: "On-site parking" }
  ],

  // Add only genuine feedback shared with permission. The section is hidden when empty.
  // e.g., { quote: "...", name: "Patient name", detail: "Consultation patient" }
  testimonials: [],

  booking: {
    methods: ["whatsapp", "email"], // "whatsapp", "email" or both (visitor chooses)
    defaultMethod: "whatsapp",
    ctaLabel: "Book an Appointment",
    serviceCtaLabel: "Book this service",
    modalTitle: "Request an Appointment",
    modalIntro: "Share a few details and we'll get back to you to confirm a suitable time.",
    submitLabel: "Send Appointment Request",
    emailSubject: "Appointment request"
  },

  // Theme: leave values empty to use the default theme of the businessType.
  theme: {
    preset: "", // Use another business type's theme, e.g. "spa"
    colors: {
      primary: "",      // Buttons, links, highlights
      primaryDark: "",  // Hover states, footer background
      secondary: "",    // Secondary accents
      background: "",   // Page background
      surface: "",      // Cards and panels
      text: "",         // Main text
      textMuted: "",    // Supporting text
      border: ""        // Card and input borders
    },
    headingFont: "", // e.g., "'Playfair Display', serif"
    bodyFont: ""     // e.g., "'Inter', sans-serif"
  },

  // Optional overrides for section headings (defaults come from businessPresets below)
  sections: {
    servicesTitle: "",
    servicesSubtitle: "",
    teamTitle: "",
    teamSubtitle: ""
  },

  disclaimer: "Information on this website is general in nature and is not a substitute for professional medical advice. Please consult a qualified practitioner about your health."
};

/* =========================================================
   BUSINESS TYPE PRESETS
   Default wording and icon for each supported business type.
   "aliases" are other accepted businessType values.
   Colours for each type live in css/variables.css.
   ========================================================= */
const businessPresets = {
  "ayurvedic": {
    aliases: ["ayurvedic-clinic", "ayurveda"],
    label: "Ayurvedic Clinic",
    icon: "🌿",
    servicesTitle: "Treatments & Therapies",
    servicesSubtitle: "Classical Ayurvedic care, recommended after a personal consultation.",
    teamTitle: "Our Physicians & Therapists",
    teamSubtitle: "Meet the practitioners who will guide your care."
  },
  "dental": {
    aliases: ["dental-clinic", "dentist"],
    label: "Dental Clinic",
    icon: "🦷",
    servicesTitle: "Dental Services",
    servicesSubtitle: "Preventive, restorative and cosmetic dental care for the whole family.",
    teamTitle: "Our Dentists",
    teamSubtitle: "Meet the dental team looking after your smile."
  },
  "medical": {
    aliases: ["medical-clinic", "general", "general-medical", "gp"],
    label: "Medical Clinic",
    icon: "🩺",
    servicesTitle: "Medical Services",
    servicesSubtitle: "General consultations, check-ups and everyday healthcare.",
    teamTitle: "Our Doctors",
    teamSubtitle: "Meet the doctors and clinical staff at our clinic."
  },
  "dermatology": {
    aliases: ["dermatology-clinic", "skin", "skin-clinic"],
    label: "Skin Clinic",
    icon: "✨",
    servicesTitle: "Skin & Hair Treatments",
    servicesSubtitle: "Clinical and aesthetic dermatology, planned after assessment.",
    teamTitle: "Our Dermatologists",
    teamSubtitle: "Meet the specialists who will assess and guide your treatment."
  },
  "physiotherapy": {
    aliases: ["physiotherapy-center", "physio"],
    label: "Physiotherapy Center",
    icon: "🦵",
    servicesTitle: "Physiotherapy Services",
    servicesSubtitle: "Assessment-led rehabilitation, pain management and mobility care.",
    teamTitle: "Our Physiotherapists",
    teamSubtitle: "Meet the therapists who will support your recovery."
  },
  "spa": {
    aliases: ["wellness-spa", "wellness", "spa-salon"],
    label: "Wellness Spa",
    icon: "🪷",
    servicesTitle: "Spa & Wellness Treatments",
    servicesSubtitle: "Relaxing treatments designed to help you rest and restore.",
    teamTitle: "Our Wellness Specialists",
    teamSubtitle: "Meet the therapists behind every treatment."
  }
};
