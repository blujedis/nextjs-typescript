import Redirect from 'components/redirect';
import { GetServerSidePropsContext, NextPage } from 'next';
import { withFallback } from 'components/with/withFallback';
import { isString, isPlainObject, isPromise } from 'utils/is';
import { IRedirectProps } from 'types';
import { AuthorizeHandler, getServerSideAuthProps, IAuthProps, ServerSidePropsResult } from './getServerSideAuthProps';
import { ParsedUrlQuery } from 'querystring';

export type ClientGuardResult<P, Q extends ParsedUrlQuery = ParsedUrlQuery> = [NextPage<P>, (ctx: GetServerSidePropsContext<Q>) => Promise<ServerSidePropsResult<P, Q>>]

function normalizeHandler(onAuthorize: AuthorizeHandler) {

  let authorizeHandler: (options?) => Promise<number | IAuthProps>;

  // We need to ensure the onAuthorize handler is a promise.
  if (!isPromise(onAuthorize))
    authorizeHandler = (options?) => Promise.resolve(onAuthorize(options));

  return authorizeHandler as AuthorizeHandler;

}

function normalizeDestination<P>(FailureDestination: string | NextPage<P> | IRedirectProps) {

  let RedirectComponent = FailureDestination as NextPage<P>;

  if (!isString(FailureDestination) && !isPlainObject(FailureDestination))
    return RedirectComponent;

  // Normalize redirect props.
  let redirProps = {
    url: FailureDestination as string
  } as IRedirectProps & P;

  // Redirect object provided.
  if (!isString(FailureDestination))
    redirProps = FailureDestination as IRedirectProps & P;

  // Set the Unauthorized component to Redirect component.
  RedirectComponent = (props: P) => {
    redirProps = {
      ...props,
      ...redirProps
    };
    return <Redirect {...redirProps} />;
  };

  return RedirectComponent;

}

/**
 * Guard's page using client redirect UnauthorizedPage/Component.
 * 
 * @param SecurePage the Page to be guarded.
 * @param handler the handler to verify authentication.
 * @param UnauthorizedPage the redirect Page on failed authentication.
 */
function withClientGuard<P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
  SecurePage: NextPage<P>,
  handler: AuthorizeHandler,
  UnauthorizedPage: NextPage<P>): ClientGuardResult<P, Q>;

/**
 * Guard's page using client redirect options.
 * 
 * @param SecurePage the Page to be guarded.
 * @param handler the handler to verify authentication.
 * @param redirect the redirect url or url configuration object.
 */
function withClientGuard<P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
  SecurePage: NextPage<P>,
  handler: AuthorizeHandler,
  redirect: string | IRedirectProps): ClientGuardResult<P, Q>;

/**
 * Guard's page using client side error page by status on unauthenticated/unauthorized.
 * 
 * @param SecurePage the Page to be guarded.
 * @param handler the handler to verify authentication.
 */
function withClientGuard<P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
  SecurePage: NextPage<P>,
  handler: AuthorizeHandler): ClientGuardResult<P, Q>;

function withClientGuard<P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
  SecurePage: NextPage<P>,
  handler: AuthorizeHandler,
  redirectOrComponent?: string | NextPage<P> | IRedirectProps): ClientGuardResult<P, Q> {

  const authorizeHandler = normalizeHandler(handler);

  const UnauthorizedPage = normalizeDestination(redirectOrComponent);

  const getServerSideProps = (ctx: GetServerSidePropsContext<Q>) => getServerSideAuthProps<P, Q>(ctx, authorizeHandler);

  SecurePage = withFallback(SecurePage, UnauthorizedPage);

  return [SecurePage, getServerSideProps];

}

export default withClientGuard;








