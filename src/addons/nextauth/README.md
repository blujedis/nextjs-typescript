# Next Auth Addon

Adds painless authentication to your NextJs application.

## Install

```sh
$ yarn add next-auth
```

```sh
$ yarn add @types/next-auth -D
```

## Env Configuration

Ensure you have updated your env or uncommented the NEXTAUTH section per your requirements.

You can find more information about configuring your environment for [Next Auth Here](https://next-auth.js.org/configuration/options)

For local configurations unless you've changed port etc should already be enabled in the **.env.local** file.

## Provider Configuration

**Providers are mounted at [src/providers/index.tsx](src/providers/index.tsx)**

**NOTE** Your Provider configuration may appear different depending on the
providers you've added/configured. 

```tsx
import { Provider as NextProvider } from 'next-auth/client';

function Preflight({ children, pageProps}: PropsWithChildren<IApp>) {

  const { session } = pageProps;

  return (
    <NextProvider session={session}>
      {children}
    </NextProvider>
  );

}

export default Preflight;
```

## Copy Api File

Lastly you'll need to copy the file at [src/addons/nextauth/api/[...nextauth].ts](src/addons/nextauth/api/[...nextauth].ts) to the main **api** folder for next.

The path you should end up with is [src/pages/api/auth/[...nextauth].ts](src/pages/api/auth/[...nextauth].ts).

## Enable the Addon

Go to your **package.json** file and and enable the addon.

```json
{
  "addons": [
    "nextauth"
  ]
}
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out your **Next Auth SignIn** page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Next Auth Documentation](https://next-auth.js.org/getting-started/introduction) and get started configuring your providers.