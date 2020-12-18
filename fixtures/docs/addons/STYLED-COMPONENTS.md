# Styled Components Addon

Adds Styled Components to your Application.

## Install

```sh
$ yarn addon styled-components
```

## Configure Provider

Visit **src/providers/index.tsx** and ensure your configuration is similar to the following:

```tsx
import { PropsWithChildren } from 'react';
import { Provider as StoreProvider } from './store';
import dynamic from 'next/dynamic';
import { IApp } from 'types';
import { ThemeProvider, theme } from 'addons/styled-components/styles/theme';

const ProgressBar = dynamic(() => import('./progress'), { ssr: false });

function Preflight(props: PropsWithChildren<IApp>) {

  const { children } = props;

  return (
    <ThemeProvider value={theme}>
    <StoreProvider>
      <ProgressBar />
      {children}
    </StoreProvider>
    </ThemeProvider> 
  );

}

export default Preflight;
```

## Configure Custom Document Page

Although it should have been copied in for you, for completeness it should look like the following:

```tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document<{ initialState: any; styleTags: any }> {

  static async getInitialProps(ctx: DocumentContext) {

    const origRenderPage = ctx.renderPage;
    const sheet = new ServerStyleSheet();

    try {
      ctx.renderPage = () =>
      origRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }

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
        <link rel="stylesheet" type="text/css" href="/css/normalize.css" />
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
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out a **Styled-Components** example page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Styled Components Documentation](https://styled-components.com/) and get started styling!!