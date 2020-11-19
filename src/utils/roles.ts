
export type RoleMap<T extends Object> = { [K in keyof T]: keyof T[] };

export type RoleKey<T> = keyof T;

export function normalizeMap<T extends Object>(map: T) {

  const ROLES: RoleMap<T> = {} as any;

  for (const k in map) {

    if (!map.hasOwnProperty(k)) continue;
    let val = map[k] || [];

    if (typeof val === 'string')
      val = [val];

    if (!Array.isArray(val))
      throw new Error(`Failed to normalize Role ${k}, could NOT be normalized to array.`);

    if ((val as any).length && typeof val[0] !== 'string')
      throw new Error(`Invalid Role argument type of ${typeof val[0]}.`);

    ROLES[k] = val as any;

  }

  return ROLES;

}

export default function roleManager<M>(initMap: M) {

  const MAP = normalizeMap(initMap);

  type RoleMap = typeof MAP;

  type Role = RoleKey<RoleMap> | '*';

  /**
   * Ensures the value is an array or empty array when undefined.
   * 
   * @param val the value to inspect as array.
   * @param nullAsUndefined when true null is treated as undefined, returns empty array.
   */
  function ensureArray<T>(val: T, nullAsUndefined = false): T[] {
    if (typeof val === 'undefined' || (nullAsUndefined && val === null) || Array.isArray(val))
      return (val || []) as T[];
    return [val];
  }

  /**
   * Flattens multi dimensional array.
   * 
   * @param arr the array to be flattened. 
   */
  function flatten<T>(arr: T[]): T[] {
    return arr.reduce((a, c) => [...a, ...(Array.isArray(c) ? flatten(c as any) : [c])], []);
  }

  /**
   * Checks if a list of roles contains a role.
   * 
   * @param roles the allowed array of roles.
   * @param role the role that should be present.
   */
  function hasRole(roles: Role | Role[], role: Role) {
    return ensureArray(roles).includes(role);
  }

  /**
  * Ensures the role does NOT exist in the list of roles.
  * 
  * @param roles the allowed array of roles.
  * @param role the role that should NOT be present.
  */
  function notHasRole(roles: Role | Role[], role: Role) {
    return !hasRole(roles, role);
  }

  /**
   * Checks if any allowable role exists in compare list.
   * 
   * @param roles the allowed roles.
   * @param compare roles that may exist in roles.
   */
  function hasAnyRole(roles: Role | Role[], compare: Role | Role[]) {
    roles = ensureArray<Role>(roles as any);
    if (!roles.length) return false;
    return roles.some(r => hasRole(compare, r));
  }

  /** 
   * Checks if list of roles contains public role.
   * 
   * @param roles the roles to inspect.
   */
  function hasAnonRole(...roles: (Role | Role[])[]) {
    roles = flatten(roles);
    return roles.includes('*');
  }

  /**
   * Checks if list of roles does NOT contains public role.
   * 
   * @param roles the roles to inspect.
   */
  function hasNotAnonRole(...roles: (Role | Role[])[]) {
    roles = flatten(roles);
    return !roles.includes('*');
  }

  /**
   * Removes duplicates from array ensuring unique values.
   * 
   * @param roles list of roles to deduplicate.
   */
  function dedupe(roles: Role[]) {
    return roles.sort().filter((v, i, a) => (!i || v != a[i - 1]));
  }

  /**
   * Gets the array of roles at a specified key and then normalizes.
   * 
   * @param role the role key to get.   
   */
  function getRole(role: Role) {
    if (role === '*')
      return ['*'] as Role[];
    if (!MAP[role as any])
      return null;
    // Always include the role itself. We'll filter dupes.
    return dedupe([...(MAP[role as any] || [] as any), role]);
  }

  /**
   * Adds Role to collection ensuring unique.
   * 
   * @param roles the roles to add to.
   * @param role the role to be added.
   */
  function addRole(roles: Role[], role: Role) {
    return dedupe([...roles, role]);
  }

  /**
  * Looks up each role key and cascades child roles.
  * 
  * @param roles the roles to be cascaded.
  */
  function cascade(...roles: (Role | Role[])[]): Role[] {
    roles = flatten(roles);
    if (!roles.length)
      return roles as Role[];
    const allRoles = (roles as Role[]).map(getRole);
    console.log(allRoles);
    return allRoles.reduce((a, c) => {
      c.forEach(r => {
        if (r && !a.includes(r))
          a.push(r);
      });
      return a;
    }, [] as Role[]);
  }

  /**
   * Compares array of roles to required with optional excluded roles
   * that may NOT be present in compare roles.
   * 
   * @param allowed array or allowed roles to be authorized.
   * @param compare array of roles to compare to required.
   */
  function authorize(allowed: Role | Role[], compare: Role | Role[]) {

    const api = {
      _allowAnon: false,       // this is useful when compare might be empty.
      _strict: false,           // when true roles are NOT cascaded.
      _excluded: [] as Role[],  // compare roles that may not be present.
      _required: ensureArray(allowed) as Role[],
      _compare: ensureArray(compare) as Role[],
      strict: () => api._strict = true,
      exclude: (excluded: Role | Role[]) => api._excluded = ensureArray(excluded) as Role[],
      allowAnon: () => api._allowAnon = true,
      verify
    };

    function verify() {

      // If no compare length but allowAnon enabled 
      // then let'em through.
      if (api._allowAnon && !api._compare.length)
        return true;

      // Cascade building any all child roles.
      if (!api._strict) {
        if (api._excluded.length)
          api._excluded = cascade(api._excluded);
        api._required = cascade(api._required);
        api._compare = cascade(api._compare);
      }

      // Check if user compare roles exist in allowed roles.
      return hasAnyRole(allowed, compare);

    }

    return api;

  }

  return {
    MAP,
    getRole,
    addRole,
    hasRole,
    notHasRole,
    hasAnyRole,
    hasAnonRole,
    hasNotAnonRole,
    authorize,
    dedupe,
    cascade,
    flatten,
    ensureArray
  }

}
