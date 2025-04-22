# 一个简约而优雅的个人博客`模板`

一个基于 Next.js 15 开发的简约而优雅的个人`博客模板`，通过`Github Page`自动化构建部署。

### PC 端效果

**About**
![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/202502211036042.png)

**Post List**
![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/202502211035781.png)

### H5 端效果

<div style="display: flex; justify-content: space-between; gap: 1em;">
    <img src="https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/202502211038133.png" alt="图片1" width="33%"  style="width: 33%;">
    <img src="https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/202502211041257.png" alt="图片1" width="33%"  style="width: 33%;">
    <img src="https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/202502211040801.png" alt="图片2" width="33%" style="width: 33%;">
</div>

## 🚀 快速开始

1. 使用此项目作为模版创建一个新项目

- 点击仓库右上角 `Use This template` -> `create new repository`。
- 填写 Repository name: `[use name].github.io`,切记一定要这个格式。
- 仓库公开

2. 选择创建好的仓库，去配置 [giscus](https://giscus.app/zh-CN)。

3. 将 giscus 生成好的配置填入 `/components/comments.tsx` 文件中。

4. 根据自己的需求修改环境变量 .env

```
NEXT_PUBLIC_TITLE="Alang' Blog"
NEXT_PUBLIC_SUB_TITLE="做自己的追风者~"
NEXT_PUBLIC_LINKS=[{ "label": "Github", "src": "https://github.com/chennlang"},{ "label": "JueJin", "src": "https://juejin.cn/user/3913917126162429"}]

```

## 📝 写作指南

在 `posts` 目录下创建 `.md` 文件即可开始写作（记得先删除作者原有的文章）。每篇文章`必须包含 frontmatter`头部信息：

```markdown
---
title: "文章标题"
date: "2024-03-20"
categories: "英文分类"
summary: "文章摘要，会显示在列表页面"
---

这里是文章正文内容...
```

### Frontmatter 字段说明

| 字段       | 说明     | 是否必填 | 类型                |
| ---------- | -------- | -------- | ------------------- |
| title      | 文章标题 | 是       | string              |
| date       | 发布日期 | 是       | string (YYYY-MM-DD) |
| categories | 文章分类 | 否       | string 或 string[]  |
| summary    | 文章摘要 | 是       | string              |

## 🛠️ 自定义主题

修改主题相关的样式文件：

- `app/globals.css`: 全局样式
- `app/post/[id]/post.css`: 文章页面样式
- `tailwind.config.js`: Tailwind 配置

## 发布

### 默认部署

当你 push 到 github 后，就会触发 github page 自动构建并部署到 Github 服务器上，访问 `https://[user name].github.io/` 即可看到更新。

### 其他方式部署

构建静态页面：

```bash
pnpm i
npm run build
```

构建完成后，`out` 目录包含所有静态文件，可以部署到任何静态托管服务。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License
