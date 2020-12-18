# Evergreen Components Addon

Adds Evergreen UI components and styles to your application.

## Install

```sh
$ yarn addon evergreen
```

## Configure Provider

Visit **src/providers/index.tsx** and ensure your configuration is similar to the following:

```tsx
import { PropsWithChildren } from 'react';
import { Provider as StoreProvider } from './store';
import dynamic from 'next/dynamic';
import { IApp } from 'types';
import  { ThemeProvider, theme } from 'addons/evergreen/styles/theme';

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
import { extractStyles } from 'evergreen-ui'

class MyDocument extends Document<{ initialState: any; css: string, hydrationScript: JSX.Element; }> {

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const { css, hydrationScript } = extractStyles();
    return { ...initialProps, css, hydrationScript };
  }

  render() {

    const { initialState, css, hydrationScript } = this.props;
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
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script dangerouslySetInnerHTML={{ __html: `window.${SSR_KEY} = ${initialState};` }} />
        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    );

  }

}

export default MyDocument;
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out a **Evergreen UI** example page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Evergreen UI Documentation](https://evergreen.segment.com/) and get started styling!!