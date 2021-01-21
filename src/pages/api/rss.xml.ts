import { NextApiRequest, NextApiResponse } from 'next';
import { generateRss } from '../../core/rss';
import { Post } from '../../types/blog';
import getTableData from '../../core/notion/getTableData';
import { BLOG_INDEX_ID } from '../../core/notion/server-constants';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const posts = await getTableData<Post>(BLOG_INDEX_ID);

  const filteredPosts = posts
    .filter((post) => process.env.NODE_ENV === 'development' || post.published)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'maxage=0, s-maxage=600');

  res.send(generateRss(filteredPosts));
};
