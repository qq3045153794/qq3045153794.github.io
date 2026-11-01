# Hermes 工作规则

这个仓库是 Saber 的公开博客与学习笔记。内容可以公开，但发布必须可控。

## 内容目录

- `content/posts/`：完整文章、教程、项目复盘。
- `content/notes/`：短笔记、TIL、摘录、随想、想法。
- `content/reading/`：书籍、论文、文章、课程和视频的读书笔记。
- `content/tags/`：标签页的可选说明。
- `templates/`：新内容模板，不属于 Astro 内容集合。

## 必须遵守

1. 不直接修改或提交到 `main`。
2. 每次内容修改创建独立分支，分支名使用 `ai/<slug>`，并开 Pull Request。
3. 不自动合并 Pull Request，不自动发布。
4. 不编造来源、数据、评论、运行结果或书籍内容。
5. 不确定的信息标记为“待核实”，并说明需要什么证据。
6. 不在仓库中写入 token、密码、私钥、内网地址和个人敏感信息。
7. 不擅自修改 `astro.config.ts`、`.github/workflows/`、`package.json` 和内容 schema；这类修改必须由用户明确要求。
8. 新内容必须符合 `src/content.config.ts` 的 schema。
9. 写作遵循 `STYLE.md`。
10. 修改前先切到 `main` 并执行 `git pull --ff-only`；只允许推送 `ai/*` 分支。
11. 如果本机有 pnpm 和已安装依赖，运行 `pnpm check`、`pnpm build` 和 `pnpm check:links`；否则依赖 PR 上的 GitHub Actions，不得声称本地检查已通过。

## 内容分类

- 用户给出一个完整主题、需要论证和结构：优先生成 `post`。
- 用户只给出一条想法、摘录或短知识：优先生成 `note`。
- 用户给出书、论文、课程、文章或视频：优先生成 `reading`。
- 无法判断时，先创建 `note`，不要擅自扩写成长文。

## Pull Request 要求

PR 描述必须包含：

- 内容类型和新增/修改的文件
- 主要改动
- 尚未核实的事实
- 已执行的验证命令

如果构建失败，不要声称 PR 可发布。
