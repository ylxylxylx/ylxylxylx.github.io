# RSS 订阅功能实现

本文档详细记录了为个人博客网站添加 RSS 订阅功能的完整实现过程。

## 功能概述

RSS (Really Simple Syndication) 是一种用于发布经常更新的网站内容的标准，如博客文章、新闻等。本功能允许访问者通过 RSS 阅读器订阅博客内容，从而及时获取网站的最新更新。

实现的 RSS 功能支持以下格式：

- RSS 2.0 (rss.xml)
- Atom (atom.xml)
- JSON Feed (feed.json)

## 实现步骤

### 1. 安装必要依赖

首先，我们需要安装用于生成 RSS 的库：

```bash
pnpm add feed
pnpm add -D tsx
```

- `feed`: 用于生成各种格式的 Feed 内容
- `tsx`: 用于执行 TypeScript 脚本

### 2. 创建 RSS 生成工具

在 `utils/rss.ts` 中实现 RSS 生成功能：

```typescript
import { Feed } from "feed";
import { getAllPostList } from "./post";
import fs from "fs";
import path from "path";

export async function generateRssFeed() {
  const posts = await getAllPostList();
  const siteURL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://chennlang.github.io";
  const siteTitle = process.env.NEXT_PUBLIC_TITLE || "Alang' Blog";
  const siteDescription =
    process.env.NEXT_PUBLIC_SUB_TITLE || "做自己的追风者~";
  const date = new Date();

  const feed = new Feed({
    title: siteTitle,
    description: siteDescription,
    id: siteURL,
    link: siteURL,
    language: "zh-CN",
    image: `${siteURL}/favicon.ico`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, ${siteTitle}`,
    updated: date,
    feedLinks: {
      rss2: `${siteURL}/rss.xml`,
      json: `${siteURL}/feed.json`,
      atom: `${siteURL}/atom.xml`,
    },
    author: {
      name: siteTitle,
      email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "",
      link: siteURL,
    },
  });

  posts.forEach((post) => {
    const url = `${siteURL}/post/${post.id}/`;
    feed.addItem({
      title: post.frontmatter.title || "",
      id: url,
      link: url,
      description: post.frontmatter.description || "",
      content: post.contentHtml,
      author: [
        {
          name: post.frontmatter.author || siteTitle,
          link: siteURL,
        },
      ],
      date: new Date(post.frontmatter.date),
      image: post.frontmatter.cover
        ? `${siteURL}${post.frontmatter.cover}`
        : undefined,
    });
  });

  const publicDir = path.join(process.cwd(), "public");
  fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, "rss.xml"), feed.rss2());
  fs.writeFileSync(path.join(publicDir, "atom.xml"), feed.atom1());
  fs.writeFileSync(path.join(publicDir, "feed.json"), feed.json1());
}
```

这个函数会：

- 获取所有博客文章
- 创建 Feed 对象并配置基本信息
- 将每篇文章添加到 Feed 中
- 生成三种格式的订阅文件并保存到 public 目录

### 3. 创建 RSS 生成脚本

创建 `scripts/generate-rss.ts` 文件：

```typescript
// scripts/generate-rss.ts
import { generateRssFeed } from "../utils/rss";

// 自执行函数
(async () => {
  try {
    await generateRssFeed();
    console.log("RSS Feed generated successfully!");
  } catch (error) {
    console.error("Failed to generate RSS Feed:", error);
    process.exit(1);
  }
})();
```

### 4. 更新 package.json 添加脚本命令

在 `package.json` 的 `scripts` 部分添加：

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "generate-rss": "tsx scripts/generate-rss.ts",
  "build:rss": "pnpm generate-rss && next build"
}
```

### 5. 添加环境变量

在 `.env` 文件中添加：

```
NEXT_PUBLIC_SITE_URL="https://chennlang.github.io"
NEXT_PUBLIC_AUTHOR_EMAIL=""
```

### 6. 在网站导航中添加 RSS 链接

修改 `components/header.tsx`，添加 RSS 链接和图标：

```jsx
<Link
  className="text-gray-500 flex items-center"
  href="/rss.xml"
  target="_blank"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 mr-1"
  >
    <path
      fillRule="evenodd"
      d="M3.75 4.5a.75.75 0 0 1 .75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75C18 11.708 12.292 6 5.25 6H4.5a.75.75 0 0 1-.75-.75V4.5Zm0 6a.75.75 0 0 1 .75-.75h.75a8.25 8.25 0 0 1 8.25 8.25v.75a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75v-.75a6 6 0 0 0-6-6H4.5a.75.75 0 0 1-.75-.75v-.75Zm0 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      clipRule="evenodd"
    />
  </svg>
  RSS
</Link>
```

## 使用说明

### 站点管理者使用说明

#### 生成 RSS 文件

在开发过程中手动生成 RSS 文件：

```bash
pnpm generate-rss
```

在构建网站时自动生成 RSS 文件并构建：

```bash
pnpm build:rss
```

#### 生成的 RSS 文件

运行上述命令后，将在 `public` 目录下生成以下文件：

- `public/rss.xml` - RSS 2.0 格式
- `public/atom.xml` - Atom 格式
- `public/feed.json` - JSON Feed 格式

这些文件会在网站构建时作为静态资源发布。

### 访问者使用说明

访问者可以通过以下方式订阅博客：

1. 点击网站导航栏中的 "RSS" 链接，获取 RSS 订阅源
2. 直接访问以下 URL 获取 RSS 订阅源：

   - `https://chennlang.github.io/rss.xml` (RSS 2.0)
   - `https://chennlang.github.io/atom.xml` (Atom)
   - `https://chennlang.github.io/feed.json` (JSON Feed)

3. 将这些 URL 添加到他们喜欢的 RSS 阅读器（如 Feedly、Inoreader、NetNewsWire 等）

## 后续优化建议

1. **添加 RSS 元标签**：在 `<head>` 中添加 RSS 发现链接

   ```html
   <link
     rel="alternate"
     type="application/rss+xml"
     title="RSS"
     href="/rss.xml"
   />
   <link
     rel="alternate"
     type="application/atom+xml"
     title="Atom"
     href="/atom.xml"
   />
   <link
     rel="alternate"
     type="application/json"
     title="JSON Feed"
     href="/feed.json"
   />
   ```

2. **丰富 RSS 内容**：可以考虑添加更多元数据，如分类、标签等

3. **分类订阅**：实现按分类订阅功能，允许访问者只订阅他们感兴趣的特定类型内容

4. **RSS 订阅引导页**：创建专门的订阅引导页面，介绍如何使用不同的 RSS 阅读器订阅博客

## 总结

通过以上步骤，我们已经成功为博客网站添加了 RSS 订阅功能，支持多种 Feed 格式，方便访问者及时获取博客更新。这不仅增强了用户体验，也有助于提高网站的可访问性和传播性。
