export const prerender = true;

export async function GET() {
	const robots = `User-agent: *
Allow: /

Sitemap: https://learning.konxc.space/sitemap.xml`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}

