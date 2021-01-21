import { config } from '../../../config';

export const Footer: React.FC = () => {
  return (
    <div className="text-center text-gray-600 text-sm p-4 mt-8">
      © {new Date().getFullYear()} ${config.name} ·{' '}
      <a className="text-blue-500" href="https://github.com/solirpa/solirpa-sh">
        Source
      </a>
    </div>
  );
};
