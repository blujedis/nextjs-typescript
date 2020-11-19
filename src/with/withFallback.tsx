import { GetServerSidePropsContext, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import ErrorPage from 'pages/_error';
import { ErrorProps } from 'types';

const DEV = process.env.NODE_ENV !== 'production';

export interface IWithFallback {
  err?: ErrorProps;
}

export type RedirectProps = {
  permanent: boolean
  destination: string
}

export interface IServerSidePropsResult<P> {
  props?: P,
  redirect?: RedirectProps;
  notFound?: true;
  [key: string]: any;
}

export type GetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
  > = (
    context: GetServerSidePropsContext<Q>
  ) => Promise<IServerSidePropsResult<P>>


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
      return { props: { err } };
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
export function withFallback<P extends IWithFallback = {}>(
  SuccessPage: NextPage<P>, FallbackPage?: NextPage<P>) {
  FallbackPage = (FallbackPage || ErrorPage) as NextPage<P>;
  return (props: P) => {
    if (props.err)
      return <FallbackPage {...props} />;
    return <SuccessPage {...props} />;
  };
}

