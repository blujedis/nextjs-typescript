<div style="margin-bottom: 1rem;">
  <div style="display: inline-block; width: 49%;"><h2>NextJS Typescript</h2><span style="color: gray;">Pages</span></div>
  <div style="display: inline-block; text-align: right; width: 49%;"><a href="MAIN.md">&larr; MENU</a></div>
</div>

The "Pages" directory is the default directory provided by [NextJS](http://nextjs.org) where all pages are created. These pages result in auto generated routes.

You can read more about the [pages directory here](https://nextjs.org/docs/basic-features/pages).

### Examples (/pages/examples)

This directory contains useful examples, once you are done just move the directory out of the pages directory and they will no longer be routeable.

<table>
  <thead>
    <tr><th>Link</th><th>Description</th></tr>
  </thead>
  <tbody>
     <tr><td><a href="/src/pages/examples/secured.tsx" >secured.tsx</a></td><td>Example page using the <a href="/src/pages/with/withGuard.tsx">withGuard</a> helper that enables guarding a page preventing view if not authorized.</td></tr>
    <tr><td><a href="/src/pages/examples/roles.tsx" >roles.tsx</a></td><td>An exmaple page similar to the above but uses the Role Manager helper for authentication.</td></tr>
  </tbody>
</table>