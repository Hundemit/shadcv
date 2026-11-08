import type { MetadataRoute } from "next";
import { site } from "../data/resume/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = site.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // GEO optimization: Explicit crawl permissions for generative AI engines
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Applebot-Extended",
          "cohere-ai",
          "Meta-ExternalAgent",
          "OAI-SearchBot",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/template", "/impressum"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
