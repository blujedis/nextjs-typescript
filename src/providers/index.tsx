/**
 * This file is called before 
 * rendering the first component.
 * 
 * @see pages/_app.tsx
 */

import { PropsWithChildren } from 'react';
import { Provider as StoreProvider } from './store';
import dynamic from 'next/dynamic';

const ProgressBar = dynamic(() => import('./progress'), { ssr: false });

function Preflight(props: PropsWithChildren<any>) {

  const { children } = props;

  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );

}

export default Preflight;