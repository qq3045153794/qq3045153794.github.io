import rss from "@astrojs/rss";
import { getAllNotes } from "@/data/content";
import { siteConfig } from "@/site.config";

export const GET = async () => {
	const notes = await getAllNotes();

	return rss({
		title: `${siteConfig.title} · 笔记`,
		description: "学习笔记、读书笔记、视频笔记和日常记录",
		site: import.meta.env.SITE,
		items: notes.map((note) => ({
			title: note.data.title,
			description: note.data.description,
			pubDate: note.data.publishDate,
			link: `notes/${note.id}/`,
		})),
	});
};
