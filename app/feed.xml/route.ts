import { allProjects } from "@/data/projects";
import { siteConfig, SITE_URL } from "@/lib/site-config";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

/**
 * RSS 2.0 feed for all projects
 * Endpoint: /feed.xml
 * Consumer: RSS readers, aggregators, social media bots
 */
export async function GET() {
  // Sort by published date descending
  const sortedProjects = [...allProjects].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // Build RSS XML
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.feed.title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(siteConfig.feed.description)}</description>
    <language>${siteConfig.feed.language}</language>
    <managingEditor>${siteConfig.contact.email}</managingEditor>
    <webMaster>${siteConfig.contact.email}</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js 16</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    
    <!-- Organization -->
    <image>
      <url>${SITE_URL}/icon.svg</url>
      <title>${escapeXml(siteConfig.org.name)}</title>
      <link>${SITE_URL}</link>
    </image>

    <!-- Project Items -->
    ${sortedProjects
      .map(
        (project) => `
    <item>
      <title>${escapeXml(project.title)}</title>
      <link>${siteConfig.getUrl(`/projects/category/${project.category}/${project.slug}`)}</link>
      <guid isPermaLink="true">${siteConfig.getUrl(`/projects/category/${project.category}/${project.slug}`)}</guid>
      <description>${escapeXml(project.description)}</description>
      <content:encoded><![CDATA[
        <p><strong>Category:</strong> ${escapeXml(project.categoryLabel)}</p>
        <p><strong>Status:</strong> ${escapeXml(project.status)}</p>
        <p><strong>Client Sector:</strong> ${escapeXml(project.clientSector)}</p>
        <p><strong>Location:</strong> ${escapeXml(project.kpis.location)}</p>
        <p><strong>Timeline:</strong> ${escapeXml(project.kpis.timeline)}</p>
        <p><strong>Budget:</strong> ${escapeXml(project.kpis.budget)}</p>
        <p><strong>Capacity:</strong> ${escapeXml(project.kpis.capacity)}</p>
        <p>${escapeXml(project.description)}</p>
        <p><strong>Tags:</strong> ${project.tags.map(escapeXml).join(", ")}</p>
      ]]></content:encoded>
      <pubDate>${new Date(project.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(project.categoryLabel)}</category>
      ${project.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n")}
    </item>
    `,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
