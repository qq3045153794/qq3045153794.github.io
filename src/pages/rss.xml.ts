import rss from "@astrojs/rss";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";

export const GET = async () => {
	const posts = await getAllPosts();

	return rss({
		title: `${siteConfig.title} · 文章`,
		description: "Saber 的技术文章、教程和项目复盘",
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `posts/${post.id}/`,
		})),
	});
};
