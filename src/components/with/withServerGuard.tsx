import { GetServerSidePropsContext, NextPage } from 'next';
import { withFallback } from 'components/with/withFallback';
import {  isPromise } from 'utils/is';
import { IRedirectProps } from 'types';
import { AuthorizeHandler, getServerSideAuthProps, IAuthProps } from './getServerSideAuthProps';
import { ParsedUrlQuery } from 'querystring';

export function normalizeHandler(handler: AuthorizeHandler) {

  let authorizeHandler: (options?) => Promise<number | IAuthProps>;

  // We need to ensure the onAuthorize handler is a promise.
  if (!isPromise(handler))
    authorizeHandler = (options?) => Promise.resolve(handler(options));

  return authorizeHandler as AuthorizeHandler;

}

/**
 * Secures a Page redirecting by server on failed.
 * 
 * @param SecurePage the page to be secured.
 * @param handler the authentication handler to be verified.
 * @param redirect the redirect on failed authorization.
 */
function withServerGuard<P>(
  SecurePage: NextPage<P>,
  handler: AuthorizeHandler,
  redirect: string | IRedirectProps) {

  const authorizeHandler = normalizeHandler(handler);

  const getServerSideProps = <Q extends ParsedUrlQuery>(ctx: GetServerSidePropsContext<Q>) => getServerSideAuthProps(ctx, authorizeHandler, redirect);

  SecurePage = withFallback(SecurePage);

  return [SecurePage, getServerSideProps];

}

export default withServerGuard;


