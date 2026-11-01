---
title: "从这里开始：我的公开学习档案"
description: "这个站点用来长期保存技术文章、学习笔记和读书笔记，也用来验证 Hermes 协同写作流程。"
publishDate: 2026-11-01
tags: ["astro", "github", "hermes"]
series: "个人博客建设"
pinned: true
draft: false
---

## 为什么重新做一个博客

我需要一个可以长期维护的地方，保存三类内容：

- **文章**：完整的技术教程、问题分析和项目复盘。
- **笔记**：TIL、摘录、随想，以及还没有长成文章的想法。
- **读书笔记**：书籍、论文、文章和课程里值得留下来的内容。

这些内容全部使用 Markdown 保存，放在同一个 GitHub 仓库中。站点只是内容的展示层，不是内容本身。

## 技术结构

当前站点使用 Astro 构建：

```ts
const collections = ["posts", "notes", "reading"] as const;
```

每一类内容都有自己的 schema、列表页和 RSS。标签、搜索和归档会跨类型聚合，所以短笔记和长文章可以出现在同一个主题下。

## 数学与代码

行内公式示例：$E = mc^2$。

显示公式：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

代码块、提示块和脚注都可以正常使用。[^1]

:::note
这是一条提示块。适合记录前提、注意事项和阅读建议。
:::

## 发布流程

内容修改不会直接发布到 `main`。写作流程是：

1. 在本地或 Telegram 中记录想法。
2. Hermes 创建 `ai/<slug>` 分支。
3. 修改内容并提交 Pull Request。
4. 人工审阅、合并。
5. GitHub Actions 构建并部署。

[^1]: 这是一条脚注示例。
