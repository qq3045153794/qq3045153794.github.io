import rss from "@astrojs/rss";
import { getAllReadings } from "@/data/content";
import { siteConfig } from "@/site.config";

export const GET = async () => {
	const readings = await getAllReadings();

	return rss({
		title: `${siteConfig.title} · 读书笔记`,
		description: "书籍、论文、文章和课程的学习笔记",
		site: import.meta.env.SITE,
		items: readings.map((reading) => ({
			title: reading.data.title,
			description: reading.data.description,
			pubDate: reading.data.publishDate,
			link: `reading/${reading.id}/`,
		})),
	});
};
