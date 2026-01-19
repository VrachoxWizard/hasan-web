import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "https://produktauto.com"
    )?.replace(/\/$/, "") || "https://produktauto.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cms/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
