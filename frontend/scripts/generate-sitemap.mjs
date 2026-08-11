import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const siteUrl = (process.env.SITE_URL || 'https://web-taklifnoma.uz').replace(/\/$/, '');
const outputPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url));
const today = new Date().toISOString().slice(0, 10);

const publicRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
];

const urls = publicRoutes.map(({ path, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(outputPath, sitemap, 'utf8');
console.log(`Generated sitemap: ${outputPath}`);
