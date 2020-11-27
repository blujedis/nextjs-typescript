import reqId from 'express-request-id';

interface IRequestId {
  uuidVersion?: string;
  setHeader?: boolean;
  headerName?: string;
  attributeName?: string;
}

const REQUESTID_DEFAULTS: IRequestId = {
  setHeader: true,
  attributeName: 'rid'
};

const requestIdMiddleware = (options?: IRequestId) => {
  options = { ...REQUESTID_DEFAULTS, ...options };
  return reqId(options);
};

export default requestIdMiddleware;