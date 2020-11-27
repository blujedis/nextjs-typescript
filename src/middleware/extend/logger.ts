
import onHeaders from 'on-headers';
import { Middleware } from '../';
import { green, yellow, red } from 'ansi-colors';

export type LogHandler = (...args: any[]) => void;

export type LogMiddleware = (log?: LogHandler) => Middleware;

const loggerMiddleware: LogMiddleware = (log?: LogHandler) => ((req, res, next) => {

  log = log || console.log;

  const startTime = process.hrtime();

  onHeaders(res, () => {

    const status = res.statusCode,
      method = req.method,
      url = (req.url || '-'),
      referer = req.headers.referer || '-',
      ua = req.headers['user-agent'],
      httpVersion = req.httpVersionMajor + '.' + req.httpVersionMinor,
      hrtime = process.hrtime(startTime),
      responseTime = hrtime[0] * 1e3 + hrtime[1] / 1e6;

    const isPutPost = ['put', 'post'].includes(req.method.toLowerCase());

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
      (req.socket && req.socket.remoteAddress) ||
      // @ts-ignore
      (req.socket.socket && req.socket.socket.remoteAddress) ||
      '127.0.0.1';

    ip = ip === '::1' ? '127.0.0.1' : ip;

    const meta = {
      'rid': req.rid,
      'remote-address': ip,
      'ip': ip,
      'method': method,
      'url': url,
      'referer': referer,
      'user-agent': ua,
      'body': req.body,
      'http-version': httpVersion,
      'response-time': responseTime,
      'response-hrtime': hrtime,
      'status-code': status,
      'req-headers': req.headers,
      'dir': isPutPost ? '-->' : '<--'
    };

    const codeColor = status < 300 ? green : status >= 300 && status < 400 ? yellow : red;
    const code = codeColor(status + '');
    meta.rid = codeColor(meta.rid);
    const methodDir = codeColor([
      meta.dir,
      meta.method.toUpperCase()
    ].join(' '));

    const msg =
      [
        meta.rid,
        meta['remote-address'],
        methodDir,
        meta.url,
        code,
        meta.referer,
        meta['user-agent'],
        '(' + Math.max(0, Math.round(meta['response-time'])) + ' ms' + ')'
      ].join(' ');

    res.setHeader('X-Powered-By', 'Blujedis');

    log(msg);

  });

  next();

});

export default loggerMiddleware;