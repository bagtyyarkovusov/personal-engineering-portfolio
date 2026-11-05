/*
  Static project media keyed by slug. Images live in /public; the Project
  model stays text-only until media needs an admin workflow.
*/
export type ProjectShot = { src: string; alt: string; width: number; height: number };

export function getProjectShotSizes(shot: ProjectShot): string {
  return shot.width > shot.height
    ? "(min-width: 768px) 704px, calc(100vw - 4rem)"
    : "(min-width: 640px) 160px, calc((100vw - 5rem) / 2)";
}

const legacyCarberkMedia: Record<string, string> = {
  "/carberk/01-home.jpg": "/carberk/01-feed.jpg",
  "/carberk/03-listing-detail.jpg": "/carberk/02-listing-detail.jpg",
  "/carberk/05-chat.jpg": "/carberk/04-chat.jpg",
  "/carberk/feature-graphic.png": "/carberk/feature-graphic.webp",
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

export function getProjectCardShot(slug: string): ProjectShot | undefined {
  if (slug === "car-marketplace") {
    return {
      src: "/carberk/feature-graphic.png",
      alt: "Carberk car marketplace feature graphic",
      width: 1024,
      height: 500,
    };
  }

  const shots = projectMedia[slug]?.shots;
  return shots?.find((shot) => shot.width > shot.height) ?? shots?.[0];
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
  "myorl-ent-clinic": {
    credit: "Screenshots from the live MyORL clinic site.",
    shots: [
      {
        src: "/myorl/01-home-desktop.png",
        alt: "MyORL clinic website home page in Russian with appointment call to action",
        width: 1440,
        height: 900,
      },
      {
        src: "/myorl/02-condition-page.png",
        alt: "MyORL clinic condition page for chronic rhinitis with appointment call to action",
        width: 1440,
        height: 900,
      },
      {
        src: "/myorl/03-search-desktop.png",
        alt: "MyORL clinic search results for rhinitis across the medical content library",
        width: 1440,
        height: 900,
      },
      {
        src: "/myorl/04-home-mobile.png",
        alt: "MyORL clinic website home page on a mobile screen with language switcher and appointment button",
        width: 780,
        height: 1688,
      },
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
