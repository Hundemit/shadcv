import type { MetadataRoute } from "next";
import { site } from "../data/resume/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: "ShadCV",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
