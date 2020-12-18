# Antd Addon

Adds Antd styling/components to your application.

## Install

```sh
$ yarn addon antd
```

## Set Jest Configuration in package.json

You may want to update your package.json file with the following jest configuration.

```json
"jest": {
  "transformIgnorePatterns": [
    "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"
  ]
}
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out an **Antd** example page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Antd Documentation](https://ant.design/components/overview/) and get started styling!!