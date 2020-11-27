
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import onErrorMiddleware from './extend/error';
import loggerMiddleware from './extend/logger';
import queryMiddleware from './extend/query';
import reqIdMiddleware from './extend/reqid';
import responseMiddleware from './extend/response';

export type ResponseHandler = (data?: any, statusCode?: number, contentType?: string) => void;

export type ResponseErrorHandler = (err?: string | Error) => void;

export type Request = NextApiRequest & {
  rid: string;
};

export type Response = NextApiResponse & {
  badRequest: ResponseErrorHandler;
  unauthenticated: ResponseErrorHandler;
  unauthorized: ResponseErrorHandler;
  notFound: ResponseErrorHandler;
  serverError: ResponseErrorHandler;
  notAllowed: ResponseErrorHandler;
  handle: ResponseHandler;
};

export type MiddlewareError<R = void> = (err: Error, req: Request, res: Response, next: (err?: any) => void) => R;

export type Middleware<R = void> = (req: Request, res: Response, next: (err?: any) => void) => R;

// You can import your own logger above
// then set it accordingly or make child
// loggers and pass different loggers into
// the "middleware" below as you see fit.
// By default we just use console.log.
// 
// responseMiddleware() and loggerMiddleware()
// both use console.log unless you pass in your
// own logger.

/**
 * Creates a new handler stack for Api.
 * 
 * @param middleware additional middleware to include before handler.
 */
export function createHandler(...middleware: Middleware[]) {

  const handler = nextConnect<Request, Response>({ onError: onErrorMiddleware });

  // Order is IMPORTANT here do NOT change
  // unless you know what you're doing.
  handler.use(responseMiddleware(), reqIdMiddleware(), queryMiddleware, loggerMiddleware(), ...middleware);

  return handler;

}

export default createHandler;
