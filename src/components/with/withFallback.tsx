import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import ErrorPage from 'pages/_error';
import { ErrorProps } from 'types';

const DEV = process.env.NODE_ENV !== 'production';

export interface IWithFallback {
  err?: ErrorProps;
  [key: string]: any;
}

/**
 * Fullfills the user defined getServerSideProps promise.
 * 
 * @param fn the getServerSideProps function.
 */
export function getWithServerSideProps<P, Q extends ParsedUrlQuery>(fn: GetServerSideProps<P, Q>) {
  return async (ctx: GetServerSidePropsContext<Q>) => {
    try {
      return await fn(ctx);
    }
    catch (err) {
      err.stack = DEV ? err.stack : ''; // don't expose stack in production.
      const props = { err } as unknown as P;
      return { props };
    }
  }
}

/**
 * Upon fullfilling the getServerSideProps handler above, if err prop exists
 * fallback to failure Page Component otherwise render the SuccessPage that
 * you've wrapped.
 * 
 * @param SuccessPage the Page to be returned on success.
 * @param FallbackPage the Page to be returned on failure.
 */
export function withFallback<P extends IWithFallback = IWithFallback>(
  SuccessPage: NextPage<P>, FallbackPage?: NextPage<P>) {
  FallbackPage = (FallbackPage || ErrorPage) as NextPage<P>;
  return (props: P) => {
    if (props.err)
      return <FallbackPage {...props} />;
    return <SuccessPage {...props} />;
  };
}

