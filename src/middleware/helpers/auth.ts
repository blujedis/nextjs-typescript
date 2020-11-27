import { Middleware } from '../types';
import rolemgr, { Roles, RoleNegated } from 'knect/roles';

// we already parsed our user/token
// in earlier middleware so here we just
// check for the user and any roles
// that are specified.

export const isAuthenticated = (): Middleware<void> => {
  return (req, res, next) => {
    if (!req.user)
      return res.unauthenticated(`This resource requires authentication.`);
    next();
  };
};

export const isAuthorized = (...roles: (Roles | RoleNegated)[]): Middleware<void> => {
  return (req, res, next) => {
    if (!req.user)
      return res.unauthenticated(`This resource requires authentication.`);
    if (!roles.length)
      return res.unauthorized(`Account ${req.user.username} not authorized for this resource.`);
    if (!rolemgr.isAuthorized(roles, req.user.roles))
      return res.unauthorized(`Account ${req.user.username} not authorized for this resource.`);
    next();
  };
};