import { type CollectionEntry, getCollection } from "astro:content";

export type ContentKind = "post" | "note" | "reading";
export type ContentEntry =
	| CollectionEntry<"post">
	| CollectionEntry<"note">
	| CollectionEntry<"reading">;

export interface ContentItem {
	kind: ContentKind;
	kindLabel: string;
	entry: ContentEntry;
	id: string;
	title: string;
	description: string;
	publishDate: Date;
	updatedDate: Date | undefined;
	tags: string[];
	url: string;
	draft: boolean;
	pinned: boolean;
}

const kindLabels: Record<ContentKind, string> = {
	post: "文章",
	note: "笔记",
	reading: "读书笔记",
};

function isVisible(data: { draft: boolean; publishDate: Date }): boolean {
	if (!import.meta.env.PROD) return true;
	return !data.draft && data.publishDate.getTime() <= Date.now();
}

function normalizeEntry(kind: ContentKind, entry: ContentEntry): ContentItem {
	const data = entry.data;

	return {
		kind,
		kindLabel: kindLabels[kind],
		entry,
		id: entry.id,
		title: data.title,
		description: data.description ?? "",
		publishDate: data.publishDate,
		updatedDate: data.updatedDate,
		tags: data.tags ?? [],
		url: `/${kind === "post" ? "posts" : kind === "note" ? "notes" : "reading"}/${entry.id}/`,
		draft: data.draft ?? false,
		pinned: "pinned" in data ? Boolean(data.pinned) : false,
	};
}

export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
	return await getCollection("post", ({ data }) => isVisible(data));
}

export async function getAllNotes(): Promise<CollectionEntry<"note">[]> {
	return await getCollection("note", ({ data }) => isVisible(data));
}

export async function getAllReadings(): Promise<CollectionEntry<"reading">[]> {
	return await getCollection("reading", ({ data }) => isVisible(data));
}

export async function getAllContent(): Promise<ContentItem[]> {
	const [posts, notes, readings] = await Promise.all([
		getAllPosts(),
		getAllNotes(),
		getAllReadings(),
	]);

	return [
		...posts.map((entry) => normalizeEntry("post", entry)),
		...notes.map((entry) => normalizeEntry("note", entry)),
		...readings.map((entry) => normalizeEntry("reading", entry)),
	].sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}

export async function getTagMeta(tag: string): Promise<CollectionEntry<"tag"> | undefined> {
	const tagEntries = await getCollection("tag", (entry) => entry.id === tag);
	return tagEntries[0];
}

export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return Object.groupBy(posts, (post) => post.data.publishDate.getFullYear().toString());
}

export function groupContentByYear(items: ContentItem[]) {
	return Object.groupBy(items, (item) => item.publishDate.getFullYear().toString());
}

type Taggable = { tags?: string[]; data?: { tags?: string[] } };

export function getAllTags(entries: Taggable[]): string[] {
	return entries.flatMap((entry) => entry.tags ?? entry.data?.tags ?? []);
}

export function getUniqueTags(entries: Taggable[]): string[] {
	return [...new Set(getAllTags(entries))];
}

export function getUniqueTagsWithCount(entries: Taggable[]): [string, number][] {
	return [
		...getAllTags(entries).reduce(
			(acc, tag) => acc.set(tag, (acc.get(tag) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function getUniqueSeries(posts: CollectionEntry<"post">[]): string[] {
	return [...new Set(posts.flatMap((post) => (post.data.series ? [post.data.series] : [])))];
}

export function getSeriesPosts(
	posts: CollectionEntry<"post">[],
	series: string,
): CollectionEntry<"post">[] {
	return posts
		.filter((post) => post.data.series === series)
		.sort((a, b) => a.data.publishDate.getTime() - b.data.publishDate.getTime());
}
