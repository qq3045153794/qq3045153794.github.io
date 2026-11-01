import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [kind, inputSlug] = process.argv.slice(2);
const validKinds = ["post", "note", "reading"];

if (!validKinds.includes(kind)) {
	console.error("Usage: node scripts/new-content.mjs <post|note|reading> [slug]");
	process.exit(1);
}

const date = new Date();
const isoDate = date.toISOString().slice(0, 10);
const isoDateTime = date.toISOString();

function slugify(value) {
	return value
		.normalize("NFKD")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

const slug = slugify(inputSlug || `untitled-${isoDate}`);
const folder = kind === "post" ? "posts" : "notes";
const targetDir = join("content", folder);
const target = join(targetDir, `${slug}.md`);

if (existsSync(target)) {
	console.error(`File already exists: ${target}`);
	process.exit(1);
}

const frontmatter = {
	post: `---
title: "未命名文章"
description: "请补充文章摘要"
publishDate: ${isoDate}
tags: []
series:
draft: true
pinned: false
---
`,
	note: `---
title: "未命名笔记"
description:
publishDate: ${isoDateTime}
tags: []
kind: note
draft: true
---
`,
	reading: `---
title: "未命名读书笔记"
description: "请补充阅读摘要"
publishDate: ${isoDate}
tags: []
kind: reading
format: book
status: reading
author:
rating:
sourceURL:
draft: true
---
`,
};

mkdirSync(targetDir, { recursive: true });
writeFileSync(target, frontmatter[kind], "utf8");
console.log(target);
