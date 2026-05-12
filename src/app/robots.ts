import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bagtyyar.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/rooms", "/rooms/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
