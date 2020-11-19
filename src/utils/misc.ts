import md5 from 'md5';

/**
 * Non operation function.
 * 
 * @param args 
 */
export function noop(...args: any[]) { };

/**
 * Simply returns noop if function is not defined.
 * 
 * @param fn the function to ensure as func or noop.
 */
export function toNoop(fn: (...args: any[]) => any) {
  return fn || noop;
}

/**
 * Indicates DOM is ready and usable.
 */
export function DOMEnabled() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

/**
 * Gets a gravatar based on email address.
 * 
 * @param email the email address to get gravatar for.
 * @param size the size of the gravatar.
 */
export function getGravatar(email: string, size: number): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&r=g&d=mm`;
}

/**
 * Promise wrapper that returns an object when used
 * with `await` preventing the need for try/catch.
 * 
 * @example
 * const { err, data } = await promise(Promise);
 * 
 * @param promise the promise to be executed.
 */
export function promise<T>(promise?: Promise<T>) {
  return promise
    .then(data => ({ err: null, data }))
    .catch(err => ({ err, data: null })) as { err?: Error & { [key: string]: any; }, data?: T; };
}

