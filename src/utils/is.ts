import { isValidElement } from 'react';

/**
 * Gets the JavaScript type for value.
 * 
 * @param value the value to get type for.
 */
export function getTypeOf(value: unknown) {
  return typeof value;
}

/**
 * Gets the JavaScript type for value, when object returns object, array, null or date.
 * 
 * @param value the value to get type for.
 */
export function getType(value: unknown) {

  const type = getTypeOf(value);

  if (type !== 'object')
    return type;

  if (isArray(value))
    return 'array';

  if (isNull(value))
    return 'null';

  if (isDate(value))
    return 'date';

  return 'object';

}

/**
 * Gets the JavaScript stuctural type for the specified object.
 * 
 * NOTE: values are returned as uppercase.
 * 
 * @param value the value to get structural type for.
 */
export function getConstructorType(value: unknown) {
  if (isUndefined(value))
    return 'undefined';
  if (isNull(value))
    return 'null';
  const name = value.constructor.name;
  if (name === 'Function')
    return (value as any).name || 'Function';
  return value.constructor.name;
}

/**
 * Checks if value is same type as compare value.
 * 
 * @param value the value to inspect as type.
 * @param compare the value to match as type.
 */
export function isType(value: unknown, compare: string) {
  return isEqual(getType(value), (compare || '').toLowerCase());
}

/**
 * Checks if value is same constructor type as compare value.
 * 
 * @param value the value to inspect as constructor type.
 * @param compare the value to match as constructor type.
 */
export function isConstructorType(value: unknown, compare: string) {
  return isEqual(getConstructorType(value).toLowerCase(), (compare || '').toLowerCase());
}

/**
 * Checks if value is instanceOf Type.
 * 
 * @param value the value to inspect as instanceOf.
 */
export function isInstanceOf(value: unknown, Type: any) {
  return value instanceof Type;
}

/**
 * Checks if value is a string.
 * 
 * @param value the value to inspect as string.
 */
export function isString(value: unknown) {
  return typeof value === 'string';
}

/**
 * Checks if value is a number.
 * 
 * @param value the value to inspect as number.
 */
export function isNumber(value: unknown) {
  return typeof value === 'number';
}

/**
 * Checks if value is an object.
 * 
 * @param value the value to inspect as object.
 */
export function isObject(value: unknown) {
  return value !== null && typeof value === 'object';
}

/**
 * Checks if value is a function.
 * 
 * @param value the value to inspect as function.
 */
export function isFunction(value: unknown) {
  return typeof value === 'function';
}

/**
 * Checks if value is a date instance.
 * 
 * @param value the value to inspect as date.
 */
export function isDate(value: unknown) {
  return value instanceof Date;
}

/**
 * Checks if Object is a plain object literal.
 * 
 * @param value the value to inspect as plain object literal.
 */
export function isPlainObject(value: unknown) {
  return (isObject(value) === true &&
    Object.prototype.toString.call(value) === '[object Object]') &&
    isFunction(value.constructor) &&
    value.constructor.name === 'Object';
};

/**
 * Checks if value is a JavaScript Primitive.
 * 
 * @param value the value to inspect as primitive.
 */
export function isPrimitive(value: unknown) {
  return value !== Object(value);
}

/**
 * Compares two values and determines if they are equal.
 * 
 * @param value the value to be compared.
 * @param compare the value to match as equal.
 */
export function isEqual(value: unknown, compare: unknown) {
  return value === compare;
}

/**
 * Compares two values and determines if they are NOT equal.
 * 
 * @param value the value to be compared.
 * @param compare the value to inspect as NOT equal.
 */
export function isNotEqual(value: unknown, compare: unknown) {
  return !isEqual(value, compare);
}

/**
 * Checks if two objects are deeply equal.
 * NOTE: this is a loose check for most common scenarios.
 * If you need something more robust checkout Lodash _.isDeepEqual
 * 
 * @param value the value to be compared.
 * @param compare the value to inspect as deep equal.
 */
export function isDeepEqual(value: unknown, compare: unknown) {

  function deepEqual(obj1, obj2) {

    // it's just the same object. No need to compare.
    if (obj1 === obj2)
      return true;

    // compare primitives no need to iterate.
    if (isPrimitive(obj1) && isPrimitive(obj2))
      return obj1 === obj2;

    if (Object.keys(obj1).length !== Object.keys(obj2).length)
      return false;

    const cType1 = getConstructorType(obj1);
    const cType2 = getConstructorType(obj1);

    if (isNotEqual(cType1, cType2))
      return false;

    // If structural type is Map or Set
    // Convert to simple objects to compare.
    if (['Map', 'WeakMap', 'Set', 'WeakSet'].includes(cType1)) {
      obj1 = Object.fromEntries(obj1);
      obj2 = Object.fromEntries(obj2);
    }

    // compare objects with same number of keys
    for (let key in obj1) {

      // other object doesn't have this prop.
      if (!(key in obj2))
        return false;

      if (!deepEqual(obj1[key], obj2[key]))
        return false;

    }

    return true;

  }

  return deepEqual(value, compare);

}

/**
 * Checks if two objects are NOT deeply equal.
 * 
 * @param value the value to be compared.
 * @param compare the value to inspect as NOT deep equal.
 */
export function isNotDeepEqual(value: unknown, compare: unknown) {
  return !isDeepEqual(value, compare);
}

/**
 * Checks if string, array or object is empty object.
 * 
 * @param value the value to inspect as empty string, array or object.
 */
export function isEmpty(value: unknown) {
  return (
    (isString(value) && isEqual(value, '')) ||
    (isArray(value) && isEqual((value as any[]).length, 0)) ||
    (isPlainObject(value) && isEqual(Object.keys(value as object).length, 0))
  );
}

/**
 * Checks if value is boolean.
 * 
 * @param value the value to inspect as boolean.
 * @param loose when true will return true if 'true' or 'false' or 0 or 1.
 */
export function isBoolean(value: unknown, loose = false) {
  if (!loose)
    return typeof value === 'boolean';
  if (typeof value === 'number')
    return value === 0 || value === 1;
  if (typeof value === 'string')
    return /(true|false)/.test(value);
  return false;
}

/**
 * Checks if has some value.
 * 
 * @param value the value to inspect as having some value.
 */
export function isValue(value: unknown) {
  return !isUndefined(value) && !isNull(value) && !isNaN(value as number);
}

/**
 * Checks if is true.
 * 
 * @param value the value to inspect as true.
 * @param loose when true, returns true if true, 1 or 'yes'.
 */
export function isTrue(value: unknown, loose = false) {
  if (!loose)
    return value === true;
  return value === 1 || value === 'true' || value === 'yes';
}

/**
 * Checks if is false.
 * 
 * @param value the value to inspect as false.
 * @param loose when true, returns false if false, 0 or 'no'.
 */
export function isFalse(value: unknown, loose = false) {
  if (!loose)
    return value === true;
  return value === 0 || value === 'false' || value === 'no';
}

/**
 * Checks if value is null.
 * 
 * @param value the value to inspect as null.
 */
export function isNull(value: unknown) {
  return value === null;
}

/**
 * Checks if value is undefined.
 * 
 * @param value the value to inspect as undefined.
 */
export function isUndefined(value: unknown) {
  return typeof value === 'undefined';
}

/**
 * Checks if value is an array.
 * 
 * @param value the value to inspect as array.
 */
export function isArray(value: unknown) {
  return Array.isArray(value);
}

/**
 * Checks if the value is a promise.
 * 
 * @param value the value to inspect as a promise.
 */
export function isPromise(value: unknown) {
  return Promise.resolve(value) === value;
}

/**
 * Checks if is React Class Component.
 * 
 * @param component the component to inspect.
 */
export function isClassComponent(component: unknown) {
  return (
    typeof component === 'function' &&
    !!component.prototype.isReactComponent
  )
}

/**
 * Checks if is React Functional or Stateless Component.
 * 
 * @param component the conponent to inspect.
 */
export function isFunctionComponent(component: unknown) {
  return (
    typeof component === 'function' &&
    String(component).includes('return React.createElement')
  )
}

/**
 * Returns true if HOC Component or Class Component or 
 * if is Functional/Stateless component.
 * 
 * @param component the component to inspect.
 */
export function isReactComponent(component: unknown) {
  return (
    isClassComponent(component) ||
    isFunctionComponent(component)
  )
}

/**
 * Checks if element is valid React element.
 * 
 * @param element the element to inspect if is valie.
 */
export function isElement(element: unknown) {
  return isValidElement(element);
}

/**
 * Checks if element is DOM type element.
 * 
 * @param element the element to inspect as DOM.
 */
export function isDOMTypeElement(element: unknown) {
  return isElement(element) && typeof (element as any).type === 'string';
}

/**
 * Checks if element is Composite type element.
 * 
 * @param element the element to inspect as composite.
 */
export function isCompositeTypeElement(element: unknown) {
  return isElement(element) && typeof (element as any).type === 'function';
}