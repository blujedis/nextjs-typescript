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

  const { children } = props;

  return (
    <StoreProvider>
      <ProgressBar />
      {children}
    </StoreProvider >
  );

}

export default Preflight;
