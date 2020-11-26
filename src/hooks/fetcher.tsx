import useSWR, { ConfigInterface, keyInterface } from 'swr';
import { fetcherFn, responseInterface } from 'swr/dist/types';
import qs from 'querystring';

export type BodyInit = Blob | BufferSource | FormData | URLSearchParams | ReadableStream<Uint8Array> | string | Record<string, any>;

export interface IRequestInit extends Omit<RequestInit, 'url' | 'body'> {
  body?: BodyInit;
  query?: Record<string, any>;
  safe?: boolean | string[];
}

export interface IConfigInterface<Data = any, Error = IFetchError, Fn extends fetcherFn<Data> = fetcherFn<Data>> extends ConfigInterface<Data, Error, Fn>, Omit<IRequestInit, 'body'> { }

export interface IResponseInterface<Data = any, Error = IFetchError> extends responseInterface<Data, Error> {
  payload: FetchPayload<Data>;
};

export type ResponseInterface<Data = any, Ext extends Object = {}, Error = IFetchError> = responseInterface<FetchPayload<Data, Ext>, Error> & { payload?: FetchPayload<Data, Ext> };

export interface IFetchError extends Error {
  status: number;
  statusText: string;
  [key: string]: any;
}

export interface IFetchPayload<T> {
  ok: boolean;
  type: ResponseType;
  url: string;
  status: number;
  statusText: string;
  data: T;
  get?: { [K in keyof T]: T[K] };
}

export type FetchPayload<Data, Ext extends Object = any> = IFetchPayload<Data> & Ext;

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
function initSafe<T>(data: T, keys: (keyof T)[] = []) {
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
async function fetcherBase<Data = any, Ext extends Object = {}>(endpoint: string, initConfig: IRequestInit = {}) {

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
    const { ok, status, statusText, url, type } = res;
    const init = { ok, status, statusText, url, type, data: null, get: {} } as FetchPayload<Data, Ext>;

    if (!ok)
      return Promise.reject(init);

    const text = await res.text();
    const data = text === '' ? null : tryParseJSON(text);

    const payload = { ...init, request, data } as FetchPayload<Data, Ext>;

    // Add safe getters for props.
    if (safe && payload.data !== null && !Array.isArray(payload.data) && typeof payload.data === 'object')
      payload.get = initSafe(payload.data);

    return payload;

  }
  catch (ex) {

    const err = (ex || new Error(`Invalid fetch payload.`)) as Error & { [key: string]: any; };
    err.status = err.status || 500;
    err.name = err.name || STATUS_MAP[err.status] || 'Server Error';
    err.statusText = err.statusText || 'Unknown Server Error.';
    console.log(ex);
    return Promise.reject(err);

  }

}

/**
 * Creates a fetcher using SWR underneath.
 * 
 * @param key the key to use for the fetcher typically a string or array.
 * @param config the configuration object.
 * @param fetcher optional custom fetcher to use.
 */
export function createFetcher<Data = any, Ext = Record<string, any>, Error = IFetchError, Fn extends fetcherFn<FetchPayload<Data, Ext>> = fetcherFn<FetchPayload<Data, Ext>>>(
  key: keyInterface, initConfig?: IConfigInterface<FetchPayload<Data, Ext>, Error, Fn>, fetcher?: Fn) {
  fetcher = fetcher || fetcherBase as Fn;

  return function (config?: IConfigInterface<FetchPayload<Data, Ext>, Error, Fn>) {

    config = {
      ...initConfig,
      ...config
    };

    const result = useSWR<FetchPayload<Data, Ext>>(key, fetcherBase, config) as ResponseInterface<Data, Ext, Error>
    result.payload = result.data || {} as any;
    result.payload.get = result.payload.get || {} as any;

    return result as Omit<ResponseInterface<Data, Ext, Error>, 'data'>;

  }

};

// Default vanilla useSWR.
export { useSWR };

/**
 * Directly creates useSWR fetcher for immediate use.
 * 
 * @param url the url endpoint for the request.
 * @param config the configuration object.
 */
export default function useFetcher<Data = any, Ext = Record<string, any>>(url: string, config?: IConfigInterface<FetchPayload<Data, Ext>>) {
  return createFetcher(url, config)();
}