/**
 * This file is called before 
 * rendering the first component.
 * 
 * @see pages/_app.tsx
 */

import { PropsWithChildren } from 'react';
import { Provider as StoreProvider } from './store';
import dynamic from 'next/dynamic';
import { IApp } from 'types';

// import { Provider as NextProvider } from 'next-auth/client';

const ProgressBar = dynamic(() => import('./progress'), { ssr: false });

function Preflight(props: PropsWithChildren<IApp>) {

  const { children, pageProps } = props;
  const { session } = pageProps;

  return (
    <StoreProvider>
      <ProgressBar />
      {/* <NextProvider session={session}> */}
      {children}
      {/* </NextProvider> */}
    </StoreProvider>
  );

}

export default Preflight;
