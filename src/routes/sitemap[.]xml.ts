import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { MONTHS_CONTENT, SITE_URL } from "@/lib/baby-months-data";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/sobre", changefreq: "monthly", priority: "0.4" },
          { path: "/contato", changefreq: "monthly", priority: "0.4" },
          { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.2" },
          { path: "/termos-de-uso", changefreq: "yearly", priority: "0.2" },
          { path: "/maternidade", changefreq: "weekly", priority: "0.8" },
          { path: "/cha-rifa", changefreq: "monthly", priority: "0.6" },
        ];
        const monthEntries = MONTHS_CONTENT.map((c) => ({
          path: `/${c.slug}`,
          changefreq: "monthly",
          priority: "0.8",
        }));

        const blogEntries = [
          "/blog/rotina-de-trocas-de-fralda",
          "/blog/dicas-para-evitar-assaduras",
          "/blog/desfralde-sem-estresse",
        ].map((path) => ({ path, changefreq: "monthly", priority: "0.7" }));

        const urls = [...staticEntries, ...monthEntries, ...blogEntries]
          .map((e) =>
            [
              "  <url>",
              `    <loc>${SITE_URL}${e.path}</loc>`,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              "  </url>",
            ].join("\n"),
          )
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
