import Layout from 'layout';
import Link from 'next/link';
import { PageProps } from 'types';

function Home(props: PageProps) {

  return (

    <Layout title="Create Next App" {...props}>

      <>

        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
          <br />
          <p style={{ float: 'right', fontSize: '.9rem', marginTop: 8 }}>
            <span>With Typescript </span> <img src="/images/ms-icon.png" width="20" style={{ verticalAlign: 'middle', display: 'inline-block' }} />
          </p>
        </h1>

        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
        <p>
          <Link href="/examples">View Examples</Link>
        </p>

        <div className="grid">
          <a href="https://nextjs.org/docs" className="card">
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className="card">
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className="card"
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="card"
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
          </p>
          </a>
        </div>

        <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      </>

    </Layout>

  );

}


export default Home;

//////////////////////////////////////////////////////////////////
// getStaticProps
//
// When to use?
//
// Use this method which fires ONLY on the server side and is
// not provided on the client, when you the data needed
// is not specific to a user as it will be cached.
// 
//////////////////////////////////////////////////////////////////

// InferGetStaticPropsType<typeof getStaticProps>
// OR:
// props: GetStaticProps
// 
// This would be written as:
// function Home(props: Page<InferGetStaticPropsType<typeof getStaticProps>>) {
//    return (
//       <p>Hello World</>
//    );
// }

// export async function getStaticProps() {
//   return {
//     props: {}
//   };
// };


//////////////////////////////////////////////////////////////////
// getServerSideProps
// 
// When to use?
//
// Use this method when you need to pre-render on each 
// request of the page. For example user specific data.
// If possible load data on the client side as this method
// may be slower than "getStaticProps" above.
// 
//////////////////////////////////////////////////////////////////

// InferGetServerSidePropsType<typeof getStaticProps> 
// OR:
// props: GetServerSideProps
// 
// This would be written as:
// function Home(props: Page<InferGetServerSidePropsType<typeof getServerSideProps>>) {
//    return (
//       <p>Hello World</>
//    );
// }

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }




