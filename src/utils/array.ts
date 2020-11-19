
/**
 * Ensures the value is an array or empty array when undefined.
 * 
 * @param val the value to inspect as array.
 * @param nullAsUndefined when true null is treated as undefined, returns empty array.
 */
export function ensureArray<T>(val: T, nullAsUndefined = false): T[] {
 if (typeof val === 'undefined' || (nullAsUndefined && val === null) || Array.isArray(val))
   return (val || []) as T[];
 return [val];
}

/**
 * Flattens multi dimensional array.
 * 
 * @param arr the array to be flattened. 
 */
export function flatten<T = any>(arr: T[]): T[] {
  return arr.reduce((a, c) => [...a, ...(Array.isArray(c) ? flatten(c as any) : [c])], []);
}

/**
 * Async await for each runner.
 * 
 * @param arr the array to process.
 * @param done callback on done.
 */
export async function asyncEachRun(arr: any[], done: (item: any, i: number, arr: any[]) => any) {
  for (let i = 0; i < arr.length; i++) {
    await done(arr[i], i, arr);
  }
}

/**
 * Asynchronous for each.
 * 
 * @param arr the array of functions to process.
 * @param done optional callback when done.
 * @param halt whether to halt on first error or not.
 */
export async function asyncEach<T = any>(
  arr: ((...args: any[]) => T | Promise<T>)[],
  done: (errors: Error[], result: T[]) => void,
  halt?): Promise<{ errors: Error[], data: T[]; }>;


/**
 * Asynchronous for each.
 * 
 * @param arr the array of functions to process.
 * @param halt whether to halt on first error or not.
 */
export async function asyncEach<T = any>(
  arr: ((...args: any[]) => T | Promise<T>)[],
  halt?): Promise<{ errors: Error[], data: T[]; }>;

export async function asyncEach<T = any>(
  arr: ((...args: any[]) => T | Promise<T>)[],
  done?: (errors: Error[], result: T[]) => void | boolean,
  halt = false) {

  if (typeof done === 'boolean') {
    halt = done as boolean;
    done = undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  done = done || ((...args) => { });

  const errors: Error[] = [];
  const data: T[] = [];

  await asyncEachRun(arr, async (fn) => {
    if (halt && errors.length)
      return;
    try {
      data.push(await fn());
    }
    catch (ex) {
      errors.push(ex);
    }
  });

  done(errors, data);

  if (errors.length)
    return Promise.reject({ errors, data });

  return Promise.resolve({ errors, data });

}