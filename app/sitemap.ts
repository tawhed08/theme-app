import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://themestudio.app"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/themes",
    "/colors",
    "/fonts",
    "/gradients",
    "/radius",
    "/shadows",
    "/spacing",
    "/generator",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/themes" ? 0.9 : 0.7,
  }));
}
