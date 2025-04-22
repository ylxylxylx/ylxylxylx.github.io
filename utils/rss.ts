import { Feed } from 'feed';
import { getAllPostList } from './post';
import fs from 'fs';
import path from 'path';

export async function generateRssFeed() {
  const posts = await getAllPostList();
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chennlang.github.io';
  const siteTitle = process.env.NEXT_PUBLIC_TITLE || 'Alang\' Blog';
  const siteDescription = process.env.NEXT_PUBLIC_SUB_TITLE || '做自己的追风者~';
  const date = new Date();

  const feed = new Feed({
    title: siteTitle,
    description: siteDescription,
    id: siteURL,
    link: siteURL,
    language: 'zh-CN',
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
      email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || '',
      link: siteURL,
    },
  });

  posts.forEach((post) => {
    const url = `${siteURL}/post/${post.id}/`;
    feed.addItem({
      title: post.frontmatter.title || '',
      id: url,
      link: url,
      description: post.frontmatter.description || '',
      content: post.contentHtml,
      author: [
        {
          name: post.frontmatter.author || siteTitle,
          link: siteURL,
        },
      ],
      date: new Date(post.frontmatter.date),
      image: post.frontmatter.cover ? `${siteURL}${post.frontmatter.cover}` : undefined,
    });
  });

  const publicDir = path.join(process.cwd(), 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2());
  fs.writeFileSync(path.join(publicDir, 'atom.xml'), feed.atom1());
  fs.writeFileSync(path.join(publicDir, 'feed.json'), feed.json1());
} 