import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.trim().toLowerCase()).filter(Boolean))];
}

const titleSchema = z.string().min(1).max(80);
const tagSchema = z.array(z.string()).default([]).transform(removeDupsAndLowerCase);
const publishDateSchema = z.coerce.date();
const updatedDateSchema = z.coerce.date().optional();

const commonContentSchema = z.object({
	title: titleSchema,
	description: z.string().optional(),
	publishDate: publishDateSchema,
	updatedDate: updatedDateSchema,
	draft: z.boolean().default(false),
	tags: tagSchema,
	ogImage: z.string().optional(),
	canonicalURL: z.url().optional(),
});

const post = defineCollection({
	loader: glob({ base: "./content/posts", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		commonContentSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			pinned: z.boolean().default(false),
			series: z.string().min(1).optional(),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./content/notes", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		commonContentSchema.extend({
			kind: z
				.enum(["note", "til", "quote", "link", "idea", "reading", "video"])
				.default("note"),
			author: z.string().optional(),
			format: z.enum(["book", "paper", "article", "video", "course"]).optional(),
			status: z
				.enum(["want", "reading", "finished", "paused", "abandoned"])
				.optional(),
			rating: z.number().min(1).max(5).optional(),
			sourceURL: z.url().optional(),
			sourcePlatform: z.enum(["bilibili", "youtube", "other"]).optional(),
			sourceId: z.string().optional(),
			sourcePublishedAt: z.coerce.date().optional(),
			videoDuration: z.number().int().positive().optional(),
			transcriptModel: z.string().optional(),
			generatedBy: z.string().optional(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
		}),
});

const tag = defineCollection({
	loader: glob({ base: "./content/tags", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

export const collections = { post, note, tag };
