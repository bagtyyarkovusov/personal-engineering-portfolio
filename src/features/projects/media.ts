/*
  Static project media keyed by slug. Images live in /public; the Project
  model stays text-only until media needs an admin workflow.
*/
export type ProjectShot = { src: string; alt: string; width: number; height: number };

export const projectMedia: Record<string, { shots: ProjectShot[]; storeUrl?: string }> = {
  "car-marketplace": {
    storeUrl: "https://play.google.com/store/apps/details?id=com.auto_tm.ynamly",
    shots: [
      {
        src: "/carberk/01-home.jpg",
        alt: "Carberk home feed with vehicle listings and TMT prices",
        width: 486,
        height: 1080,
      },
      {
        src: "/carberk/03-listing-detail.jpg",
        alt: "Carberk listing detail with photos and specs",
        width: 486,
        height: 1080,
      },
      {
        src: "/carberk/05-chat.jpg",
        alt: "Carberk buyer and seller chat",
        width: 486,
        height: 1080,
      },
    ],
  },
};
