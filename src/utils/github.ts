const REPO_URL = "https://github.com/qq3045153794/qq3045153794.github.io";

export function githubEditUrl(collection: "posts" | "notes" | "reading", id: string): string {
	return `${REPO_URL}/edit/main/content/${collection}/${id}.md`;
}

export function githubHistoryUrl(collection: "posts" | "notes" | "reading", id: string): string {
	return `${REPO_URL}/commits/main/content/${collection}/${id}.md`;
}
