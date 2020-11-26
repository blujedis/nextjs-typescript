import { PropsWithChildren } from 'react';
import LayoutBase from './base';
import { ILayoutDefault } from './types';

function LayoutDefault<L extends ILayoutDefault>(props: PropsWithChildren<L>) {

  const { children } = props;

  return (
    <LayoutBase {...props}>

      <main>
        {children}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" height="25" />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        footer {
          width: 100%;
          height: 50px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.9rem;
        }

        footer img {
          margin-left: 0.5rem;
          height: 25px;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </LayoutBase>

  );

}

export default LayoutDefault;