# Antd Addon

Adds Antd styling/components to your application.

## Install

```sh
$ yarn add antd
```

```sh
$ yarn add @zeit/next-less @zeit/next-css next-compose-plugins -D
```

**Or simply run the install helper <code>yarn addon antd</code> to install.**

## Import Styles in _app.tsx

Globall CSS files can only be imported into [/src/pages/_app.tsx](/src/pages/_app.tsx) so head over there and then import
the following line.

You'll be able to configure your theme below.

```tsx
import 'antd/dist/antd.less';
```

## Defining Your Theme



## Set Jest Configuration in package.json

You may want to update your package.json file with the following jest configuration.

```json
"jest": {
  "transformIgnorePatterns": [
    "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"
  ]
}
```

## Enable the Addon

Go to your **package.json** file and and enable the addon.

```json
{
  "addons": [
    "antd"
  ]
}
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out an **Antd** example page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Antd Documentation](https://ant.design/components/overview/) and get started styling!!