export const readingStatusLabels = {
	want: "想读",
	reading: "在读",
	finished: "读完",
	paused: "暂停",
	abandoned: "弃读",
} as const;

export const readingFormatLabels = {
	book: "书籍",
	paper: "论文",
	article: "文章",
	video: "视频",
	course: "课程",
} as const;

export function formatRating(rating: number | undefined): string {
	return rating ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)}` : "未评分";
}
