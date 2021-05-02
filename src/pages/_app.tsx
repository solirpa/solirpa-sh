import '../assets/styles/tailwind.css';
import '../assets/styles/prism.css';
import 'react-notion/src/styles.css';

import { AppProps, NextWebVitalsMetric } from 'next/app';

import { Footer } from '../components/sections/footer';
import { webVitals, trackPageChanges } from '../core/gtag'
import React, { useEffect } from 'react'

// this function will report web vitals
export function reportWebVitals(metric: NextWebVitalsMetric) {
  webVitals(metric)
}

// this function will report web vitals

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    trackPageChanges() // this will report route changes
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default App;
