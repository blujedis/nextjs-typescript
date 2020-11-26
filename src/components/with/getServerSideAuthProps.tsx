import { sanitizeObject, serializeError } from 'utils/object';
import status from 'statuses';
import { ErrorProps, IRedirectProps } from 'types';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery, encode } from 'querystring';
import { format } from 'url';

export interface IAuthProps {
  statusCode: number;
  statusMessage?: string;
  [key: string]: any;
}

export interface IServerSideProps<Q = ParsedUrlQuery> {
  url?: string;
  query?: Q;
  err?: ErrorProps;
  auth?: IAuthProps;
}

export type ServerSideProps<P, Q extends ParsedUrlQuery = ParsedUrlQuery> = IServerSideProps<Q> & P;

export type ServerSidePropsResult<P, Q extends ParsedUrlQuery = ParsedUrlQuery> = { props: ServerSideProps<P, Q> };

export interface ISecureRedirect extends IRedirectProps {
  statusCode?: number; // default 302
}

export type SecureClientRedirect = IRedirectProps;

export type SecureServerRedirect = Omit<ISecureRedirect, 'options' | 'replace'>;

export type AuthorizeHandler = <Q extends ParsedUrlQuery>(options: GetServerSidePropsContext<Q>) => number | Promise<number> | IAuthProps | Promise<IAuthProps>;


const DEV = process.env.NODE_ENV !== 'production';

/**
 * Normalizes the server redirect url.
 * 
 * @param redirect the redirect configuation.
 * @param err optional error object to extend as query params.
 */
export function formatRedirectUrl(redirect: ISecureRedirect, err?: ErrorProps) {
  redirect.as = redirect.as || redirect.url;
  let qs = '';
  if (err) {
    const errorProps = {};
    for (const k in err) {
      if (!Object.hasOwnProperty.call(err, k) || k === 'stack') continue;
      errorProps[k] = err[k];
    }
    qs = encode(errorProps);
  }
  let url = typeof redirect.as === 'string' ? redirect.as : format(redirect.as);
  if (qs)
    url += '?' + qs;
  return url;
}

/**
 * Normalizer for getServerSideProps that optionally redirects on failed auth otherwise returns auth status.
 * 
 * @param ctx the current server side props context.
 * @param handler the authorization handler.
 * @param serverRedirect the optional server redirect string or props.
 */
export async function getServerSideAuthProps<P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
  ctx: GetServerSidePropsContext<Q>,
  handler: AuthorizeHandler,
  serverRedirect?: string | ISecureRedirect): Promise<ServerSidePropsResult<P, Q>> {

  ctx = {
    query: {},
    ...ctx
  };

  const { params, req, res } = ctx;
  const url = req.url;
  const { referrer } = req.headers;
  const query = { ...ctx.query, ...params }; // extend query with any params.
  const destination = typeof serverRedirect === 'string' ? { url: serverRedirect } as ISecureRedirect : serverRedirect;

  let err: ErrorProps = null;
  let auth: IAuthProps = { statusCode: 200 };
  const result = { props: {} as ServerSideProps<P, Q> };

  try {
    const tmp = await handler(ctx) as any;
    if (typeof tmp === 'number') {
      auth.statusCode = tmp;
    }
    else {
      auth = {
        ...auth,
        ...tmp
      };
    }
    auth.statusMessage = auth.statusMessage || status(auth.statusCode) as string;
    // Ensure user didn't pass object with
    // bad undefined values which can't be serialized.
    auth = sanitizeObject(auth);
  }
  catch (ex) {
    err = serializeError(ex) as any;
    err.statusCode = 500;
  }

  // If there wasn't an error in resolving our
  // auth handler and we have a status greater
  // than or equal to 400 we build an error
  // and pass to our return props.
  if (auth.statusCode >= 400 && !err) {
    err = new Error();
    err.name = 'AuthenticationError';
    err.statusCode = auth.statusCode;
    err.message = auth.statusMessage;
    // Errors must be serialized or Nextjs will complain.
    err = serializeError(err);
  }

  if (err && !DEV)
    err.stack = ''; // don't expose stack in production. 

  // If we have a redirect destination it's server side or is external.
  if (destination && res && !referrer) {
    res.setHeader('Location', formatRedirectUrl(destination, err));
    res.statusCode = destination.statusCode || 302;
    return result;
  }

  result.props = { url, query, err, auth } as any;

  return result;

};
