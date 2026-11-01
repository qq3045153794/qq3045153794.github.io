import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";
import NotoSansSC from "@/assets/NotoSansSC-Regular.otf";
import { getAllNotes, getAllPosts } from "@/data/content";
import { getFormattedDate } from "@/utils/date";
import { readCache, writeToCache } from "./_cacheUtil";
import { ogMarkup } from "./_ogMarkup";

const ogOptions: SatoriOptions = {
	fonts: [
		{
			data: Buffer.from(NotoSansSC),
			name: "Noto Sans SC",
			style: "normal",
			weight: 400,
		},
		{
			data: Buffer.from(NotoSansSC),
			name: "Noto Sans SC",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { pubDate, title } = context.props as Props;

	let pngBuffer = readCache(title, pubDate);
	if (!pngBuffer) {
		const postDate = getFormattedDate(pubDate, {
			month: "long",
			weekday: "long",
		});
		const svg = await satori(ogMarkup(title, postDate), ogOptions);
		pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
		writeToCache(title, pubDate, pngBuffer);
	}

	return new Response(new Uint8Array(pngBuffer), {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getStaticPaths() {
	const [posts, notes] = await Promise.all([getAllPosts(), getAllNotes()]);

	return [
		...posts
			.filter(({ data }) => !data.ogImage)
			.map((post) => ({
				params: { slug: `posts/${post.id}` },
				props: {
					pubDate: post.data.updatedDate ?? post.data.publishDate,
					title: post.data.title,
				},
			})),
		...notes
			.filter(
				({ data }) =>
					!data.ogImage && (data.kind === "reading" || data.kind === "video"),
			)
			.map((note) => ({
				params: { slug: `notes/${note.id}` },
				props: {
					pubDate: note.data.updatedDate ?? note.data.publishDate,
					title: note.data.title,
				},
			})),
	];
}
