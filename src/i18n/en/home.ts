/** Home page: hero, the AR demo, work list, About and Contact */
export const home = {
  hero: {
    label: "Ikrar Hesa Prasetya · Jakarta",
    headline: { before: "Designer of digital products and ", emphasis: "creative systems", after: "." },
    intro:
      "I design experiences and tools that help people communicate, create and sell. Currently designing at Shopee, working on creative tools used by millions across Southeast Asia.",
    ctaWork: "See selected work",
    ctaContact: "Get in touch",
  },
  proof: [
    {
      eyebrow: "Template adoption · Malaysia",
      label: "increase in videos posted with a template each week, from 200 to 34,000 in three months",
    },
    {
      // The caption does not repeat the eyebrow: it names the markets rather than restating "markets
      // my designs ship to", which the eyebrow above it already says.
      eyebrow: "Markets shipped to",
      label:
        "Indonesia, Malaysia, Thailand, Vietnam, the Philippines and Taiwan, each localized. I managed Malaysia.",
    },
  ],
  work: { label: "Selected work", heading: "Selected case studies", viewCase: "View case study" },
  about: {
    label: "About",
    heading: "A little about me",
    photoAlt:
      "Ikrar Hesa Prasetya standing beside an Apollo 11 poster outside the Smithsonian National Air and Space Museum",
    p1: {
      before:
        "I'm a multi-disciplinary designer with over 6 years of experience across product, brand and motion, based in Jakarta. Currently at ",
      link: "Shopee",
      after:
        ", designing creative tools and experiences, including AR, at one of Southeast Asia's leading e-commerce platforms, used by millions of people.",
    },
    p2: "I am driven by curiosity and my mission to design empathetic products that balance user experience and business impact.",
    p3: {
      before: "Before Shopee, I worked as a Creative Marketing Associate at ",
      link: "Danacita",
      after:
        ", where I helped schools, universities, bootcamps and students access a more affordable education through Danacita's products and services. I also helped bring those products to market and grow Danacita's design team.",
    },
    p4: "In my downtime, I enjoy exploring new destinations with my trusty camera.",
  },
  contact: {
    label: "Contact",
    heading: "Let's work together",
    body: "Open to product design roles and collaborations. Typical reply within a couple of days. If it's urgent, say so in the subject line.",
    linkedin: "LinkedIn",
    cv: "Download CV",
  },
  /** The interactive AR demo and the game entry point beside it, in their own section after About */
  demo: {
    label: "Try it",
    heading: "The AR, running in your browser",
    intro:
      "The effects I designed at Shopee run on a seller's phone. This is the same idea rebuilt for the web: face tracking on your own device, so no video ever leaves this browser. Turn on the camera, or find the ship beside the phone if you would rather play something.",
    group: "Interactive AR template demo",
    filterGroup: "AR filter",
    filters: { gum: "Bubble Gum", laser: "Laser Eyes" },
    canvas: "Live camera with the selected AR template",
    loading: "Starting camera and loading face tracking…",
    cancel: "Cancel",
    stop: "Stop camera",
    start: "Try the AR Experience",
    hintOff: "On your device. Nothing uploaded.",
    hintOn: "Runs on your device. Your video never leaves this browser.",
    errors: {
      blocked: "Camera access was blocked. Allow it in your browser's site settings to try this.",
      none: "No camera found on this device.",
      other: "Couldn't start face tracking on this device. The animated demo still works.",
    },
    laser: "Shots fired: {shots}",
    laserCharge: " · {power}% charge",
    gumPop: "POP! ",
    gumSaved: "Saved it: ",
    gumSize: "{size}× your face",
    gumBest: " · best {best}×",
    shipAria: "Shoot the alien! Play Space Invaders",
    shipLabel: "Shoot the alien!",
    /** Drawn on the camera canvas */
    hud: {
      looking: "LOOKING FOR A FACE…",
      live: "LIVE · ON YOUR DEVICE",
      gumPop: "POP! {size}x your face",
      gumBank: "Saved it: {size}x your face",
      gumCareful: "Careful, it is about to go",
      gumKeep: "Keep blowing...",
      gumStart: "Puff your cheeks to blow a bubble",
      laserFire: "FIRE!",
      laserCool: "Recharging...",
      laserBlink: "Blink to fire!",
      laserCharging: "Charging... hold it",
      laserStart: "Raise your eyebrows to charge",
    },
  },
};
export type Home = typeof home;
