import { type CollectionEntry, getCollection } from "astro:content";
import { noteKindLabels, type NoteKind } from "@/utils/note";

export type ContentKind = "post" | "note";
export type ContentEntry = CollectionEntry<"post"> | CollectionEntry<"note">;

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

function isVisible(data: { draft: boolean; publishDate: Date }): boolean {
	if (!import.meta.env.PROD) return true;
	return !data.draft && data.publishDate.getTime() <= Date.now();
}

function normalizeEntry(kind: ContentKind, entry: ContentEntry): ContentItem {
	const data = entry.data;

	const noteData = kind === "note" ? (data as CollectionEntry<"note">["data"]) : null;
	const kindLabel = noteData ? noteKindLabels[noteData.kind as NoteKind] : "文章";

	return {
		kind,
		kindLabel,
		entry,
		id: entry.id,
		title: data.title,
		description: data.description ?? "",
		publishDate: data.publishDate,
		updatedDate: data.updatedDate,
		tags: data.tags ?? [],
		url: `/${kind === "post" ? "posts" : "notes"}/${entry.id}/`,
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

export async function getAllContent(): Promise<ContentItem[]> {
	const [posts, notes] = await Promise.all([getAllPosts(), getAllNotes()]);

	return [
		...posts.map((entry) => normalizeEntry("post", entry)),
		...notes.map((entry) => normalizeEntry("note", entry)),
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
