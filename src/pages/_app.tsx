
import "../assets/styles/tailwind.css";
import "../assets/styles/prism.css";
import "react-notion/src/styles.css";

import { AppProps, NextWebVitalsMetric } from 'next/app';
// this function will report web vitals

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default App;
