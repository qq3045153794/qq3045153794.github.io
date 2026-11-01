import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve("dist");
if (!existsSync(root)) {
	console.error("dist/ does not exist. Run the build first.");
	process.exit(1);
}

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

const htmlFiles = walk(root).filter((file) => extname(file) === ".html");
const failures = [];

function targetExists(urlPath) {
	const clean = decodeURIComponent(urlPath).replace(/^\/+/, "");
	const candidates =
		clean === ""
			? [join(root, "index.html")]
			: [join(root, clean), join(root, clean, "index.html"), join(root, `${clean}.html`)];
	return candidates.some((candidate) => existsSync(candidate));
}

for (const file of htmlFiles) {
	const html = readFileSync(file, "utf8");
	const anchors = html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi);

	for (const match of anchors) {
		const raw = match[1]?.trim();
		if (!raw || raw.startsWith("#") || raw.startsWith("//")) continue;
		if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;

		const withoutQuery = raw.split(/[?#]/, 1)[0];
		if (!withoutQuery) continue;

		let urlPath;
		if (withoutQuery.startsWith("/")) {
			urlPath = withoutQuery;
		} else {
			const relativeBase = file.slice(root.length).replace(/[^/]+$/, "");
			urlPath = resolve(root, `.${relativeBase}`, withoutQuery).slice(root.length);
		}

		if (!targetExists(urlPath)) {
			failures.push(`${file.slice(root.length)} -> ${raw}`);
		}
	}
}

if (failures.length > 0) {
	console.error(`Broken internal links (${failures.length}):`);
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files: no broken internal links.`);
