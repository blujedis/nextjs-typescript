
import { Request, Response } from '..';
import { LogHandler } from './logger';

const APP_NAME = process.env.APP_NAME;
const APP_VERSION = process.env.APP_VERSION;

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

  function handleResponse(res: Response, req: Request) {

    return (data?: any, statusCode = 200, statusText = null) => {

      res.statusCode = statusCode;
      res.statusMessage = statusText || STATUS_MAP_BASE[statusCode];

      if (data instanceof Error) {
        log(data, { rid: req.rid });
        statusCode = 500;
        res.statusMessage = STATUS_MAP_BASE[statusCode] + ': ' + data.message;
        data = '';
      }

      res.json(data);

    };

  }

  function handleError(res: Response, req: Request, statusCode: number) {
    return (err?: string | Error) => {
      if (typeof err === 'string') {
        err = new Error(err as string || statusMap[statusCode]);
        err.name = statusMap[statusCode];
      }
      handleResponse(res, req)(err, statusCode);
    };
  }

  return (req: Request, res: Response, next: (err?: any) => void) => {


    res.setHeader(`${APP_NAME.toUpperCase() + '-NAME'}`, JSON.stringify(APP_NAME));
    res.setHeader(`${APP_NAME.toUpperCase() + '-VERSION'}`, JSON.stringify(APP_VERSION));
    res.setHeader(`${APP_NAME.toUpperCase() + '-REQUEST-ID'}`, JSON.stringify(req.rid));

    // Response helpers.
    res.badRequest = handleError(res, req, 400);
    res.unauthenticated = handleError(res, req, 401);
    res.unauthorized = handleError(res, req, 403);
    res.notFound = handleError(res, req, 404);
    res.serverError = handleError(res, req, 500);
    res.notAllowed = handleError(res, req, 405);
    res.handleJSON = handleResponse(res, req);

    next();


  };

}

export default responseMiddleware;
