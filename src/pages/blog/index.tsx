import { NextSeo } from "next-seo";
import { GetStaticProps } from "next";
import { Blog } from "../../components/sections/blog";
import { Footer } from "../../components/sections/footer";
import { Post } from "../../types/blog";
import getTableData from "../../core/notion/getTableData";
import { Nav } from "../../components/sections/nav";
import { config } from "../../../config";
import { BLOG_INDEX_ID } from "../../core/notion/server-constants";

interface BlogProps {
  posts: Post[];
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {

  const posts = await getTableData<Post>(BLOG_INDEX_ID, true);
  const filteredPosts = posts
    .filter((post) => process.env.NODE_ENV === "development" || post.published)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));

  return {
    props: {
      posts: filteredPosts,
    },
    revalidate: 10,
  };
};

const BlogPage: React.FC<BlogProps> = ({ posts }: BlogProps) => (
  <>
    <Nav />
    <NextSeo
      title={`Blog ~ ${config.name}}`}
      description="My personal blog about design, coding and everything else that is on my mind."
    />
    <div className="flex-1">
      <Blog posts={posts} />
    </div>
    <Footer />
  </>
);

export default BlogPage;
