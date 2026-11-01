# Saber 的技术笔记

文章、学习笔记和读书笔记的公开内容仓库。

- 站点：https://qq3045153794.github.io/
- 框架：Astro 7
- 内容：Markdown / MDX + Astro Content Collections
- 搜索：Pagefind
- 部署：GitHub Actions → GitHub Pages

## 内容结构

```text
content/
├── posts/      完整文章
├── notes/      短笔记、TIL、摘录
├── reading/    书籍、论文、文章、课程笔记
└── tags/       标签说明
```

## 本地开发

```bash
corepack pnpm install
corepack pnpm dev
```

构建与检查：

```bash
corepack pnpm check
corepack pnpm build
corepack pnpm postbuild
corepack pnpm check:links
```

## 新建内容

```bash
corepack pnpm new:post my-article-slug
corepack pnpm new:note my-note-slug
corepack pnpm new:reading book-slug
```

新文件默认 `draft: true`，完成后再改为 `false`。

## 发布状态

- `draft: true`：不进入生产站点。
- `publishDate` 晚于当前时间：不进入生产站点。
- 合并到 `main` 后，GitHub Actions 自动构建并部署。

## 写作与协作

- 写作规范：`STYLE.md`
- Hermes 规则：`AGENTS.md`
- 内容模板：`templates/`

Hermes 只能通过分支和 Pull Request 修改内容，不直接发布到 `main`。

## 主题来源

站点基于 MIT License 的 [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) 修改。


## Hermes 协同接口

服务器工作目录：`/home/admin/blog`

Hermes 应遵守：

- 从最新的 `main` 创建 `ai/<slug>` 分支。
- 按内容类型写入 `content/posts`、`content/notes` 或 `content/reading`。
- 推送 `ai/*` 分支后，GitHub Actions 会自动创建 draft Pull Request。
- 不直接推送 `main`，不自动合并或发布。
