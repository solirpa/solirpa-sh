import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { Work } from '../../components/sections/work';
import { Footer } from '../../components/sections/footer';
import { Nav } from '../../components/sections/nav';
import { Project } from '../../types/project';
import getTableData from '../../core/notion/getTableData';
import { config } from '../../../config';

interface AppProps {
  projects: Project[];
}

export const getStaticProps: GetStaticProps<AppProps> = async () => {
  const projects = await getTableData<Project>(
    '09ec2ae5-13d6-4618-a863-fac701891206',
    true
  );
  // console.log('projects', projects)

  return {
    props: {
      projects: projects.filter((post) => post.published),
    },
    revalidate: 10,
  };
};

const WorkPage: React.FC<AppProps> = ({ projects }: AppProps) => (
  <>
    <Nav />
    <NextSeo
      title={`Work ~ ${config.name}`}
      description="A collection of some of my work I've made in the past. Including web apps, landing page designs and videos."
    />
    {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
    <Work projects={projects} />
    <Footer />
  </>
);

export default WorkPage;
