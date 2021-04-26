import React from 'react';
import { NotionRenderer, BlockMapType } from 'react-notion';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { Nav } from '../../components/sections/nav';
import { AuthorFooter } from '../../components/base/author-footer';
import { Post } from '../../types/blog';
import getTableData from '../../core/notion/getTableData';
import getPageData from '../../core/notion/getPageData';
import { dateFormatter } from '../../core/blog-helpers';
import { toNotionRendererBlockMap } from '../../core/notion/utils';
import { getOpenGraphImage } from '../../core/og-image';
import { BLOG_INDEX_ID } from '../../core/notion/server-constants';
import { config } from '../../../config';

interface PostProps {
  blocks: BlockMapType;
  post: Post;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getTableData<Post>(BLOG_INDEX_ID, true);

  return {
    paths: posts
      .filter((row) => process.env.NODE_ENV === 'development' || row.published)
      .map((row) => `/blog/${row.slug}`),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  PostProps,
  { slug: string }
> = async ({ params }) => {
  const slug = params?.slug;

  const table = await getTableData<Post>(BLOG_INDEX_ID, true);
  const post = table.find((t) => t.slug === slug);

  if (!post || (!post.published && process.env.NODE_ENV !== 'development')) {
    throw Error(`Failed to find post for slug: ${slug}`);
  }

  const blocks = await getPageData(post.id);

  return {
    props: {
      post,
      blocks,
    },
    revalidate: 10,
  };
};

const Blog = ({ post, blocks }) => {
  if (!post) return null;

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.preview}
        openGraph={{
          type: 'article',
          images: [getOpenGraphImage(post.title)],
          article: {
            publishedTime: new Date(post.date).toISOString(),
          },
        }}
        twitter={{
          handle: '@solirpa7',
          cardType: 'summary_large_image',
        }}
        canonical={`https://april-zhh.cn/blog/${post.slug}`}
        titleTemplate={`%s – ${config.name} / Blog`}
      />
      <Head>
        <meta name="date" content={new Date(post.date).toDateString()} />
      </Head>
      <Nav />

      <div className="px-4 mt-8 mb-12 md:mt-12 md:mb-18">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl sm:text-center">
          {post.title}
        </h1>
        <div className="text-gray-600 sm:text-center">
          <time dateTime={new Date(post.date).toISOString()}>
            {dateFormatter.format(new Date(post.date))}
          </time>
        </div>
      </div>
      <article className="flex-1 w-full max-w-3xl px-4 mx-auto">
        <NotionRenderer blockMap={toNotionRendererBlockMap(blocks)} />
        <div id="cusdis_thread"
          data-host="https://cusdis.april-zhh.cn"
          data-app-id="dcde78e0-e325-4787-ac74-261a7f9a8abf"
          data-page-id="{{ PAGE_ID }}"
          data-page-url="{{ PAGE_URL }}"
          data-page-title="{{ PAGE_TITLE }}"
        ></div>
        <script async defer src="https://cusdis.april-zhh.cn/js/cusdis.es.js"></script>
      </article>
      <div className="w-full max-w-3xl px-4 mx-auto my-8">
        <AuthorFooter />
      </div>
    </>
  );
};

export default Blog;
