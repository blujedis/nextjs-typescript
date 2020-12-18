# Chakra Components Addon

Adds Chakra UI components and styles to your application.

## Install

```sh
$ yarn addon chakra
```

## Configure Provider

Visit **src/providers/index.tsx** and ensure your configuration is similar to the following:

```tsx
import { PropsWithChildren } from 'react';
import { Provider as StoreProvider } from './store';
import dynamic from 'next/dynamic';
import { IApp } from 'types';
import  { ChakraProvider, theme } from 'addons/chakra/styles/theme';

const ProgressBar = dynamic(() => import('./progress'), { ssr: false });

function Preflight(props: PropsWithChildren<IApp>) {

  const { children } = props;

  return (
    <ChakraProvider value={theme}>
      <StoreProvider>
        <ProgressBar />
        {children}
      </StoreProvider>
    </ChakraProvider> 
  );

}

export default Preflight;
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out a **Evergreen UI** example page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Evergreen UI Documentation](https://evergreen.segment.com/) and get started styling!!