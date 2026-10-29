/*
  Static project media keyed by slug. Images live in /public; the Project
  model stays text-only until media needs an admin workflow.
*/
export type ProjectShot = { src: string; alt: string; width: number; height: number };

export const projectMedia: Record<
  string,
  { shots: ProjectShot[]; storeUrl?: string; credit?: string }
> = {
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
