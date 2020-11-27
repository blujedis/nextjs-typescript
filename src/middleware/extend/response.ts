
import { Request, Response } from '..';
import { LogHandler } from './logger';

const STATUS_MAP_BASE = {
  400: 'Bad Request',
  401: 'Unauthenticated',
  403: 'Unauthorized',
  405: 'Method Not Allowed',
  404: 'Not Found',
  500: 'Server Error'
};

function responseMiddleware(log?: LogHandler, statusMap?: { [key: number]: string }) {

  log = log || console.log;
  statusMap = statusMap || STATUS_MAP_BASE;

  function handleResponse(res: Response, req: Request) {

    return (data?: any, statusCode = 200, contentType = 'application/json') => {

      res.statusCode = statusCode;
      res.setHeader('Content-Type', contentType);
      res.setHeader('APP-RID', JSON.stringify(req.rid));

      if (data instanceof Error) {

        // Log the inner error if exists.
        if ((data as any).inner)
          log.error((data as any).inner, { rid: req.rid });


        res.statusMessage = STATUS_MAP[statusCode] + ': ' + data.message;
        data = '';

      }

      res.json(data);

    };

  }

  function handleError(res: Response, req: Request, statusCode: number) {
    return (err?: string | Error) => {
      if (typeof err === 'string') {
        err = new Error(err as string || STATUS_MAP[statusCode]);
        err.name = STATUS_MAP[statusCode];
      }
      handleResponse(res, req)(err, statusCode);
    };
  }

  return (req: Request, res: Response, next: (err?: any) => void) => {
    res.badRequest = handleError(res, req, 400);
    res.unauthenticated = handleError(res, req, 401);
    res.unauthorized = handleError(res, req, 403);
    res.notFound = handleError(res, req, 404);
    res.serverError = handleError(res, req, 500);
    res.notAllowed = handleError(res, req, 405);
    res.handle = handleResponse(res, req);
    next();
  };

}

export default responseMiddleware;
