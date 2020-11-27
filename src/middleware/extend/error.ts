import { LogHandler } from './logger';

export default function onErrorMiddleware(log?: LogHandler) {

  log = log || console.error || console.log;

  return (err, req, res, next) => {
    if (!err)
      return next();
    log(err);
    res.status(500).end(err.toString());
  };

};
