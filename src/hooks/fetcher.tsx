import useSWR, { ConfigInterface, keyInterface } from 'swr';
import { fetcherFn } from 'swr/dist/types';
import qs from 'querystring';

export type BodyInit = Blob | BufferSource | FormData | URLSearchParams | ReadableStream<Uint8Array> | string | Record<string, any>;

export interface IRequestInit extends Omit<RequestInit, 'url' | 'body'> {
  body?: BodyInit;
  query?: Record<string, any>;
  safe?: boolean | string[];
}

export interface IConfigInterface<Data = any, Error = IFetchError, Fn extends fetcherFn<Data> = fetcherFn<Data>> extends ConfigInterface<Data, Error, Fn>, Omit<IRequestInit, 'body'> { }

export interface IFetchError extends Error {
  status: number;
  statusText: string;
  [key: string]: any;
}

/**
 * Common statuses.
 */
const STATUS_MAP = {
  400: 'Bad Request',
  401: 'Unauthenticated',
  403: 'Unauthorized',
  405: 'Method Not Allowed',
  404: 'Not Found',
  500: 'Server Error'
};

/**
 * Checks if body should be stringified.
 * 
 * @param body body value to be inspected.
 */
function shouldStringify(body: BodyInit) {
  if (
    typeof body === 'string' ||
    (body instanceof Blob) ||
    (body instanceof ArrayBuffer) ||
    (body instanceof FormData) ||
    (body instanceof ReadableStream) ||
    (body instanceof URLSearchParams)
  )
    return false;
  return typeof body === 'object';
}

/**
 * Safely parses JSON or returns original value.
 * 
 * @param value the value to be parsed.
 */
function tryParseJSON(value: unknown) {
  try {
    return JSON.parse(value as any);
  }
  catch (_) {
    return value;
  }
}

/**
 * Safely stringify.
 * 
 * @param value the value to stringify.
 */
function tryStringifyJSON(value: unknown) {
  try {
    return JSON.stringify(value);
  }
  catch (_) {
    return value;
  }
}

/**
 * Safely gets a value from object, useful when returning
 * data from server where payload data may be undefined.
 * 
 * @param data the data object to pick from.
 * @param key the key or nested key to get.
 * @param def a default value if undefined.
 */
function safeGet<T>(data: T, key: keyof T, def = '') {
  data = data || {} as T;
  const result = data[key];
  if (typeof result === 'undefined')
    return def;
  return result as T[keyof T];
}

/**
 * Creates an object with safe getters. This is useful
 * in views so you don't have to check if the value 
 * exists. It is a convenience method.
 * 
 * @param data the object to create getters from.
 * @param keys the keys to apply safe gets for.
 */
function applySafe<T>(data: T, keys: (keyof T)[] = []) {
  const obj = {};
  if (!keys.length)
    keys = Object.keys(data) as (keyof T)[];
  keys.forEach(k => {
    Object.defineProperty(obj, k, {
      get() {
        return safeGet(data, k);
      }
    });
  });
  return obj as { [K in keyof T]: T[K] };
}

/**
 * Creates normalized Fetch request.
 * 
 * @param endpoint the endpoint to be fetched.
 * @param config optional fetch configuration.
 */
async function fetcher<Data = any, Ext extends Object = {}>(endpoint: string, initConfig: IRequestInit = {}) {

  try {

    const { safe, query, ...config } = initConfig;

    config.method = config.method || 'GET';

    if (query)
      endpoint = endpoint + '?' + qs.stringify(query);

    // If object stringify the body.
    if (shouldStringify(config.body))
      config.body = tryStringifyJSON(config.body);

    const headers = !(config.headers instanceof Headers) ? new Headers(config.headers || {}) : config.headers;

    // if content-type not set assume json.
    if (!headers.has('Content-Type') && !headers.has('content-type'))
      headers.set('Content-Type', 'application/json');

    config.headers = headers;

    /**
     * Create the new request and fetch.
     */
    const request = new Request(endpoint, config as RequestInit);
    const res = await fetch(request);

    if (!res.ok)
      return Promise.reject({ status: res.status, statusText: res.statusText });

    const text = await res.text();
    let data = text === '' ? null : tryParseJSON(text);

    // Add safe getter do object when JSON is returned.
    if (!Array.isArray(data) && data !== null && typeof data === 'object' && safe)
      data = applySafe(data);

    return data;

  }
  catch (err) {
    err.status = err.status || 500;
    err.name = err.name || STATUS_MAP[err.status] || 'Server Error';
    err.statusText = err.statusText || 'Unknown Server Error.';
    return Promise.reject(err);
  }

}

fetcher.get = (endpoint: string, config: IRequestInit = {}) => fetcher(endpoint, { ...config, method: 'GET' });
fetcher.put = (endpoint: string, config: IRequestInit = {}) => fetcher(endpoint, { ...config, method: 'PUT' });
fetcher.post = (endpoint: string, config: IRequestInit = {}) => fetcher(endpoint, { ...config, method: 'POST' });
fetcher.del = (endpoint: string, config: IRequestInit = {}) => fetcher(endpoint, { ...config, method: 'DELETE' });

export default function useFetcher<Data = any, Err = IFetchError, Fn extends fetcherFn<Data> = fetcherFn<Data>>(
  key: keyInterface,
  fn?: Fn | IConfigInterface<Data, Err, Fn>,
  config?: IConfigInterface<Data, Err, Fn>) {
  if (fetcher && typeof fetcher !== 'function') {
    config = fn as IConfigInterface<Data, Err, Fn>;
    fn = undefined;
  }
  fn = (fn || ((endpoint, ...args) => {
    if (Array.isArray(endpoint) || typeof endpoint === 'function')
      throw new Error(`Must use custom fetcher when keyInterface is an array or function.`);
    return fetcher(endpoint, ...args);
  })) as Fn;
 return useSWR<Data, Err>(key, fetcher, config);
};

export { fetcher };