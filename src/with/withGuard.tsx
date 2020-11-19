import Redirect, { IRedirectProps } from 'components/redirect';
import { GetServerSidePropsContext, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { withFallback, getWithServerSideProps, IWithFallback, IServerSidePropsResult } from 'with/withFallback';
import { isString, isPlainObject, isPromise } from 'utils/is';
import { ErrorProps } from 'types';
import { sanitizeObject, serializeError } from 'utils/object';
import status from 'statuses';

export interface IAuthProps {
  statusCode: number;
  statusMessage?: string;
  [key: string]: any;
}

export type AuthProps<P extends IAuthProps = IAuthProps> = IAuthProps & P;

export interface IGuardProps extends IWithFallback {
  url: string;
  query: ParsedUrlQuery;
  auth: AuthProps;
}

export type AuthorizeHandler = (options: GetServerSidePropsContext<ParsedUrlQuery>) => number | Promise<number> | AuthProps | Promise<AuthProps>;

function normalizeProps<P>(onAuthorize: AuthorizeHandler, FailureDestination: string | NextPage<P> | IRedirectProps) {

  // Not a component convert to Redirect component.
  if (isString(FailureDestination) || isPlainObject(FailureDestination)) {

    // Only redirect string was provided.
    let redirProps: IRedirectProps = {
      url: FailureDestination as string
    };

    // Redirect object provided.
    if (!isString(FailureDestination))
      redirProps = FailureDestination as IRedirectProps;

    // Set the Unauthorized component to Redirect component.
    FailureDestination = () => <Redirect {...redirProps} />;

  }

  let authorizeHandler: (options?) => Promise<number | AuthProps>;

  // We need to ensure the onAuthorize handler is a promise.
  if (!isPromise(onAuthorize))
    authorizeHandler = (options) => Promise.resolve(onAuthorize(options));

  return {
    UnauthorizedPage: FailureDestination as NextPage<P>,
    authorizeHandler,
  };

}

function withGuard<P>(
  SecurePage: NextPage<P>,
  onAuthorize: AuthorizeHandler,
  FailureDestination?: string | NextPage<P> | IRedirectProps) {

  // Normalize our handler and Unauthorized Page.
  const { authorizeHandler, UnauthorizedPage }
    = normalizeProps(onAuthorize, FailureDestination);

  const getServerSideProps = getWithServerSideProps(async (ctx) => {

    ctx = {
      query: {},
      params: {},
      ...ctx
    };

    const { params, req } = ctx;
    const url = req.url;
    const query = { ...ctx.query, ...params }; // extend query with any params.

    let err: ErrorProps = null;
    let auth: AuthProps = { statusCode: 200 };

    try {
      const tmp = await authorizeHandler(ctx) as any;
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

    return { props: { url, query, err, auth } };

  });

  return [withFallback(SecurePage, UnauthorizedPage), getServerSideProps];

}

export default withGuard;


