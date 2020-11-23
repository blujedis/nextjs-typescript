import { PropsWithChildren, forwardRef } from 'react';
import { ILayoutBase } from './types';
import Head from 'next/head';

function LayoutBase<L extends ILayoutBase>(props: PropsWithChildren<L>) {

  const { title, children } = props;

  return (

    <>
      <Head>
        <title>{title}</title>
      </Head>

      {children}

      <style jsx global>{`

          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          #__next {
            min-height: 100vh;
            padding: 0
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          * {
            box-sizing: border-box;
          }
      `}</style>

    </>

  );

};

export const LayoutWithRef = forwardRef<HTMLDivElement, ILayoutBase>((props, ref) => {
  return (
    <div ref={ref}>
      <LayoutBase {...props} />
    </div>
  );
});

export default LayoutBase;