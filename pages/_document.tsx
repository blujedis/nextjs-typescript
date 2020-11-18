import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document<{ initialState: any; }> {

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {

    const { initialState } = this.props;
    const SSR_KEY = '__RESTASH_APP_STATE__';

    return (
      <Html>
        <Head />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest"></link>
        <link rel="stylesheet" type="text/css" href="/css/vendor/nprogress.css" />
        <script dangerouslySetInnerHTML={{ __html: `window.${SSR_KEY} = ${initialState};` }} />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );

  }

}

export default MyDocument;