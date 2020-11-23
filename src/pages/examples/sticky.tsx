import Layout from 'layout/sticky';
import Link from 'next/link';
import { PageProps } from 'types';

const StickyNav = (props: PageProps) => {

  return (
    <Layout title="Sticky Header Example" {...props} >

      <div style={{ padding: '1rem 2rem 2rem' }}>

        <p><Link href="/examples">Return to Examples</Link></p>

        <h2>
          How to Use
       </h2>

        <p style={{ backgroundColor: '#ff726f', padding: '.75rem', color: '#fff' }}>
          First take a look at the <strong>sticky.tsx</strong> Layout in <strong>layout</strong> directory.
       </p>

        <p>
          Sticky headers are a combo of watching the window scrollY and then subsequently triggering styles via state. The majority of the <strong>style jsx</strong> in the sticky.tsx layout file are just simple styling but you'll likely want to play with padding in the <strong>main</strong> element when it is in the sticky state. This will remove some of the jumpiness. Basically it really depends on the size of your full header and sticky header. You could set both headers to fixed with padding for you main too. Lots of options.
       </p>

        <h2>
          Wiring up Sticky Header Hook
       </h2>

        <p style={{ backgroundColor: '#ff726f', padding: '.75rem', color: '#fff' }}>
          Again check the source as the following is intentionally abbreviated.
       </p>

        <p>The below uses <strong>style jsx</strong> but you can use stylesheets as well if you wish. The hook exposes to properties the <strong>ref</strong> for your parent or wrapper element and a state flag indicating if sticky should show.Again the below styles are abbreviated. <strong>(see source layout for animation keyframes)</strong></p>

        <pre>{`
const { isSticky, parent } = useSticky();

return (
  <LayoutWithRef {...props} ref={parent}>

    <header className={isSticky ? 'sticky' : ''}>
      <img src="/images/logo.png" height={40} />
    </header>

    <main className={isSticky ? 'sticky' : ''}>
      // your content here.
    </main>

    <style jsx>{\`

    header {
      height: 75px;
      background: #efefef;
    }

    header.sticky {
      z-index: 10;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      animation: moveDown 0.5s ease-in-out;
      height: 50px; 
    }

    header.sticky img {
      animation: rotate 0.7s ease-in-out 0.5s;
    }

    img {
      vertical-align: middle;
    }

    main.sticky {
      padding-top: 50px; 
    }

    \`}</style>

  </LayoutWithRef>
);       
       `}</pre>

        <h4>
          Below is just some ipsum to make the page scroll...
       </h4>

        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et lectus sed nibh commodo dignissim. Donec pulvinar sodales sapien, et sagittis leo lacinia eget. Donec id tristique arcu. Aenean commodo sodales feugiat. In hac habitasse platea dictumst. Vestibulum vehicula tempus tortor, tempus malesuada nibh tincidunt eu. Nam sagittis magna dignissim, vulputate augue at, mollis dui. Aenean odio sapien, vehicula eget tristique eu, blandit et eros. Phasellus in magna sed odio mattis aliquam eget eu nulla. Nam sed dui sit amet dolor rutrum hendrerit. Nunc pulvinar lectus quis odio sollicitudin, ut eleifend lacus ullamcorper. Nam id nulla velit. Sed condimentum neque urna, sit amet aliquet metus condimentum sed. Proin eu ligula id ipsum rhoncus commodo. Etiam tincidunt est eget pretium aliquam. Donec et sapien nec lacus ultrices ornare.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et lectus sed nibh commodo dignissim. Donec pulvinar sodales sapien, et sagittis leo lacinia eget. Donec id tristique arcu. Aenean commodo sodales feugiat. In hac habitasse platea dictumst. Vestibulum vehicula tempus tortor, tempus malesuada nibh tincidunt eu. Nam sagittis magna dignissim, vulputate augue at, mollis dui. Aenean odio sapien, vehicula eget tristique eu, blandit et eros. Phasellus in magna sed odio mattis aliquam eget eu nulla. Nam sed dui sit amet dolor rutrum hendrerit. Nunc pulvinar lectus quis odio sollicitudin, ut eleifend lacus ullamcorper. Nam id nulla velit. Sed condimentum neque urna, sit amet aliquet metus condimentum sed. Proin eu ligula id ipsum rhoncus commodo. Etiam tincidunt est eget pretium aliquam. Donec et sapien nec lacus ultrices ornare.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et lectus sed nibh commodo dignissim. Donec pulvinar sodales sapien, et sagittis leo lacinia eget. Donec id tristique arcu. Aenean commodo sodales feugiat. In hac habitasse platea dictumst. Vestibulum vehicula tempus tortor, tempus malesuada nibh tincidunt eu. Nam sagittis magna dignissim, vulputate augue at, mollis dui. Aenean odio sapien, vehicula eget tristique eu, blandit et eros. Phasellus in magna sed odio mattis aliquam eget eu nulla. Nam sed dui sit amet dolor rutrum hendrerit. Nunc pulvinar lectus quis odio sollicitudin, ut eleifend lacus ullamcorper. Nam id nulla velit. Sed condimentum neque urna, sit amet aliquet metus condimentum sed. Proin eu ligula id ipsum rhoncus commodo. Etiam tincidunt est eget pretium aliquam. Donec et sapien nec lacus ultrices ornare.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et lectus sed nibh commodo dignissim. Donec pulvinar sodales sapien, et sagittis leo lacinia eget. Donec id tristique arcu. Aenean commodo sodales feugiat. In hac habitasse platea dictumst. Vestibulum vehicula tempus tortor, tempus malesuada nibh tincidunt eu. Nam sagittis magna dignissim, vulputate augue at, mollis dui. Aenean odio sapien, vehicula eget tristique eu, blandit et eros. Phasellus in magna sed odio mattis aliquam eget eu nulla. Nam sed dui sit amet dolor rutrum hendrerit. Nunc pulvinar lectus quis odio sollicitudin, ut eleifend lacus ullamcorper. Nam id nulla velit. Sed condimentum neque urna, sit amet aliquet metus condimentum sed. Proin eu ligula id ipsum rhoncus commodo. Etiam tincidunt est eget pretium aliquam. Donec et sapien nec lacus ultrices ornare.</p>



      </div>

    </Layout>

  );

};

export default StickyNav;

