import Document, { Html, Head, Main, NextScript } from 'next/document'

import { trackingCode } from '../core/gtag'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>{trackingCode}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
