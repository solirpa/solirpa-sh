import { GetServerSideProps } from 'next';
import { FC } from 'react';
import getTableData from '../core/notion/getTableData';
import { BLOG_INDEX_ID } from '../core/notion/server-constants';
import { generateRss } from '../core/rss';
import { Post } from '../types/blog';

const Feed: FC = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (res) {
    const posts = await getTableData<Post>(BLOG_INDEX_ID);

    const filteredPosts = posts
      .filter((post) => process.env.NODE_ENV === 'development' || post.published)
      .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
   
    res.setHeader('Content-Type', 'text/xml');
    res.write(generateRss(filteredPosts));
    res.end();
  }

  return {
    props: {}
  }
}

export default Feed