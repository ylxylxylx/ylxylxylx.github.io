// scripts/generate-rss.ts
import { generateRssFeed } from '../utils/rss';

// 自执行函数
(async () => {
  try {
    await generateRssFeed();
    console.log('RSS Feed generated successfully!');
  } catch (error) {
    console.error('Failed to generate RSS Feed:', error);
    process.exit(1);
  }
})(); 