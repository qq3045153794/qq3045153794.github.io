# Saber 的技术笔记

技术文章和统一学习笔记的公开内容仓库。

- 站点：https://qq3045153794.github.io/
- 框架：Astro 7
- 内容：Markdown / MDX + Astro Content Collections
- 搜索：Pagefind
- 部署：GitHub Actions → GitHub Pages

## 内容结构

```text
content/
├── posts/      完整文章
├── notes/      学习笔记、读书笔记、视频笔记、TIL、摘录
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
- 文章写入 `content/posts`；所有笔记写入 `content/notes`，用 `kind` 区分普通笔记、读书笔记和视频笔记。
- 推送 `ai/*` 分支后，GitHub Actions 会自动创建 draft Pull Request。
- 不直接推送 `main`，不自动合并或发布。
