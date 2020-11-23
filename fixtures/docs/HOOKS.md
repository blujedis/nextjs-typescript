## NextJS Typescript - Hooks
<a href="MAIN.md">&larr; MENU</a>
<br/><br/>

The "Hooks" directory is where we define [React Hooks](https://reactjs.org/docs/hooks-intro.html) to simplify our Page logic.

<table>
  <thead>
    <tr><th>Link</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><a href="/src/hooks/swr.tsx" >roles.tsx</a></td><td>Extends <a href="https://github.com/vercel/swr">Nextjs' SWR </a> with some handy features.</td></tr>
     <tr><td><a href="/src/hooks/media.tsx" >media.tsx</a></td><td>Hook that provides helpful media query states.</td></tr>
          <tr><td><a href="/src/hooks/window.tsx" >window.tsx</a></td><td>Hook that gets current window size.</td></tr>
          <tr><td><a href="/src/hooks/sticky.tsx" >window.tsx</a></td><td>Helpful hook that triggers when to enable/disable a sticky/dropdown type header.</td></tr>
  </tbody>
</table>

### SWR Hook

The SWR hook just adds a few features to this great library to make it just a hair more useful. Here are some examples.

### Media Hook

Media hook is helpful with accessing media queries for detecting view port sizes. 