## NextJS Typescript - Addons
<a href="MAIN.md">&larr; MENU</a>
<br/><br/>

This directory contains simple but largely preconfigured libraries to make it easier to get up and running.

## IMPORTANT

When installing an addon keep in mind that due to the complex nature of Providers, the need to hydrate styles for example with **Evergreen UI** and **Styled-Components** some files will overwrite your current configuration when you enable them.

To combat this a backup is provided each time you install a new addon so you have a copy of what you were playing with up to that point. They are stored in **src/addons/_backups**. 

## Why Bother Then?

If some files may be overwritten from addon to addon on why bother then? The files overwritten are largely the <code>_app.tsx</code> and the <code>_document.tsx</code> files. These are related to UI libraries. Other addons do not overwrite these files. 

The idea here is to get a UI lib up and running easily, perhaps some auth with **Next-Auth** or perhaps **Firebase** and then you're off.

In short once you get going, see how it all wires up, or perhaps just switch around and play with each UI lib until you figure out a path, this makes it quite a bit easier particularly if you are new to **NextJs**.

Here's what's included below:

<table>
  <thead>
    <tr><th>Link</th><th>Description</th></tr>
  </thead>
  <tbody>
     <tr><td><a href="addons/ANTD.md" >Antd</a></td><td>Antd styling and components.</td></tr>
     <tr><td><a href="addons/BULMA.md" >Bulma</a></td><td>Bulma styling.</td></tr>
     <tr><td><a href="addons/FIREBASE.md" >Firebase</a></td><td>Firebase authentication and init.</td></tr>
     <tr><td><a href="addons/NEXTAUTH.md" >Next Auth</a></td><td>Next Auth authentication.</td></tr>
     <tr><td><a href="addons/CHAKRA.md" >Chakra UI</a></td><td>Chakra UI Components for React.</td></tr>
     <tr><td><a href="addons/EVERGREEN.md" >Evergreen UI</a></td><td>Evergreen UI Components for React.</td></tr>
     <tr><td><a href="addons/STYLED-COMPONENTS.md" >Styled Components</a></td><td>Create CSS Styled Components in React.</td></tr>
  </tbody>
</table>
