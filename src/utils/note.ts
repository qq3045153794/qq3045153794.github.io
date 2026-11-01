export const noteKindLabels = {
	note: "笔记",
	til: "TIL",
	quote: "摘录",
	link: "链接",
	idea: "想法",
	reading: "读书笔记",
	video: "视频笔记",
} as const;

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

export type NoteKind = keyof typeof noteKindLabels;
export type ReadingStatus = keyof typeof readingStatusLabels;
export type ReadingFormat = keyof typeof readingFormatLabels;

export function formatRating(rating: number | undefined): string {
	return rating ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)}` : "未评分";
}
