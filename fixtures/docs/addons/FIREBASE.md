# Firebase Addon

Adds firebase authentication to your application.

## Install

```sh
$ yarn add firebase firebase-admin js-cookie react-firebaseui
```

```sh
$ yarn add @types/js-cookie -D
```

**Or simply run the install helper <code>yarn addon firebase</code> to install.**

## Enable the Addon

Go to your **package.json** file and and enable the addon.

```json
{
  "addons": [
    "firebase"
  ]
}
```

## The Good Stuff

After restarting with <code>yard dev<code> you should be able to head over to the examples page and try out your **Firebase Auth SignIn** page.

See [http://localhost:3000/examples](http://localhost:3000/examples)

## What to do Next?

Head over to the full [Firebase Documentation](https://firebase.google.com/docs) and get started configuring your application.