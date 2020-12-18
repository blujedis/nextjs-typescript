import Layout from 'layout';
import Link from 'next/link';

const EXAMPLE_FILES = JSON.parse(process.env.EXAMPLE_FILES || '');

const DEFAULT_EXAMPLES = EXAMPLE_FILES.filter(f => !f.includes('addons'));

const ADDON_EXAMPLES = EXAMPLE_FILES.filter(f => f.includes('addons'));

const Examples = () => {

  return (
    <Layout>
      <h1 className="title">
        Examples For <a href="https://nextjs.org">Next.js!</a>
        <br />
        <p style={{ float: 'right', fontSize: '.9rem', marginTop: 8 }}>
          With Typescript <img src="/images/ms-icon.png" width="20" style={{ verticalAlign: 'middle' }} />
        </p>
      </h1>
      <div style={{ maxWidth: 500 }}>

        <p>
          The following are generated in next.config.js when you boot. If you have installed
          addons that contain examples you will need to restart to see the links here.
        </p>

        <h4>Default Examples</h4>

        <ul>
          {DEFAULT_EXAMPLES.map((item, i) => {
            return (
              <li key={i + 1}><Link href={item}>{item}</Link></li>
            );
          })}
        </ul>

        {!ADDON_EXAMPLES || !ADDON_EXAMPLES.length ? null :

          <>
            <h4>Addon Examples</h4>

            <ul>
              {ADDON_EXAMPLES.map((item, i) => {
                return (
                  <li key={i + 1}><Link href={item}>{item}</Link></li>
                );
              })}
            </ul>
          </>

        }


        <style jsx>{`
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        ul li {
          padding: .5rem 0;
        }
      `}</style>

        <br />
        <br />

        <Link href="/">Return Home</Link>

      </div>

    </Layout>
  );


};

export default Examples;