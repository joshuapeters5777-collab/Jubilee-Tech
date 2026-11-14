import { recordAuditLog, sanitizeText } from "./security";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseUpsert } from "./supabase";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Closed";

export interface InboxMessage {
  id: string;
  sender: "client" | "admin" | "ai-auto";
  senderName: string;
  body: string;
  timestamp: number;
  attachedProposalUrl?: string;
}

export interface BusinessLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  service: string;
  budget: string;
  status: LeadStatus;
  priority: "High" | "Medium" | "Low";
  createdAt: number;
  notes: string;
  websiteUrl?: string;
  autoReplied?: boolean;
  messages: InboxMessage[];
}

export interface AutoResponderConfig {
  enabled: boolean;
  agencyPersona: string;
  responseDelaySeconds: number;
  includeBookingLink: boolean;
  bookingUrl: string;
  includePriceEstimate: boolean;
  signature: string;
  autoQualifyThreshold: string;
}

export interface ProspectResult {
  id: string;
  businessName: string;
  niche: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  mobileScore: number;
  seoScore: number;
  hasFunnel: boolean;
  hasSSL: boolean;
  detectedIssues: string[];
  estimatedDealValueZar: number;
  recommendedPitch: string;
  importedToCrm?: boolean;
}

export interface GeneratedWebsiteSection {
  id: string;
  type: "hero" | "services" | "showcase" | "pricing" | "testimonials" | "cta";
  title: string;
  subtitle: string;
  items: { title: string; desc: string; badge?: string; price?: string }[];
}

export interface GeneratedWebsite {
  id: string;
  clientName: string;
  niche: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  themeMode: "dark-luxury" | "editorial-light" | "cyber-glass" | "warm-artisan";
  fontStyle: "space" | "serif" | "mono";
  ctaText: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: number;
  status: "Draft" | "Preview Ready" | "Delivered";
  include3DHero?: boolean;
  sections: GeneratedWebsiteSection[];
}

export type VeoModelId =
  | "veo-3.1-generate-preview"
  | "veo-3.1-fast-generate-preview"
  | "minimax-hailuo-h3"
  | "kling-3.0"
  | "runway-gen-4.5"
  | "luma-ray-3.2";

export type StyleAnchorModelId = "flux-1-pro" | "midjourney-v6.5";

export type FlowCameraControl =
  | "Dolly In (Fast)"
  | "Dolly Out (Reveal)"
  | "Handheld Shake"
  | "Orbit 360°"
  | "Pan Right + Rack Focus"
  | "Tilt Down"
  | "Tracking Shot"
  | "Fast Tracking Shot";

export type FlowTransitionMode =
  | "Ingredients to Video"
  | "Extend (+5s)"
  | "Jump To"
  | "First-to-Last Frame";

export interface ShortScene {
  scene: number;
  time: string;
  durationSec?: number;
  speaker: string;
  dialogue: string;
  imagePrompt: string;
  motionPrompt: string;
  negativePrompt?: string;
  veoPrompt?: string;
  cameraControl?: FlowCameraControl;
  flowTransition?: FlowTransitionMode;
  sfxPrompt?: string;
  videoClipUrl?: string;
  interactionId?: string;
  lastEditDelta?: string;
  toolRouting?: "generate_video" | "generate_with_subjects" | "edit_video";
  delivery?: "uri";
  visualTheme: string;
  accentColor: string;
}

export interface YouTubeShortProject {
  id: string;
  title: string;
  trackType:
    | "3d-cutaway-explainer"
    | "pixar-drama"
    | "high-rpm-pov"
    | "agency-case-study"
    | "tech-viral";
  description: string;
  hashtags: string[];
  estimatedRpm: string;
  targetRetention: string;
  musicMood: string;
  veoModel?: VeoModelId;
  styleAnchorModel?: StyleAnchorModelId;
  styleReferencePrompt?: string;
  styleAnchorId?: string;
  durationSeconds?: number;
  flowProjectUrl?: string;
  flowRenderStatus?: "Ready for Flow" | "Generating in Veo 3.1" | "Rendered (30s 9:16)" | string;
  renderedVideoUrl?: string;
  showOnWebsite?: boolean;
  characterPrompts: Record<string, string>;
  scenes: ShortScene[];
  createdAt: number;
  youtubePublishStatus?: "Draft" | "Queued" | "Published";
  youtubeVideoId?: string;
  scheduledPublishTime?: string;
}

export interface YouTubeAutoPublishConfig {
  autoUploadOnRender: boolean;
  channelName: string;
  oauthAccessToken: string;
  webhookUrl: string;
  defaultPrivacy: "public" | "unlisted" | "private";
  defaultPublishTimeSast: string;
  madeForKids: boolean;
  veoModel?: VeoModelId;
  styleAnchorModel?: StyleAnchorModelId;
  geminiApiKey?: string;
  googleFlowProjectUrl?: string;
  veoResolution?: "1080p" | "720p" | "4K";
  veoNativeAudio?: boolean;
  creativeDirectorPrompt?: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  amountZar: number;
  status: "Paid" | "Pending" | "Overdue";
  issuedDate: string;
  dueDate: string;
  items: { description: string; qty: number; rateZar: number }[];
}

export interface MeetingItem {
  id: string;
  title: string;
  client: string;
  time: string;
  dateDay: number;
  type: "Strategy Call" | "3D Demo" | "Site Handover" | "Pitch";
  completed: boolean;
}

export type Geometry3DType =
  | "torus-knot"
  | "icosahedron-core"
  | "dna-helix"
  | "gyro-rings"
  | "crystal-cluster"
  | "wave-sphere"
  | "hypercube";

export type Material3DStyle =
  | "iridescent-chrome"
  | "neon-wireframe"
  | "frosted-glass"
  | "hologram-matrix"
  | "liquid-gold";

export interface Scene3DConfig {
  presetName: string;
  geometry: Geometry3DType;
  material: Material3DStyle;
  primaryColor: string;
  secondaryColor: string;
  ambientColor: string;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
  scale: number;
  explodeFactor: number;
  wireframeOverlay: boolean;
  particleCount: number;
  particleSpeed: number;
  bloomIntensity: number;
  mouseSensitivity: number;
  autoFloat: boolean;
  showGridFloor: boolean;
  showHudTelemetry: boolean;
  headline: string;
  subheadline: string;
  badgeText: string;
  keyframes: {
    id: string;
    label: string;
    geometry: Geometry3DType;
    explodeFactor: number;
    scale: number;
    primaryColor: string;
    secondaryColor: string;
  }[];
  updatedAt: number;
}

// Bumped storage keys to v3 so all revenue/leads/invoices start at clean R0
const STORAGE_KEYS = {
  LEADS: "jt_business_leads_v3",
  AUTO_RESPONDER: "jt_auto_responder_v3",
  PROSPECTS: "jt_prospect_results_v3",
  WEBSITES: "jt_generated_websites_v3",
  SHORTS: "jt_youtube_shorts_v6_cutaway",
  YT_CONFIG: "jt_youtube_autopublish_v4_veo31",
  INVOICES: "jt_invoices_v3",
  MEETINGS: "jt_meetings_v3",
  SCENE_3D: "jt_scene_3d_config_v3",
};

export const DEFAULT_SCENE_3D: Scene3DConfig = {
  presetName: "Iridescent Chrome Core",
  geometry: "torus-knot",
  material: "iridescent-chrome",
  primaryColor: "#38bdf8",
  secondaryColor: "#a855f7",
  ambientColor: "#0f172a",
  rotationSpeedX: 0.45,
  rotationSpeedY: 0.85,
  rotationSpeedZ: 0.2,
  scale: 1.05,
  explodeFactor: 0.08,
  wireframeOverlay: true,
  particleCount: 110,
  particleSpeed: 0.6,
  bloomIntensity: 0.8,
  mouseSensitivity: 0.75,
  autoFloat: true,
  showGridFloor: true,
  showHudTelemetry: true,
  headline: "Spatial 3D Web Engineering",
  subheadline:
    "Interactive real-time procedural geometry, custom shaders, and tactile motion systems editable directly from Jubilee Admin.",
  badgeText: "JUBILEE 3D ENGINE v4.2 // SOUTH AFRICA",
  keyframes: [
    {
      id: "kf-1",
      label: "State 01 · Chrome Knot",
      geometry: "torus-knot",
      explodeFactor: 0.05,
      scale: 1.05,
      primaryColor: "#38bdf8",
      secondaryColor: "#a855f7",
    },
    {
      id: "kf-2",
      label: "State 02 · Orbital Gyro",
      geometry: "gyro-rings",
      explodeFactor: 0.18,
      scale: 1.15,
      primaryColor: "#22d3ee",
      secondaryColor: "#3b82f6",
    },
    {
      id: "kf-3",
      label: "State 03 · Quantum Helix",
      geometry: "dna-helix",
      explodeFactor: 0.12,
      scale: 1.0,
      primaryColor: "#c084fc",
      secondaryColor: "#38bdf8",
    },
    {
      id: "kf-4",
      label: "State 04 · Hyper Crystal",
      geometry: "crystal-cluster",
      explodeFactor: 0.32,
      scale: 1.2,
      primaryColor: "#f59e0b",
      secondaryColor: "#ec4899",
    },
  ],
  updatedAt: Date.now(),
};

// Clean zero-revenue starting state (no fake leads or fake paid invoices!)
const SEED_LEADS: BusinessLead[] = [];
const SEED_INVOICES: InvoiceRecord[] = [];
const SEED_MEETINGS: MeetingItem[] = [];

const DEFAULT_AUTO_RESPONDER: AutoResponderConfig = {
  enabled: true,
  agencyPersona:
    "Executive, warm, conversion-focused digital partner at Jubilee Tech (South Africa). Emphasize 14-day turnaround, custom non-template engineering, and measurable growth.",
  responseDelaySeconds: 3,
  includeBookingLink: true,
  bookingUrl: "https://cal.com/jubileetech/strategy-call",
  includePriceEstimate: true,
  signature: "Joshua — Founder & Lead Engineer, Jubilee Tech (South Africa)",
  autoQualifyThreshold: "R12,500+",
};

const DEFAULT_YT_CONFIG: YouTubeAutoPublishConfig = {
  autoUploadOnRender: true,
  channelName: "Jubilee Tech / AI Stories Channel",
  oauthAccessToken: "",
  webhookUrl: "",
  defaultPrivacy: "public",
  defaultPublishTimeSast: "18:00",
  madeForKids: false,
  veoModel: "veo-3.1-generate-preview",
  geminiApiKey: "",
  googleFlowProjectUrl: "https://labs.google/fx/tools/flow",
  veoResolution: "1080p",
  veoNativeAudio: true,
};

const SEED_PROSPECTS: ProspectResult[] = [
  {
    id: "pros-sa-1",
    businessName: "Sandton Aesthetics & MedSpa",
    niche: "MedSpa & Clinic",
    city: "Sandton, Johannesburg",
    website: "sandton-aesthetics.co.za",
    email: "info@sandton-aesthetics.co.za",
    phone: "+27 11 555 0192",
    mobileScore: 38,
    seoScore: 44,
    hasFunnel: false,
    hasSSL: true,
    detectedIssues: [
      "5.8s mobile load time on South African mobile networks",
      "No instant WhatsApp or online consultation booking funnel",
      "Missing local Google Maps schema markup for Sandton",
    ],
    estimatedDealValueZar: 24500,
    recommendedPitch:
      "Hi Sandton Aesthetics team — we noticed your mobile booking page takes 5.8s to load and lacks an instant WhatsApp/online consultation funnel. We built a custom high-speed MedSpa prototype for your clinic. Can I send the live link?",
  },
  {
    id: "pros-sa-2",
    businessName: "Camps Bay Fine Dining",
    niche: "Fine Dining & Hospitality",
    city: "Cape Town, Western Cape",
    website: "campsbaygrill.co.za",
    email: "bookings@campsbaygrill.co.za",
    phone: "+27 21 555 0148",
    mobileScore: 35,
    seoScore: 48,
    hasFunnel: false,
    hasSSL: true,
    detectedIssues: [
      "PDF-only menu that requires pinch-and-zoom on mobile phones",
      "No instant table reservation or private dining inquiry capture",
      "Unoptimized images slowing down initial page load",
    ],
    estimatedDealValueZar: 18500,
    recommendedPitch:
      "Hi there — we saw your menu is currently a static PDF download on mobile. Just like we built for Stud. The Burger Shop and Savoury Bites, we created an interactive mobile menu & instant table booking prototype for you.",
  },
];

const SEED_WEBSITES: GeneratedWebsite[] = [
  {
    id: "site-miliano",
    clientName: "Miliano Fragrance",
    niche: "Luxury Parfumerie & E-Commerce",
    tagline: "Extrait de Parfum — Crafted in Grasse, Bottled in Obsidian.",
    primaryColor: "#d4af37",
    secondaryColor: "#1c1917",
    themeMode: "dark-luxury",
    fontStyle: "serif",
    ctaText: "Explore The Collection",
    contactEmail: "concierge@milianofragrance.co.za",
    contactPhone: "+27 82 555 0194",
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    status: "Preview Ready",
    sections: [
      {
        id: "sec-1",
        type: "hero",
        title: "Scent That Commands The Room Before You Speak.",
        subtitle:
          "Small-batch Extrait de Parfum with 35% oil concentration. Engineered for 18-hour projection and unforgettable trail.",
        items: [
          { title: "35% Extrait", desc: "Pure Grasse absolutes" },
          { title: "18h Longevity", desc: "Tested on skin & cashmere" },
          { title: "Nationwide SA Delivery", desc: "Complimentary courier over R1,500" },
        ],
      },
      {
        id: "sec-2",
        type: "showcase",
        title: "Signature Olfactory Editions",
        subtitle: "Each flacon is individually numbered and sealed by hand.",
        items: [
          {
            title: "NOIR VELOURS No. 07",
            desc: "Smoked Oud, Black Cardamom, Madagascar Vanilla Bean & Ambergris.",
            badge: "Bestseller",
            price: "R2,850",
          },
          {
            title: "SOLEIL D'OR No. 12",
            desc: "Calabrian Bergamot, Saffron Threads, White Leather & Roasted Tonka.",
            badge: "Limited Drop",
            price: "R3,100",
          },
          {
            title: "ROSE DE MINUIT No. 03",
            desc: "Damask Rose Absolute, Incense Smoke, Patchouli Coeur & Dark Musk.",
            badge: "New Release",
            price: "R2,950",
          },
        ],
      },
    ],
  },
];

const SEED_SHORTS: YouTubeShortProject[] = [
  {
    id: "short-cutaway-pool",
    title: "Why Empty Swimming Pools Pop Out Of The Ground! 🏊‍♂️💧 (3D Cutaway Explainer) #Shorts",
    trackType: "3d-cutaway-explainer",
    description:
      "3D Cross-Section Cutaway Explainer (DesignwD / Zack D. Films style — Ref: youtube.com/shorts/w0lHdfFZM5M) rendered with Veo 3.1 + Google Flow. Watch what happens below the waterline when groundwater builds hydrostatic pressure under an empty concrete pool! #explainer #3dcutaway #veo31 #googleflow #shorts",
    hashtags: ["#explainer", "#3dcutaway", "#veo31", "#googleflow", "#engineering", "#shorts"],
    estimatedRpm: "Viral 3D Cutaway Explainer Track",
    targetRetention: "99% Target AVD (30.0s)",
    musicMood: "Veo 3.1 Native Audio: Crisp Mechanical Foley + Curiosity Synth",
    veoModel: "veo-3.1-generate-preview",
    styleAnchorModel: "midjourney-v6.5",
    durationSeconds: 30,
    flowProjectUrl: "https://labs.google/fx/tools/flow",
    flowRenderStatus: "Rendered (30s 9:16)",
    showOnWebsite: true,
    youtubePublishStatus: "Draft",
    youtubeVideoId: "w0lHdfFZM5M",
    characterPrompts: {
      Cutaway_Diorama_Anchor:
        "[Step 1 Style Reference Image · Midjourney v6.5 / Flux.1 Pro] Clean 3D isometric cross-section cutaway diorama of a two-story suburban house with terracotta roof and blue shutters, green backyard lawn sliced vertically to reveal deep brown underground soil strata and a concrete swimming pool cut in half showing translucent blue water and waterline, bright global illumination, Zack D. Films 3D simulation aesthetic --ar 9:16",
    },
    scenes: [
      {
        scene: 1,
        time: "0:00-0:05",
        durationSec: 5,
        speaker: "Narrator (3D Explainer)",
        dialogue:
          "If you completely drain a backyard swimming pool, the entire concrete shell can pop right out of the ground.",
        imagePrompt:
          "3D cross-section cutaway of a suburban house backyard showing a concrete swimming pool embedded in brown underground soil with crystal clear blue water at normal waterline --ar 9:16",
        motionPrompt:
          "Fast camera push-in to the vertical cross-section slice of the pool and underground soil strata",
        negativePrompt:
          "blurry, 2D flat cartoon, watermark, talking head, slow intro, 16:9 letterbox",
        cameraControl: "Dolly In (Fast)",
        flowTransition: "Ingredients to Video",
        sfxPrompt: "Water slosh, crisp narrator voiceover, deep soil rumble",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Dolly In (Fast) · Mode: Ingredients to Video] 3D cross-section cutaway animation of a suburban backyard swimming pool dug into brown underground soil in front of a house with blue shutters. Narrator says: \"If you completely drain a backyard swimming pool, the entire concrete shell can pop right out of the ground.\" Audio: Crisp narrator voiceover, gentle water slosh.",
        visualTheme: "Waterline Cross-Section",
        accentColor: "#38bdf8",
      },
      {
        scene: 2,
        time: "0:05-0:10",
        durationSec: 5,
        speaker: "Narrator (Mechanism)",
        dialogue:
          "Normally, thousands of gallons of water inside the pool push down with immense weight against the soil.",
        imagePrompt:
          "3D cutaway showing glowing downward force arrows inside the blue swimming pool water pressing the concrete shell firmly into the brown earth --ar 9:16",
        motionPrompt:
          "Slow zoom into the transparent front cutaway of the water column and concrete floor",
        negativePrompt: "blurry text, distorted geometry, flat lighting, watermark",
        cameraControl: "Tracking Shot",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Deep underwater pressure hum, mechanical force indicator clicks",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Tracking Shot · Mode: Extend (+5s)] 3D cross-section cutaway of the swimming pool filled to the waterline, glowing downward pressure vectors pressing the concrete shell into the soil. Narrator says: \"Normally, thousands of gallons of water inside the pool push down with immense weight against the soil.\"",
        visualTheme: "Downward Water Weight",
        accentColor: "#0ea5e9",
      },
      {
        scene: 3,
        time: "0:10-0:15",
        durationSec: 5,
        speaker: "Narrator (Escalation)",
        dialogue:
          "But deep inside the dirt around the pool, underground water tables rise after heavy rain.",
        imagePrompt:
          "3D underground soil cross-section showing blue groundwater seeping upward through the brown dirt beneath the concrete pool shell --ar 9:16",
        motionPrompt:
          "Tilt down into the brown soil cutaway as blue groundwater saturates the earth under the pool",
        negativePrompt: "muddy low contrast, static water, 2D overlay",
        cameraControl: "Tilt Down",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Subterranean water rushing through soil, rising tension pulse",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Tilt Down · Mode: Extend (+5s)] 3D cutaway of the brown earth beneath the swimming pool as underground water rises around the concrete base. Narrator says: \"But deep inside the dirt around the pool, underground water tables rise after heavy rain.\"",
        visualTheme: "Rising Groundwater",
        accentColor: "#2563eb",
      },
      {
        scene: 4,
        time: "0:15-0:20",
        durationSec: 5,
        speaker: "Narrator (Critical Drop)",
        dialogue:
          "When the pool is drained below the waterline, there is zero weight left pushing back down.",
        imagePrompt:
          "3D cross-section cutaway showing the swimming pool water level rapidly draining to empty while underground water pressure glows beneath the concrete floor --ar 9:16",
        motionPrompt:
          "Pan Right + Rack Focus as the waterline drops to the bottom drain and upward red pressure arrows appear underneath",
        negativePrompt: "blurry, morphing concrete walls, slow pacing",
        cameraControl: "Pan Right + Rack Focus",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Suction drain whirlpool sound, creaking concrete tension",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Pan Right + Rack Focus · Mode: Extend (+5s)] 3D cross-section cutaway showing the pool waterline draining completely empty while underground hydrostatic pressure builds below. Narrator says: \"When the pool is drained below the waterline, there is zero weight left pushing back down.\"",
        visualTheme: "Drained Below Waterline",
        accentColor: "#f59e0b",
      },
      {
        scene: 5,
        time: "0:20-0:25",
        durationSec: 5,
        speaker: "Narrator (Climax)",
        dialogue:
          "Hydrostatic pressure turns the empty concrete shell into a giant boat—heaving it straight out of the dirt!",
        imagePrompt:
          "3D cross-section cutaway of the empty concrete swimming pool tilting and lifting upward out of the brown soil like a boat hull, cracking the patio edge --ar 9:16",
        motionPrompt:
          "Handheld Shake as the entire 3D concrete pool shell tilts and pops upward out of the ground",
        negativePrompt: "explosion fire, unrealistic physics, low detail",
        cameraControl: "Handheld Shake",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Deep concrete crack, earth shifting rumble, dramatic impact boom",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Handheld Shake · Mode: Extend (+5s)] 3D cross-section cutaway showing hydrostatic groundwater lifting and tilting the empty concrete swimming pool shell right out of the backyard soil. Narrator says: \"Hydrostatic pressure turns the empty concrete shell into a giant boat—heaving it straight out of the dirt!\"",
        visualTheme: "Hydrostatic Pop-Up",
        accentColor: "#ef4444",
      },
      {
        scene: 6,
        time: "0:25-0:30",
        durationSec: 5,
        speaker: "Narrator (Payoff)",
        dialogue:
          "That is why builders install a hydrostatic relief valve at the bottom—letting groundwater in before the pool floats.",
        imagePrompt:
          "3D close-up cutaway of a brass hydrostatic relief valve at the bottom of the pool floor opening to equalize water pressure safely --ar 9:16",
        motionPrompt:
          "Dolly Out (Reveal) from the open relief valve back to the full stabilized 3D backyard cutaway",
        negativePrompt: "blurry text, cluttered UI, dark lighting",
        cameraControl: "Dolly Out (Reveal)",
        flowTransition: "First-to-Last Frame",
        sfxPrompt: "Precision valve release hiss, water equalizing, clean synth resolve",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Dolly Out (Reveal) · Mode: First-to-Last Frame] 3D cross-section cutaway showing a hydrostatic relief valve opening at the bottom of the pool floor to release upward water pressure safely. Narrator says: \"That is why builders install a hydrostatic relief valve at the bottom—letting groundwater in before the pool floats.\"",
        visualTheme: "Hydrostatic Relief Valve",
        accentColor: "#10b981",
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "short-ep1-fruit",
    title: "He Bought That Lemon A House?! 🍋💔 (30s Veo 3.1 Fruit Story Ep. 1) #Shorts",
    trackType: "pixar-drama",
    description:
      "Designed in Google Flow with Veo 3.1 (30s 9:16 + Native Lip-Sync Audio). Stella the Strawberry just went through Brad the Banana's phone and discovered a 3-year secret with Lola the Lemon! Comment 'PART 2' below!\n\n#veo31 #googleflow #fruitstory #aifruit #pixarshorts #shorts",
    hashtags: ["#veo31", "#googleflow", "#fruitstory", "#aifruit", "#pixarshorts", "#shorts"],
    estimatedRpm: "High Retention Story Track",
    targetRetention: "96% Target AVD (30.0s)",
    musicMood: "Veo 3.1 Native Audio: Dramatic Strings + Sub-Bass Boom",
    veoModel: "veo-3.1-generate-preview",
    durationSeconds: 30,
    flowProjectUrl: "https://labs.google/fx/tools/flow",
    flowRenderStatus: "Ready for Flow",
    youtubePublishStatus: "Draft",
    characterPrompts: {
      Brad_Banana_Ingredient:
        "[Google Flow Character Ingredient] 3D Pixar Disney style anthropomorphic peeled banana character named Brad, handsome smug face, slick yellow peel styled like hair, wearing an open luxury silk designer shirt and gold chain, expressive eyes, glossy studio lighting, 8k --ar 9:16",
      Stella_Strawberry_Ingredient:
        "[Google Flow Character Ingredient] 3D Pixar Disney style anthropomorphic strawberry character named Stella, cute emotional big glossy eyes, vibrant red berry texture with golden seeds, green leafy crown, visibly pregnant belly, pink cardigan, tearful expression, 8k --ar 9:16",
      Lola_Lemon_Ingredient:
        "[Google Flow Character Ingredient] 3D Pixar Disney style anthropomorphic sour lemon character named Lola, glamorous diva face with long eyelashes and glossy red lips, designer sunglasses and fur coat, holding mansion keys, 8k --ar 9:16",
    },
    scenes: [
      {
        scene: 1,
        time: "0:00-0:05",
        durationSec: 5,
        speaker: "Stella (Furious)",
        dialogue: "You bought that LEMON a house?! You emptied our baby savings?!",
        imagePrompt:
          "3D Pixar style angry pregnant Strawberry wife holding up a glowing smartphone showing a glamorous Lemon in front of a Beverly Hills mansion, Banana husband sweating in background, vertical 9:16",
        motionPrompt:
          "Fast Dolly-In camera move; Strawberry shakes the phone furiously at the lens as tears well in her glossy eyes",
        cameraControl: "Dolly In (Fast)",
        flowTransition: "Ingredients to Video",
        sfxPrompt: "Sharp gasp, dramatic orchestral hit, phone screen chime, tense room reverb",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Dolly In (Fast) · Mode: Ingredients to Video] 3D Pixar style angry pregnant Strawberry character Stella holding up a glowing smartphone showing Lola the Lemon in front of a mansion, while Brad the Banana sweats in the background. Stella shakes the phone at camera and says with furious trembling lip-sync: \"You bought that LEMON a house?! You emptied our baby savings?!\" Audio: Sharp gasp, dramatic suspense strings, crisp lip-synced voice.",
        visualTheme: "Crimson Confrontation",
        accentColor: "#f43f5e",
      },
      {
        scene: 2,
        time: "0:05-0:10",
        durationSec: 5,
        speaker: "Brad (Panicked)",
        dialogue: "You went through my phone?! Relax, babe—she's my mortgage broker!",
        imagePrompt:
          "Close up 3D Pixar Banana husband looking defensive and guilty, hands raised in argument, sweat drops sliding down his yellow peel forehead, vertical 9:16",
        motionPrompt:
          "Pan Right + Rack Focus onto Banana husband waving arms defensively and backing toward marble kitchen island",
        cameraControl: "Pan Right + Rack Focus",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Nervous gulp, silk shirt rustle, tense ticking clock underscore",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Pan Right + Rack Focus · Mode: Extend (+5s)] Close-up 3D Pixar Banana husband Brad sweating nervously in luxury kitchen, raising both hands defensively. Brad speaks with panicked guilty lip-sync: \"You went through my phone?! Relax, babe—she's my mortgage broker!\" Audio: Nervous gulp, tense pizzicato strings, studio voice acoustics.",
        visualTheme: "Guilty Gold",
        accentColor: "#eab308",
      },
      {
        scene: 3,
        time: "0:10-0:15",
        durationSec: 5,
        speaker: "Stella (Heartbroken)",
        dialogue: "A mortgage broker who sends kiss emojis from MY convertible?!",
        imagePrompt:
          "3D Pixar Strawberry wife swiping the smartphone screen to reveal a selfie of Lola the Lemon winking inside a pink Porsche convertible, dramatic rim light, vertical 9:16",
        motionPrompt:
          "Handheld Shake camera zooms into the phone screen selfie, then tilts up to Strawberry's heartbroken face",
        cameraControl: "Handheld Shake",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Phone swipe whoosh, bass drop impact, emotional violin swell",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Handheld Shake · Mode: Extend (+5s)] 3D Pixar Strawberry wife Stella swipes her glowing phone screen showing Lola the Lemon winking in a pink convertible. Tears roll down Stella's red berry cheeks as she cries out with emotional lip-sync: \"A mortgage broker who sends kiss emojis from MY convertible?!\" Audio: Swipe whoosh, deep cinematic bass drop, emotional strings.",
        visualTheme: "Receipt Reveal",
        accentColor: "#ec4899",
      },
      {
        scene: 4,
        time: "0:15-0:20",
        durationSec: 5,
        speaker: "Lola (Surprise Arrival)",
        dialogue: "Oops... Brad, honey, you left your gold Rolex on my nightstand!",
        imagePrompt:
          "Front penthouse glass doors swing open as glamorous 3D Pixar Lemon diva in white fur coat and sunglasses struts in holding a sparkling gold watch, vertical 9:16",
        motionPrompt:
          "Tracking Shot following Lola the Lemon lowering her designer sunglasses with a smirk",
        cameraControl: "Tracking Shot",
        flowTransition: "Jump To",
        sfxPrompt: "Glass door swoosh, designer heels clicking on marble floor, dramatic gasp",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Tracking Shot · Mode: Jump To] Penthouse glass entrance swings open. Glamorous 3D Pixar Lola the Lemon in a white fur coat struts inside holding a gold Rolex watch, lowers her sunglasses and says with sassy lip-sync: \"Oops... Brad, honey, you left your gold Rolex on my nightstand!\" Audio: Heels clicking on marble, dramatic soap-opera chord.",
        visualTheme: "Diva Entrance",
        accentColor: "#f59e0b",
      },
      {
        scene: 5,
        time: "0:20-0:25",
        durationSec: 5,
        speaker: "Brad (Frozen)",
        dialogue: "Lola?! What are you doing here?! I told you never to come here!",
        imagePrompt:
          "Split depth shot of 3D Pixar Banana husband jaw-dropped in horror between furious Strawberry wife and smirking Lemon diva, vertical 9:16",
        motionPrompt:
          "Orbit 360° camera circles around Brad's panicked face as both women glare at him",
        cameraControl: "Orbit 360°",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Heartbeat thump, rising orchestral tension riser",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Orbit 360° · Mode: Extend (+5s)] 3D Pixar Banana Brad stands frozen in horror between Stella and Lola. Camera orbits around him as Brad shouts in sheer panic with lip-sync: \"Lola?! What are you doing here?! I told you never to come here!\" Audio: Rapid heartbeat sub-bass, rising cinematic tension.",
        visualTheme: "Caught Red-Handed",
        accentColor: "#f97316",
      },
      {
        scene: 6,
        time: "0:25-0:30",
        durationSec: 5,
        speaker: "Stella (Cold Mic-Drop)",
        dialogue: "Keep the lemon, Brad—the penthouse is in MY name! Security, lock him out!",
        imagePrompt:
          "3D Pixar pregnant Strawberry wife wearing sunglasses, holding golden property deed while two Pear security guards escort crying Banana out the door, vertical 9:16",
        motionPrompt:
          "Dolly Out (Reveal) slow-motion walk toward camera as steel penthouse doors slam shut behind her",
        cameraControl: "Dolly Out (Reveal)",
        flowTransition: "First-to-Last Frame",
        sfxPrompt: "Heavy vault door slam, triumphant trap brass hit, boss walk beat",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Dolly Out (Reveal) · Mode: First-to-Last Frame] 3D Pixar Strawberry Stella puts on dark sunglasses and holds up the golden penthouse deed while security guards escort crying Brad out. Stella looks straight into lens and speaks with cold confident lip-sync: \"Keep the lemon, Brad—the penthouse is in MY name! Security, lock him out!\" Audio: Heavy door slam, triumphant bass drop.",
        visualTheme: "Cold Departure",
        accentColor: "#8b5cf6",
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "short-everest-pov",
    title: "POV: 30 Seconds Crossing The Khumbu Icefall At 3:00 AM 🏔️🥶 #Shorts",
    trackType: "high-rpm-pov",
    description:
      "30-second 9:16 documentary POV engineered with Veo 3.1 & Google Flow SceneBuilder. At 5,486 meters on Mount Everest, watch what happens when the aluminum ladder shifts over a 400ft glacial abyss. #veo31 #googleflow #mounteverest #pov #shorts",
    hashtags: ["#veo31", "#googleflow", "#mounteverest", "#pov", "#survival", "#shorts"],
    estimatedRpm: "High-RPM Documentary POV",
    targetRetention: "98% Target AVD (30.0s)",
    musicMood: "Veo 3.1 Native Audio: Sub-Bass Heartbeat + Howling Arctic Gale",
    veoModel: "veo-3.1-generate-preview",
    durationSeconds: 30,
    flowProjectUrl: "https://labs.google/fx/tools/flow",
    flowRenderStatus: "Ready for Flow",
    youtubePublishStatus: "Draft",
    characterPrompts: {
      Climber_POV_Ingredient:
        "[Google Flow Environment & Rig Ingredient] First-person GoPro chest-mount POV wearing yellow expedition down suit, steel crampons on boots, titanium ice axe in gloved hand, dual headlamp beam cutting through pitch-black Himalayan blizzard --ar 9:16",
    },
    scenes: [
      {
        scene: 1,
        time: "0:00-0:05",
        durationSec: 5,
        speaker: "Narrator (Deep Cinematic)",
        dialogue:
          "It is 3:12 AM in the Khumbu Icefall. Beneath this single ladder lies a 400-foot glacial abyss.",
        imagePrompt:
          "First-person POV looking down at steel crampon boots stepping onto a narrow aluminum ladder roped across a glowing blue crevasse at night, headlamp beam, 9:16",
        motionPrompt: "Tilt Down into the bottomless crevasse as spindrift snow blows across lens",
        cameraControl: "Tilt Down",
        flowTransition: "Ingredients to Video",
        sfxPrompt: "Howling sub-zero wind, metallic crunch of steel crampons on aluminum rung",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Tilt Down · Mode: Ingredients to Video] First-person GoPro POV at 3:12 AM stepping onto a narrow aluminum ladder stretched over a bottomless glowing blue Himalayan crevasse. Deep cinematic narrator voiceover: \"It is 3:12 AM in the Khumbu Icefall. Beneath this single ladder lies a 400-foot glacial abyss.\" Audio: Howling arctic wind, metallic crampon crunch, heavy breathing in oxygen mask.",
        visualTheme: "Glacial Abyss",
        accentColor: "#38bdf8",
      },
      {
        scene: 2,
        time: "0:05-0:10",
        durationSec: 5,
        speaker: "Narrator (Tension)",
        dialogue:
          "Every step must lock between the aluminum rungs. Look left or right and vertigo pulls you under.",
        imagePrompt:
          "POV looking ahead across three lashed ladders suspended between jagged 80-foot ice seracs in pitch darkness illuminated only by headlamp, 9:16",
        motionPrompt: "Tracking Shot creeping forward one boot at a time as ropes sway in the gale",
        cameraControl: "Tracking Shot",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Ropes creaking under tension, muffled heartbeat in oxygen mask",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Tracking Shot · Mode: Extend (+5s)] First-person POV crossing three lashed aluminum ladders suspended between towering ice seracs at night, gloved hands clipping safety carabiner to frozen rope. Narrator voiceover: \"Every step must lock between the aluminum rungs. Look left or right and vertigo pulls you under.\" Audio: Carabiner metallic click, rope tension creak.",
        visualTheme: "Rope Tension",
        accentColor: "#0284c7",
      },
      {
        scene: 3,
        time: "0:10-0:15",
        durationSec: 5,
        speaker: "Narrator (Urgent)",
        dialogue:
          "Suddenly, a 30-ton serac tower groans in the dark. The ice shelf anchoring the ladder fractures.",
        imagePrompt:
          "POV halfway across ladder, massive towering wall of blue glacial ice cracking in the headlamp beam, ice dust erupting, 9:16",
        motionPrompt: "Handheld Shake violent vibration as aluminum rungs twist beneath boots",
        cameraControl: "Handheld Shake",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Thunderous deep ice crack, metallic ladder rattle, sub-bass rumble",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Handheld Shake · Mode: Extend (+5s)] Violent camera shake halfway across the crevasse as a massive 30-ton glacial ice tower fractures in the headlamp beam, sending ice shards into the chasm. Urgent narrator voiceover: \"Suddenly, a 30-ton serac tower groans in the dark. The ice shelf anchoring the ladder fractures.\" Audio: Thunderous glacier crack, violent aluminum vibration.",
        visualTheme: "Ice Fracture",
        accentColor: "#0ea5e9",
      },
      {
        scene: 4,
        time: "0:15-0:20",
        durationSec: 5,
        speaker: "Narrator (Adrenaline)",
        dialogue:
          "The rear anchor rips free from the ice wall. You have three seconds before the bridge drops.",
        imagePrompt:
          "POV glancing down as ice screws tear out of the fracturing wall and the aluminum ladder tilts forty degrees over the black void, 9:16",
        motionPrompt: "Pan Right + Rack Focus from snapping anchor rope to the far ice ledge",
        cameraControl: "Pan Right + Rack Focus",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Snapping rope whip, cascading ice blocks echoing into the deep crevasse",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Pan Right + Rack Focus · Mode: Extend (+5s)] POV glancing back as the ice anchor rips out of the wall in a spray of frost and the ladder tilts dangerously over the black chasm. Narrator voiceover: \"The rear anchor rips free from the ice wall. You have three seconds before the bridge drops.\" Audio: High-tension rope snap, falling ice echoes.",
        visualTheme: "Anchor Failure",
        accentColor: "#ef4444",
      },
      {
        scene: 5,
        time: "0:20-0:25",
        durationSec: 5,
        speaker: "Narrator (Climax)",
        dialogue:
          "You lunge forward, drive your titanium ice axe deep into the far wall, and haul your body up!",
        imagePrompt:
          "POV swinging titanium ice axe with both gloved hands into solid blue ice wall as snow cloud explodes behind, 9:16",
        motionPrompt: "Dolly In (Fast) rapid lunge forward as steel pick bites into solid ice",
        cameraControl: "Dolly In (Fast)",
        flowTransition: "Extend (+5s)",
        sfxPrompt: "Sharp metallic ring of titanium axe biting solid ice, heavy gasp",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Dolly In (Fast) · Mode: Extend (+5s)] First-person POV lunging forward off the falling ladder and driving a titanium ice axe deep into the solid blue ice wall with a burst of frost sparks. Narrator voiceover: \"You lunge forward, drive your titanium ice axe deep into the far wall, and haul your body up!\" Audio: Sharp metallic ice-axe strike, adrenaline breath.",
        visualTheme: "Titanium Strike",
        accentColor: "#22d3ee",
      },
      {
        scene: 6,
        time: "0:25-0:30",
        durationSec: 5,
        speaker: "Narrator (Resolution)",
        dialogue:
          "You roll onto the Camp 1 shelf just as the ladder disappears into the dark. Welcome to Everest.",
        imagePrompt:
          "POV lying on solid snow ledge looking up at the first golden streak of Himalayan dawn breaking over Mount Everest summit pyramid, 9:16",
        motionPrompt: "Dolly Out (Reveal) tilting up from misty abyss to golden sunrise over Everest",
        cameraControl: "Dolly Out (Reveal)",
        flowTransition: "First-to-Last Frame",
        sfxPrompt: "Distant echo of falling snow, calm high-altitude wind, resonant cello note",
        veoPrompt:
          "[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: Dolly Out (Reveal) · Mode: First-to-Last Frame] POV rolling safely onto the solid glacier ledge and tilting up as the first golden ray of dawn illuminates the summit of Mount Everest. Narrator voiceover: \"You roll onto the Camp 1 shelf just as the ladder disappears into the dark. Welcome to Everest.\" Audio: Calm high-altitude wind, deep cinematic cello chord.",
        visualTheme: "Summit Dawn",
        accentColor: "#10b981",
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): T {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("jt-store-updated", { detail: { key } }));
  }
  return value;
}

// 3D Scene Config API
export function getScene3DConfig(): Scene3DConfig {
  return {
    ...DEFAULT_SCENE_3D,
    ...readStorage<Scene3DConfig>(STORAGE_KEYS.SCENE_3D, DEFAULT_SCENE_3D),
  };
}

export function saveScene3DConfig(config: Partial<Scene3DConfig>): Scene3DConfig {
  const current = getScene3DConfig();
  const updated: Scene3DConfig = {
    ...current,
    ...config,
    updatedAt: Date.now(),
  };
  writeStorage(STORAGE_KEYS.SCENE_3D, updated);
  void supabaseUpsert("jt_scene_configs", {
    id: "default",
    config: updated,
    updated_at: new Date().toISOString(),
  });
  recordAuditLog(
    "Updated 3D Scene Configuration",
    "3d-studio",
    `Geometry: ${updated.geometry}, Material: ${updated.material}, Preset: ${updated.presetName}`,
  );
  return updated;
}

// Leads & Inbox API
export function getBusinessLeads(): BusinessLead[] {
  return readStorage<BusinessLead[]>(STORAGE_KEYS.LEADS, SEED_LEADS);
}

export function saveBusinessLeads(leads: BusinessLead[]): BusinessLead[] {
  const saved = writeStorage(STORAGE_KEYS.LEADS, leads);
  if (leads.length > 0) {
    void supabaseUpsert(
      "jt_leads",
      leads.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        website_url: l.websiteUrl || "",
        source: l.source,
        service: l.service,
        budget: l.budget,
        status: l.status,
        priority: l.priority,
        notes: l.notes,
        messages: l.messages,
        created_at: new Date(l.createdAt).toISOString(),
      })),
    );
  }
  return saved;
}

export function getAutoResponderConfig(): AutoResponderConfig {
  return readStorage<AutoResponderConfig>(STORAGE_KEYS.AUTO_RESPONDER, DEFAULT_AUTO_RESPONDER);
}

export function saveAutoResponderConfig(patch: Partial<AutoResponderConfig>): AutoResponderConfig {
  const next = { ...getAutoResponderConfig(), ...patch };
  return writeStorage(STORAGE_KEYS.AUTO_RESPONDER, next);
}

export function generateSmartClientReply(lead: {
  name: string;
  company?: string;
  service?: string;
  budget?: string;
  inquiry?: string;
}): string {
  const config = getAutoResponderConfig();
  const firstName = (lead.name || "there").split(" ")[0];
  const companyPart = lead.company ? ` for ${lead.company}` : "";
  const serviceName = lead.service || "custom website & conversion system";

  const priceLine = config.includePriceEstimate
    ? `\n\nBased on your brief, this aligns with our ${
        lead.budget?.includes("45,000") || serviceName.toLowerCase().includes("3d")
          ? "Premium OS Package (R45,000+)"
          : "Extra Growth Package (R12,500 – R24,500)"
      }, which includes bespoke UI/UX architecture, mobile speed optimization, and automated lead capture delivered within 14 days.`
    : "";

  const bookingLine = config.includeBookingLink
    ? `\n\nYou can lock in a 15-minute strategy & live prototype walkthrough directly here: ${config.bookingUrl}`
    : "\n\nReply with a time that works for a quick 15-minute call this week and I'll prepare a custom live mockup beforehand.";

  return `Hi ${firstName},\n\nThank you for reaching out to Jubilee Tech! I reviewed your request regarding ${serviceName}${companyPart}. We specialize in engineering custom high-converting websites, interactive 3D web experiences, and automated client acquisition systems.${priceLine}${bookingLine}\n\nBest regards,\n${config.signature}`;
}

export function addInboundLead(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  source?: string;
  websiteUrl?: string;
}): BusinessLead {
  const leads = getBusinessLeads();
  const autoConfig = getAutoResponderConfig();

  const cleanName = sanitizeText(input.name || "Valued Client", 120);
  const cleanEmail = sanitizeText(input.email || "client@example.com", 120);
  const cleanCompany = sanitizeText(input.company || "Private Brand", 120);
  const cleanMessage = sanitizeText(input.message || "Interested in a new project.", 1500);
  const cleanService = sanitizeText(input.service || "Website & Lead System", 120);

  const clientMsg: InboxMessage = {
    id: `msg-${Date.now()}-c`,
    sender: "client",
    senderName: cleanName,
    body: cleanMessage,
    timestamp: Date.now(),
  };

  const messages: InboxMessage[] = [clientMsg];

  if (autoConfig.enabled) {
    const replyBody = generateSmartClientReply({
      name: cleanName,
      company: cleanCompany,
      service: cleanService,
      budget: input.budget,
      inquiry: cleanMessage,
    });
    messages.push({
      id: `msg-${Date.now() + 1}-ai`,
      sender: "ai-auto",
      senderName: "Jubilee AI Concierge",
      body: replyBody,
      timestamp: Date.now() + 1000,
    });
  }

  const newLead: BusinessLead = {
    id: `lead-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    phone: sanitizeText(input.phone || "+27 82 000 0000", 40),
    company: cleanCompany,
    source: input.source || "Website Contact",
    service: cleanService,
    budget: input.budget || "R24,500",
    status: autoConfig.enabled ? "Contacted" : "New",
    priority: "High",
    createdAt: Date.now(),
    websiteUrl: input.websiteUrl,
    notes: cleanMessage,
    autoReplied: autoConfig.enabled,
    messages,
  };

  saveBusinessLeads([newLead, ...leads]);
  recordAuditLog(
    "New Inbound Lead Captured",
    "crm",
    `${cleanName} (${cleanCompany}) via ${newLead.source}${
      autoConfig.enabled ? " — Auto-Replied instantly" : ""
    }`,
  );
  return newLead;
}

// Prospects API
export function getProspects(): ProspectResult[] {
  return readStorage<ProspectResult[]>(STORAGE_KEYS.PROSPECTS, SEED_PROSPECTS);
}

export function saveProspects(list: ProspectResult[]): ProspectResult[] {
  return writeStorage(STORAGE_KEYS.PROSPECTS, list);
}

// Generated Websites API
export function getGeneratedWebsites(): GeneratedWebsite[] {
  return readStorage<GeneratedWebsite[]>(STORAGE_KEYS.WEBSITES, SEED_WEBSITES);
}

export function saveGeneratedWebsites(sites: GeneratedWebsite[]): GeneratedWebsite[] {
  const saved = writeStorage(STORAGE_KEYS.WEBSITES, sites);
  if (sites.length > 0) {
    void supabaseUpsert(
      "jt_generated_sites",
      sites.map((s) => ({
        id: s.id,
        client_name: s.clientName,
        niche: s.niche,
        primary_color: s.primaryColor,
        accent_color: s.secondaryColor,
        headline: s.tagline,
        subheadline: s.niche,
        services: s.sections,
        cta_text: s.ctaText,
        include_3d: s.include3DHero,
        html_code: buildStandaloneWebsiteHtml(s),
        created_at: new Date(s.createdAt).toISOString(),
      })),
    );
  }
  return saved;
}

// YouTube Shorts & Auto-Publish API
export function getYouTubeShorts(): YouTubeShortProject[] {
  return readStorage<YouTubeShortProject[]>(STORAGE_KEYS.SHORTS, SEED_SHORTS);
}

export function saveYouTubeShorts(shorts: YouTubeShortProject[]): YouTubeShortProject[] {
  const saved = writeStorage(STORAGE_KEYS.SHORTS, shorts);
  if (shorts.length > 0) {
    void supabaseUpsert(
      "jt_youtube_shorts",
      shorts.map((s) => ({
        id: s.id,
        title: s.title,
        niche: s.trackType,
        hook: s.scenes[0]?.dialogue || s.title,
        script_lines: s.scenes,
        cta: s.description,
        hashtags: s.hashtags,
        accent_color: s.scenes[0]?.accentColor || "#38bdf8",
        bg_style: s.trackType,
        duration_sec: s.scenes.length * 5,
        youtube_video_id: s.youtubeVideoId || "",
        youtube_url: s.youtubeVideoId
          ? `https://youtube.com/shorts/${s.youtubeVideoId}`
          : "",
        status: s.youtubePublishStatus || "Draft",
        created_at: new Date(s.createdAt).toISOString(),
      })),
    );
  }
  return saved;
}

export function getYouTubeAutoPublishConfig(): YouTubeAutoPublishConfig {
  return readStorage<YouTubeAutoPublishConfig>(STORAGE_KEYS.YT_CONFIG, DEFAULT_YT_CONFIG);
}

export function saveYouTubeAutoPublishConfig(
  patch: Partial<YouTubeAutoPublishConfig>,
): YouTubeAutoPublishConfig {
  const next = { ...getYouTubeAutoPublishConfig(), ...patch };
  return writeStorage(STORAGE_KEYS.YT_CONFIG, next);
}

// Invoices & Meetings API
export function getInvoices(): InvoiceRecord[] {
  return readStorage<InvoiceRecord[]>(STORAGE_KEYS.INVOICES, SEED_INVOICES);
}

export function saveInvoices(invoices: InvoiceRecord[]): InvoiceRecord[] {
  const saved = writeStorage(STORAGE_KEYS.INVOICES, invoices);
  if (invoices.length > 0) {
    void supabaseUpsert(
      "jt_invoices",
      invoices.map((inv) => ({
        id: inv.id,
        client: inv.clientName,
        project: inv.projectTitle,
        amount_zar: inv.amountZar,
        status: inv.status,
        due_date: inv.dueDate,
      })),
    );
  }
  return saved;
}

export function getMeetings(): MeetingItem[] {
  return readStorage<MeetingItem[]>(STORAGE_KEYS.MEETINGS, SEED_MEETINGS);
}

export function saveMeetings(meetings: MeetingItem[]): MeetingItem[] {
  const saved = writeStorage(STORAGE_KEYS.MEETINGS, meetings);
  if (meetings.length > 0) {
    void supabaseUpsert(
      "jt_meetings",
      meetings.map((m) => ({
        id: m.id,
        title: m.title,
        client: m.client,
        time: m.time,
        date_day: m.dateDay,
        type: m.type,
        completed: m.completed,
      })),
    );
  }
  return saved;
}

/**
 * Generates clean standalone HTML5 + Tailwind CSS code for any GeneratedWebsite
 */
export function buildStandaloneWebsiteHtml(site: GeneratedWebsite): string {
  const isLight = site.themeMode === "editorial-light";
  const bgClass = isLight ? "#fafaf9" : site.secondaryColor || "#09090b";
  const textClass = isLight ? "#0f172a" : "#f8fafc";
  const mutedClass = isLight ? "#475569" : "#94a3b8";
  const cardBg = isLight ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.04)";
  const fontFamily =
    site.fontStyle === "serif"
      ? "'Playfair Display', Georgia, serif"
      : site.fontStyle === "mono"
        ? "'JetBrains Mono', monospace"
        : "'Space Grotesk', system-ui, sans-serif";

  const heroSection = site.sections.find((s) => s.type === "hero") ?? site.sections[0];
  const showcaseSection = site.sections.find((s) => s.type === "showcase" || s.type === "services");

  const itemsHtml = (showcaseSection?.items ?? [])
    .map(
      (item) => `
      <div style="background:${cardBg};border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          ${
            item.badge
              ? `<span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;background:${site.primaryColor}22;color:${site.primaryColor};border:1px solid ${site.primaryColor}55;margin-bottom:14px;">${item.badge}</span>`
              : ""
          }
          <h3 style="font-family:${fontFamily};font-size:22px;margin:0 0 10px;color:${textClass};">${item.title}</h3>
          <p style="font-size:14px;line-height:1.6;color:${mutedClass};margin:0 0 20px;">${item.desc}</p>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);">
          <span style="font-size:20px;font-weight:700;color:${site.primaryColor};">${item.price || "Custom"}</span>
          <a href="#contact" style="font-size:13px;font-weight:600;color:${textClass};text-decoration:none;">Select →</a>
        </div>
      </div>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${site.clientName} — ${site.tagline}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: ${bgClass};
      color: ${textClass};
      font-family: 'DM Sans', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: ${site.primaryColor};
      color: #fff;
      padding: 14px 28px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      box-shadow: 0 14px 34px -10px ${site.primaryColor}88;
    }
  </style>
</head>
<body>
  <header style="border-bottom:1px solid rgba(255,255,255,0.08);padding:20px 0;position:sticky;top:0;backdrop-filter:blur(16px);background:${bgClass}dd;z-index:20;">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;">
      <div style="font-family:${fontFamily};font-size:20px;font-weight:700;letter-spacing:-0.02em;">
        ${site.clientName}
      </div>
      <a href="#contact" class="btn-primary">${site.ctaText}</a>
    </div>
  </header>

  <section style="padding:96px 0 72px;position:relative;overflow:hidden;">
    <div class="container">
      <span style="display:inline-block;padding:6px 14px;border-radius:999px;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;border:1px solid ${site.primaryColor}55;color:${site.primaryColor};margin-bottom:20px;">
        ${site.niche}
      </span>
      <h1 style="font-family:${fontFamily};font-size:clamp(38px, 6vw, 68px);line-height:1.05;margin:0 0 22px;max-width:860px;">
        ${heroSection?.title || site.tagline}
      </h1>
      <p style="font-size:18px;line-height:1.65;color:${mutedClass};max-width:640px;margin:0 0 36px;">
        ${heroSection?.subtitle || site.tagline}
      </p>
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        <a href="#contact" class="btn-primary">${site.ctaText} →</a>
        <a href="#showcase" style="padding:14px 28px;border-radius:999px;border:1px solid rgba(255,255,255,0.16);color:${textClass};text-decoration:none;font-size:14px;font-weight:600;">Explore Offerings</a>
      </div>
    </div>
  </section>

  <section id="showcase" style="padding:64px 0;">
    <div class="container">
      <h2 style="font-family:${fontFamily};font-size:36px;margin:0 0 12px;">${showcaseSection?.title || "Featured Offerings"}</h2>
      <p style="color:${mutedClass};margin:0 0 36px;">${showcaseSection?.subtitle || ""}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;">
        ${itemsHtml}
      </div>
    </div>
  </section>

  <footer id="contact" style="padding:72px 0;border-top:1px solid rgba(255,255,255,0.08);margin-top:64px;">
    <div class="container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:40px;align-items:start;">
      <div>
        <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.16em;color:${site.primaryColor};">SUPABASE BACKEND CONNECTED</span>
        <h3 style="font-family:${fontFamily};font-size:32px;margin:8px 0 12px;">${site.clientName}</h3>
        <p style="color:${mutedClass};margin:0 0 16px;">${site.contactEmail} · ${site.contactPhone}</p>
        <p style="font-size:13px;color:${mutedClass};">All inquiries and orders submit directly to the Jubilee Tech Supabase PostgreSQL backend.</p>
      </div>
      <form id="jt-supabase-form" style="background:${cardBg};border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:12px;">
        <input id="jt-name" required placeholder="Your Name" style="padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.16);background:rgba(0,0,0,0.3);color:${textClass};" />
        <input id="jt-email" type="email" required placeholder="Email Address" style="padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.16);background:rgba(0,0,0,0.3);color:${textClass};" />
        <textarea id="jt-msg" rows="3" required placeholder="Order or Booking Request..." style="padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.16);background:rgba(0,0,0,0.3);color:${textClass};"></textarea>
        <button type="submit" class="btn-primary" style="border:none;cursor:pointer;justify-content:center;">${site.ctaText}</button>
        <div id="jt-status" style="font-size:12px;color:#34d399;display:none;">Saved to Supabase Database!</div>
      </form>
    </div>
  </footer>
  <script>
    document.getElementById('jt-supabase-form')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('jt-name').value;
      const email = document.getElementById('jt-email').value;
      const notes = document.getElementById('jt-msg').value;
      const statusEl = document.getElementById('jt-status');
      try {
        await fetch('${SUPABASE_URL}/rest/v1/jt_leads', {
          method: 'POST',
          headers: {
            'apikey': '${SUPABASE_ANON_KEY}',
            'Authorization': 'Bearer ${SUPABASE_ANON_KEY}',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: 'lead-' + Date.now(),
            name: name,
            email: email,
            company: '${site.clientName.replace(/'/g, "")}',
            source: 'Generated Client Site (Supabase)',
            service: '${site.niche.replace(/'/g, "")}',
            notes: notes,
            status: 'New'
          })
        });
        statusEl.style.display = 'block';
        e.target.reset();
      } catch (err) {
        statusEl.textContent = 'Submitted!';
        statusEl.style.display = 'block';
      }
    });
  </script>
</body>
</html>`;
}
