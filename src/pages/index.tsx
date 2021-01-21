import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { Hero } from '../components/sections/hero';
import { Work } from '../components/sections/work';
import { Footer } from '../components/sections/footer';
import { Achievements } from '../components/sections/achievements';
import { GitHubActivity } from '../components/sections/github-activity';
import { Post } from '../types/blog';
import getTableData from '../core/notion/getTableData';
import { fetchRepos, Repo } from '../core/github';
import { Project } from '../types/project';
import { getOpenGraphImage } from '../core/og-image';
import {
  BLOG_INDEX_ID,
  PROJECT_INDEX_ID,
} from '../core/notion/server-constants';
import { config } from '../../config';

interface AppProps {
  posts: Post[];
  projects: Project[];
  repos: {
    starredRepos: Repo[];
    contributedRepos: Repo[];
  };
}

export const getStaticProps: GetStaticProps<AppProps> = async () => {
  const [
    posts,
    projects,
    { contributedRepos, starredRepos },
  ] = await Promise.all([
    getTableData<Post>(BLOG_INDEX_ID),
    getTableData<Project>(PROJECT_INDEX_ID),

    fetchRepos(config.githubUsername, config.githubToken),
  ]);

  return {
    props: {
      posts: posts
        .filter((post) => post.published)
        .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date))),
      projects: projects.filter((p) => p.published),
      repos: {
        starredRepos,
        contributedRepos,
      },
    },
    revalidate: 10,
  };
};

const Home = ({ repos, projects }: AppProps) => (
  <>
    <NextSeo
      title={`${config.name} - ${config.subtitle}`}
      titleTemplate={'%s'}
      openGraph={{
        images: [getOpenGraphImage(config.name)],
      }}
      twitter={{
        handle: '@solirpa7',
        cardType: 'summary_large_image',
      }}
      description="Hey I'm Solirpa! I design and build digital products. Illustrating and film making are also my passion."
    />
    <Hero />
    <Work projects={projects} preview />
    <GitHubActivity {...repos} />
    <Footer />
  </>
);

export default Home;
