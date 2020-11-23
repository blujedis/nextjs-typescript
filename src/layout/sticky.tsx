import { PropsWithChildren } from 'react';
import { ILayoutFull } from './types';
import { LayoutWithRef } from './base';
import useSticky from 'hooks/sticky';

function LayoutSticky<L extends ILayoutFull>(props: PropsWithChildren<L>) {

  props = {
    footer: true,
    ...props
  };

  const { children, footer } = props;

  const { isSticky, parent } = useSticky();

  return (
    <LayoutWithRef {...props} ref={parent}>

      <header className={isSticky ? 'sticky' : ''}>
        <img src="/images/logo.png" height={40} />
      </header>

      <main className={isSticky ? 'sticky' : ''}>

        {children}

        {!footer ? null :
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
        }

      </main>

      <style jsx>{`

        header {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 75px;
          background: #efefef;
          border-bottom: 1px solid #ddd;
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

        main {
          padding: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          min-height: 100vh;
          padding-bottom: 50px;
        }

        main.sticky {
          padding-top: 50px; 
        }

        footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          height: 50px;
          border-top: 1px solid #ddd;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.9rem;
          background-color: #efefef;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @keyframes moveDown {
          from {
            transform: translateY(-5rem);
          }

          to {
            transform: translateY(0rem);
          }
        }

        @keyframes rotate {
          0% {
            transform: rotateY(360deg);
          }

          100% {
            transform: rotateY(0rem);
          }
        }

      `}</style>

    </LayoutWithRef>

  );

}

export default LayoutSticky;