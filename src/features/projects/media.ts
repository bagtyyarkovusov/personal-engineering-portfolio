/*
  Static project media keyed by slug. Images live in /public; the Project
  model stays text-only until media needs an admin workflow.
*/
export type ProjectShot = { src: string; alt: string; width: number; height: number };

const legacyCarberkMedia: Record<string, string> = {
  "/carberk/01-home.jpg": "/carberk/01-feed.jpg",
  "/carberk/03-listing-detail.jpg": "/carberk/02-listing-detail.jpg",
  "/carberk/05-chat.jpg": "/carberk/04-chat.jpg",
};

/**
 * Existing project bodies live in the database, so old seeded Markdown can
 * outlive the files it references. Normalize known legacy Carberk assets at
 * render time while the next seed/admin edit catches up.
 */
export function normalizeProjectBody(body: string) {
  return Object.entries(legacyCarberkMedia).reduce(
    (normalized, [legacySrc, currentSrc]) =>
      normalized.replaceAll(legacySrc, currentSrc),
    body,
  );
}

export const projectMedia: Record<
  string,
  { shots: ProjectShot[]; storeUrl?: string; credit?: string }
> = {
  "tayyn-hyzmat": {
    credit: "Synthetic data from the pre-release pilot build.",
    shots: [
      { src: "/tayyn/01-driver-region-grid.jpg", alt: "Tayyn Hyzmat driver app: region grid with order and driver counts", width: 720, height: 1558 },
      { src: "/tayyn/02-driver-incoming-offer.jpg", alt: "Tayyn Hyzmat driver app: 20-second incoming order offer", width: 720, height: 1558 },
      { src: "/tayyn/03-driver-active-trip.jpg", alt: "Tayyn Hyzmat driver app: active delivery with call and next-step actions", width: 720, height: 1558 },
      { src: "/tayyn/04-dispatcher-map.jpg", alt: "Tayyn Hyzmat dispatcher dashboard: live map with drivers", width: 1440, height: 900 },
      { src: "/tayyn/05-dispatcher-new-order.jpg", alt: "Tayyn Hyzmat dispatcher dashboard: new phoned-in order", width: 1440, height: 900 },
    ],
  },
  "car-marketplace": {
    storeUrl: "https://play.google.com/store/apps/details?id=com.auto_tm.ynamly",
    credit: "Demo data. Car photos: Wikimedia Commons contributors, CC BY-SA.",
    shots: [
      {
        src: "/carberk/01-feed.jpg",
        alt: "Carberk home feed with new listings and TMT prices",
        width: 720,
        height: 1600,
      },
      {
        src: "/carberk/02-listing-detail.jpg",
        alt: "Carberk listing detail for a Lexus RX with photo gallery and specs",
        width: 720,
        height: 1600,
      },
      {
        src: "/carberk/03-filters.jpg",
        alt: "Carberk search filters for condition, brand, year and price",
        width: 720,
        height: 1600,
      },
      {
        src: "/carberk/04-chat.jpg",
        alt: "Carberk buyer and seller chat about a Toyota Camry Hybrid",
        width: 720,
        height: 1600,
      },
    ],
  },
};

/*
  Self-hosted project videos keyed by slug, plus "intro" for the About page.
  Files live in /public/videos as H.264 MP4 with a poster and a WebVTT
  captions track. Each video lands in its own follow-up PR.
*/
export type ProjectVideo = {
  src: string;
  poster: string;
  captions: string;
  title: string;
};

export const projectVideos: Record<string, ProjectVideo> = {};

export function getProjectVideo(key: string): ProjectVideo | undefined {
  return Object.hasOwn(projectVideos, key) ? projectVideos[key] : undefined;
}

/* One-line proof under each case study header. Facts only from ME.md. */
export const projectFacts: Record<string, string> = {
  "car-marketplace": "Solo. May to Oct 2026. Live on Google Play.",
  "tayyn-hyzmat": "Internal pilot. Synthetic data.",
  "myorl-ent-clinic": "Live.",
  "gonka-ai-inference-infrastructure":
    "24 servers, 192 GPUs. Supported for 3 months.",
};

export function getProjectFacts(slug: string): string | undefined {
  return Object.hasOwn(projectFacts, slug) ? projectFacts[slug] : undefined;
}

/* Extra galleries shown below the main screenshots, e.g. unreleased work. */
export type ProjectGallery = {
  title: string;
  credit?: string;
  shots: ProjectShot[];
};

const adminShot = (file: string, alt: string): ProjectShot => ({
  src: `/carberk/admin/${file}.webp`,
  alt,
  width: 1600,
  height: 1079,
});

export const projectGalleries: Record<string, ProjectGallery[]> = {
  "car-marketplace": [
    {
      title: "Staff admin · ships in the next update · sample data",
      credit: "Sample data. Shown with Alpha Motors' agreement.",
      shots: [
        adminShot("14-inspection-intake", "Carberk staff admin: inspection intake for a Toyota Camry request from the app"),
        adminShot("15-technician-finding", "Carberk staff admin: technician checklist recording a front bumper finding"),
        adminShot("17-reviewer-finalize", "Carberk staff admin: independent reviewer finalizing the inspection report"),
        adminShot("18-report-released", "Carberk staff admin: released inspection report with marked findings on car diagrams"),
        adminShot("11-vin-history-orders", "Carberk staff admin: vehicle history order inbox with a VIN quote and paid order"),
        adminShot("20-metrics-overview", "Carberk staff admin: improvement scorecard comparing contact intent week over week"),
        adminShot("19-operational-health", "Carberk staff admin: operational health probes and queue backlog"),
        adminShot("03-listings", "Carberk staff admin: listing moderation table with seller, price and status"),
      ],
    },
  ],
};
