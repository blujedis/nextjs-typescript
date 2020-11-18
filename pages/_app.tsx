import Providers from 'lib/providers';
import { IApp } from 'types';

// import App from 'next/app'
function App(props: IApp) {
  const { Component, pageProps, err, router } = props;
  return (
    <Providers>
      <Component err={err} router={router} {...pageProps} />
    </Providers>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//   return { ...appProps };
// };

export default App;