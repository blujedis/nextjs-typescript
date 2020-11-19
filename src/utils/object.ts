

import { isObject, isArray, isUndefined, isPlainObject, getType } from './is';

/**
 * Checks if object has own property by key name.
 * 
 * @param obj the option to inspect for property.
 * @param key the key within the option to verify.
 */
export function hasOwn<T extends Object>(obj: T, key: keyof T) {
  return Object.hasOwnProperty.call(obj, key);
}

/**
 * Location search query parser.
 * 
 * @param search the window.location.search string.
 */
export function parseQuery(search: string) {
  const split = search.replace(/^\?/, '').split('&');
  return split.reduce((a, c) => {
    let [key, val] = c.split('=');
    val = decodeURIComponent(val.replace(/\+/g, ' '));
    if (a[key]) {
      if (!Array.isArray(a[key]) && typeof a[key] !== 'undefined')
        a[key] = [a[key]];
      a[key].push(val);
    }
    else {
      a[key] = val;
    }
    return a;
  }, {} as any);
}



/**
 * Merges objects.
 * 
 * @param overwrite when true overrites values.
 * @param target the target object.
 * @param sources the sources array to merge with target.
 */
export function merge<U, V extends U>(
  overwrite: boolean | U,
  target: U | V,
  ...sources: V[]) {

  if (typeof overwrite === 'object') {
    if (typeof target !== 'undefined')
      sources.unshift(overwrite as any);
    overwrite = false;
  }

  if (overwrite && !sources.length)
    throw new Error(`Cannot merge into target using sources of undefined.`);

  function _merge<T, S extends T>(tar: T, src: S): T | S {
    for (const k in src) {
      if (!hasOwn(src, k)) continue;
      if (isObject(src[k]) && isObject((tar as T & S)[k])) {
        (tar as T & S)[k] = _merge((tar as T & S)[k], src[k]);
      }
      else {
        if (typeof src[k] !== 'undefined' || overwrite)
          (tar as S)[k] = src[k];
      }
    }
    return tar;
  }

  while (sources.length) {
    const source = sources.shift();
    target = _merge(target, source);
  }

  return target;

}

/**
 * Converts an error to object literal.
 * 
 * @param err the error to convert to object
 */
export function serializeError<E extends Error>(err: E & { [key: string]: any }) {
  if (!(err instanceof Error))
    return err;
  const result = Object.getOwnPropertyNames(err).reduce((a, c) => {
    a[c] = err[c];
    return a;
  }, {} as Record<keyof E, any>);
  if (err.name && !result.name)
    result.name = err.name;
  return result;
}

/**
 * Ensures object doesn't contain undefined values
 * that cannot be serialized by Nextjs.
 * 
 * @param obj the object to sanitize.
 */
export function sanitizeObject<T extends Object>(obj: T) {
  for (const k in obj) {
    if (!hasOwn(obj, k)) continue;
    if (typeof obj[k] === 'undefined') {
      delete obj[k];
      continue;
    }
    if (isPlainObject(obj[k]))
      obj[k] = sanitizeObject(obj[k])
  }
  return obj;
}
