import type { Element } from "hast";
import katex from "katex";
import { defineHastPlugin } from "satteri";

function classesOf(node: Element): string[] {
	const value = node.properties?.className;
	if (Array.isArray(value)) return value.map(String);
	if (value != null) return String(value).split(/\s+/).filter(Boolean);
	return [];
}

function renderMath(tex: string, displayMode: boolean): string {
	return katex.renderToString(tex, {
		displayMode,
		throwOnError: false,
		strict: "warn",
		output: "htmlAndMathml",
	});
}

export const satteriKatexPlugin = defineHastPlugin({
	name: "katex-math",
	element: [
		{
			filter: ["code"],
			visit(node, ctx) {
				const classes = classesOf(node);
				if (!classes.includes("math-inline")) return;
				const tex = ctx.textContent(node).trim();
				if (!tex) return;
				ctx.replaceNode(node, { type: "raw", value: renderMath(tex, false) });
			},
		},
		{
			filter: ["pre"],
			visit(node, ctx) {
				const code = node.children.find(
					(child): child is Element => child.type === "element" && child.tagName === "code",
				);
				if (!code || !classesOf(code).includes("math-display")) return;
				const tex = ctx.textContent(code).trim();
				if (!tex) return;
				ctx.replaceNode(node, { type: "raw", value: renderMath(tex, true) });
			},
		},
	],
});
