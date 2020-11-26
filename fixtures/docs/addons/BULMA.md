# Bulma Addon

Adds Bulma styling to your application.

## Install

```sh
$ yarn add bulma
```

```sh
$ yarn add node-sass@4.14 -D
```

**Or simply run the install helper <code>yarn addon bulma</code> to install.**

## Import Styles in _app.tsx

Globall CSS files can only be imported into [/src/pages/_app.tsx](/src/pages/_app.tsx) so head over there and then import
the following line.

```tsx
import 'addons/bulma/styles/index.scss';
```

## Enable the Addon

Go to your **package.json** file and and enable the addon.

```json
{
  "addons": [
    "bulma"
  ]
}
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out a **Bulma** example page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Bulma Documentation](https://bulma.io/documentation/) and get started styling!!